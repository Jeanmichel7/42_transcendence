import {
  BadRequestException,
  HttpException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { toDataURL } from 'qrcode';
import * as crypto from 'crypto';
import * as bcrypt from 'bcrypt';
import axios from 'axios';

import { UsersService } from 'src/modules/users/users.service';
import { JwtService } from '@nestjs/jwt';

import { UserInterface } from '../users/interfaces/users.interface';
import { UserLoginDTO } from '../users/dto/user.login.dto';
import { UserEntity } from '../users/entity/users.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, UpdateResult } from 'typeorm';
import { authenticator } from 'otplib';
import { AuthInterface } from './interfaces/auth.interface';
import { CryptoService } from '../crypto/crypto.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private readonly configService: ConfigService,
    private usersService: UsersService,
    private jwtService: JwtService,
    private cryptoService: CryptoService,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {
    // console.log('JWT_SECRET:', configService.get<string>('JWT_SECRET'));
  }

  async login(data: UserLoginDTO): Promise<AuthInterface> {
    const user: UserEntity = await this.userRepository.findOneBy({
      login: data.login,
    });
    if (!user)
      throw new NotFoundException(`User login ${data.login} not found`);

    const isMatch = await bcrypt.compare(data.password, user.password);
    if (!isMatch) throw new BadRequestException(`Wrong password`);

    const res: AuthInterface = {
      accessToken: `need2FA,userId:${user.id}`,
      user: user,
    };
    if (user.is2FAEnabled) return res;

    /* update status user */
    const resultUpdate: UpdateResult = await this.userRepository.update(
      { id: user.id },
      {
        status: 'online',
        updatedAt: new Date(),
      },
    );
    if (resultUpdate.affected === 0)
      throw new BadRequestException(`User ${user.id} has not been updated.`);

    res.accessToken = await this.createJWT(user);
    return res;
  }

  async logout(userId: bigint): Promise<void> {
    const user: UserEntity = await this.userRepository.findOne({
      where: { id: userId },
      select: ['id', 'status', 'updatedAt'],
    });
    if (!user) throw new NotFoundException(`User ${userId} not found`);

    const resultUpdate: UpdateResult = await this.userRepository.update(
      { id: userId },
      {
        status: 'offline',
        updatedAt: new Date(),
      },
    );
    if (resultUpdate.affected === 0)
      throw new BadRequestException(`User ${userId} has not been updated.`);
  }

  async logInOAuth(code: string): Promise<AuthInterface> {
    let accessToken: string;
    let clientSecret: string;
    try {
      clientSecret = this.configService.get<string>('OAUTH_INTRA');
      accessToken = await this.OAuthGetToken(code, clientSecret);
    } catch (e) {
      console.error(
        'Error OAuthGetToken, first token expired, test second token',
        e,
      );
      try {
        clientSecret = this.configService.get<string>('OAUTH_INTRA_NEXT');
        accessToken = await this.OAuthGetToken(code, clientSecret);
      } catch (e) {
        throw new UnauthorizedException('Intra OAuth: ' + e.response, e.status);
      }
    }
    const userData42: UserInterface = await this.OAuthGetUserData(accessToken);

    let user: UserInterface = null;
    if (await this.userAlreadyExist(userData42.email)) {
      // console.log('User already exist');
      user = await this.findUserByMail(userData42.email);
    } else {
      // console.log('createOAuthUser');
      user = await this.usersService.createOAuthUser(userData42);
    }

    /* check 2FA */
    const res: AuthInterface = {
      accessToken: `need2FA,userId:${user.id}`,
      user: user,
    };
    if (user.is2FAEnabled) return res;

    /* update status user */
    const resultUpdate: UpdateResult = await this.userRepository.update(
      { id: user.id },
      {
        status: 'online',
        updatedAt: new Date(),
      },
    );
    if (resultUpdate.affected === 0)
      throw new BadRequestException(`User ${user.id} has not been updated.`);

    res.accessToken = await this.createJWT(user);
    return res;
  }

  async loginOAuth2FA(code: string, userId: bigint) {
    const user: UserEntity = await this.userRepository.findOne({
      where: { id: userId },
      select: ['id', 'firstName', 'lastName', 'login', 'secret2FA', 'role'],
    });
    if (!user) throw new NotFoundException(`User ${userId} not found`);

    let decryptedSecret = crypto
      .privateDecrypt(
        this.cryptoService.getPrivateKey(),
        Buffer.from(user.secret2FA, 'base64'),
      )
      .toString();

    const codeIsValid = authenticator.verify({
      token: code,
      secret: decryptedSecret,
    });
    decryptedSecret = null;
    if (!codeIsValid) throw new BadRequestException(`Wrong code`);

    const resultUpdate: UpdateResult = await this.userRepository.update(
      { id: userId },
      {
        status: 'online',
        updatedAt: new Date(),
      },
    );
    if (resultUpdate.affected === 0)
      throw new BadRequestException(`User ${userId} has not been updated.`);

    return {
      accessToken: await this.createJWT(user),
      user: user,
    };
  }

  /* ************************************************ */
  /*                                                  */
  /*                         2FA                      */
  /*                                                  */
  /* ************************************************ */

  async active2fa(userId: bigint): Promise<string> {
    const userToUpdate: UserInterface = await this.usersService.findUser(
      userId,
    );
    if (!userToUpdate)
      throw new NotFoundException(`User with id ${userId} not found`);

    if (userToUpdate.is2FAEnabled)
      throw new BadRequestException(
        `2FA of user ${userId} is already enabled.`,
      );

    const secret2FA: string = authenticator.generateSecret();
    const encryptedSecret: string = crypto
      .publicEncrypt(this.cryptoService.getPublicKey(), Buffer.from(secret2FA))
      .toString('base64');

    const resultUpdate: UpdateResult = await this.userRepository.update(
      { id: userId },
      {
        is2FAEnabled: true,
        secret2FA: encryptedSecret,
        updatedAt: new Date(),
      },
    );
    if (resultUpdate.affected === 0)
      throw new BadRequestException(
        `L'option 2FA de l'user ${userId} has not be enabled.`,
      );

    const otpauthUrl: string = authenticator.keyuri(
      userToUpdate.email,
      'Transcendence',
      secret2FA,
    );
    const qrcode: string = await toDataURL(otpauthUrl);
    return qrcode;
  }

  async desactive2fa(userId: bigint): Promise<UserInterface> {
    const userToUpdate = await this.usersService.findUser(userId);
    if (!userToUpdate)
      throw new NotFoundException(`User with id ${userId} not found`);

    if (!userToUpdate.is2FAEnabled)
      throw new BadRequestException(
        `2FA of user ${userId} is already disabled.`,
      );

    const resultUpdate = await this.userRepository.update(
      { id: userId },
      {
        is2FAEnabled: false,
        secret2FA: null,
        updatedAt: new Date(),
      },
    );
    if (resultUpdate.affected === 0)
      throw new BadRequestException(
        `2FA of user ${userId} has not been disabled.`,
      );

    const user = await this.usersService.findUser(userId);
    return user;
  }

  /* ************************************************ */
  /*                                                  */
  /*                      Utils                       */
  /*                                                  */
  /* ************************************************ */

  private async OAuthGetToken(
    code: string,
    clientSecret: string,
  ): Promise<string> {
    const clientId: string = this.configService.get<string>('CLIENT_ID');
    const redirect_uris = [
      'http://pcbureau:3006/oauthredirection',
      'http://localhost:3006/oauthredirection',
      'http://k1r2p1:3006/oauthredirection',
      'http://k1r2p2:3006/oauthredirection',
      'http://k1r2p3:3006/oauthredirection',
      'http://k1r2p4:3006/oauthredirection',
      'http://k1r2p5:3006/oauthredirection',
      'http://k1r2p6:3006/oauthredirection',
      'http://k1r2p7:3006/oauthredirection',
      'http://k1r2p8:3006/oauthredirection',
      'http://k0r3p1:3006/oauthredirection',
      'http://k0r3p2:3006/oauthredirection',
      'http://k0r3p3:3006/oauthredirection',
      'http://k0r3p4:3006/oauthredirection',
      'http://k0r3p5:3006/oauthredirection',
      'http://k0r3p6:3006/oauthredirection',
      'http://k0r3p7:3006/oauthredirection',
      'http://k0r3p8:3006/oauthredirection',
      'http://k0r3p9:3006/oauthredirection',
      'http://k0r3p10:3006/oauthredirection',
      'http://k0r3p11:3006/oauthredirection',
      'http://k0r3p12:3006/oauthredirection',
      'http://k0r3p13:3006/oauthredirection',
      'http://k0r3p14:3006/oauthredirection',
      'http://k0r4p1:3006/oauthredirection',
      'http://k0r4p2:3006/oauthredirection',
      'http://k0r4p3:3006/oauthredirection',
      'http://k0r4p4:3006/oauthredirection',
      'http://k0r4p5:3006/oauthredirection',
      'http://k0r4p7:3006/oauthredirection',
      'http://k0r4p8:3006/oauthredirection',
      'http://k0r4p9:3006/oauthredirection',
      'http://k0r4p10:3006/oauthredirection',
      'http://k0r4p11:3006/oauthredirection',
      'http://k0r4p12:3006/oauthredirection',
      'http://k0r4p13:3006/oauthredirection',
      'http://k0r4p14:3006/oauthredirection',
      'http://k0r1p1:3006/oauthredirection',
      'http://k0r1p2:3006/oauthredirection',
      'http://k0r1p3:3006/oauthredirection',
      'http://k0r1p4:3006/oauthredirection',
      'http://k0r1p5:3006/oauthredirection',
      'http://k0r1p6:3006/oauthredirection',
      'http://k0r1p7:3006/oauthredirection',
      'http://k0r1p8:3006/oauthredirection',
      'http://k0r1p9:3006/oauthredirection',
      'http://k0r1p10:3006/oauthredirection',
      'http://k0r1p11:3006/oauthredirection',
      'http://k0r1p12:3006/oauthredirection',
      'http://k0r1p13:3006/oauthredirection',
      'http://k0r1p14:3006/oauthredirection',
      'http://k0r2p1:3006/oauthredirection',
      'http://k0r2p2:3006/oauthredirection',
      'http://k0r2p3:3006/oauthredirection',
      'http://k0r2p4:3006/oauthredirection',
      'http://k0r2p5:3006/oauthredirection',
      'http://k0r2p6:3006/oauthredirection',
      'http://k0r2p7:3006/oauthredirection',
      'http://k0r2p8:3006/oauthredirection',
      'http://k0r2p9:3006/oauthredirection',
      'http://k0r2p10:3006/oauthredirection',
      'http://k0r2p11:3006/oauthredirection',
      'http://k0r2p12:3006/oauthredirection',
      'http://k0r2p13:3006/oauthredirection',
      'http://k0r2p14:3006/oauthredirection'
    ];
    let error: any = null;
    const handleError = (error: any) => {
      throw new HttpException(
        error.response.data.error + ':' + error.response.data.error_description,
        error.status,
        {
          cause: new UnauthorizedException(),
        },
      );
    };

    for (const redirect_uri of redirect_uris) {
      try {
        const tokenResponse = await axios.post(
          'https://api.intra.42.fr/oauth/token',
          {
            grant_type: 'authorization_code',
            client_id: clientId,
            client_secret: clientSecret,
            code: code,
            redirect_uri: redirect_uri,
          },
        );
        if (tokenResponse.status == 200) return tokenResponse.data.access_token;
      } catch (e) {
        error = e;
      }
    }
    handleError(error);
  }

  private async OAuthGetUserData(accessToken: string): Promise<any> {
    try {
      const data = await axios.get('https://api.intra.42.fr/v2/me', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      return data.data;
    } catch (error) {
      throw new UnauthorizedException(
        error.response.data.message,
        error.status,
      );
    }
  }

  async findUserByMail(email: string): Promise<UserInterface> {
    const user: UserEntity = await this.userRepository.findOne({
      where: { email: email },
      select: ['id', 'firstName', 'lastName', 'login', 'is2FAEnabled', 'role'],
    });

    if (!user) throw new NotFoundException(`User ${email} not found`);
    const result: UserInterface = { ...user };
    return result;
  }

  private async createJWT(user: UserInterface): Promise<string> {
    const payload = { id: user.id, login: user.login, role: user.role };
    const token = await this.jwtService.signAsync(payload);
    return token;
  }

  private async userAlreadyExist(email: string): Promise<boolean> {
    const user: UserEntity = await this.userRepository.findOne({
      where: { email: email },
      select: ['id'],
    });
    if (!user) return false;
    return true;
  }
}
