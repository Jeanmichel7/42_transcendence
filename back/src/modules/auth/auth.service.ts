import {
  BadRequestException,
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
// import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    // private readonly configService: ConfigService,
    private usersService: UsersService,
    private jwtService: JwtService,
    private cryptoService: CryptoService,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>, // private readonly httpService: HttpService
  ) {
    // console.log('JWT_SECRET:', configService.get<string>('JWT_SECRET'));
  }

  // renvoi tout user mais osef on va te suprimer
  async login(data: UserLoginDTO): Promise<AuthInterface> {
    const user: UserEntity = await this.userRepository.findOneBy({
      login: data.login,
    });
    if (!user) throw new NotFoundException(`User ${data.login} not found`);

    const isMatch = await bcrypt.compare(data.password, user.password);
    if (!isMatch) throw new BadRequestException(`Wrong password`);

    const res: AuthInterface = {
      accessToken: '',
      user: user,
    };
    if (user.is2FAEnabled) return res;

    res.accessToken = await this.createJWT(user);
    return res;
  }

  async logInOAuth(code: string): Promise<AuthInterface> {
    const accessToken: string = await this.OAuthGetToken(code);
    const userData42: UserInterface = await this.OAuthGetUserData(accessToken);

    let user: UserInterface = null;
    if (await this.userAlreadyExist(userData42.email)) {
      console.error('User already exist');
      user = await this.findUserByMail(userData42.email);
    } else {
      console.error('createOAuthUser');
      user = await this.usersService.createOAuthUser(userData42);
    }

    const res: AuthInterface = {
      accessToken: `need2FA,userId:${user.id}`,
      user: user,
    };
    if (user.is2FAEnabled) return res;

    res.accessToken = await this.createJWT(user);
    return res;
  }

  async loginOAuth2FA(code: string, userId: bigint) {
    // console.log('userId', userId, typeof userId);
    const user: UserEntity = await this.userRepository.findOne({
      where: { id: userId },
      select: ['id', 'firstName', 'lastName', 'login', 'secret2FA', 'role'],
    });
    // console.log('user : ', user);
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

    // const user = await this.usersService.findUser(userId);
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

  private async OAuthGetToken(code: string): Promise<string> {
    const clientId =
      'u-s4t2ud-406bbf6d602e19bc839bfe3f45f42cf949704f9d71f1de286e9721bcdeff5171';
    const clientSecret =
      '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';

    try {
      const tokenResponse = await axios.post(
        'https://api.intra.42.fr/oauth/token',
        {
          grant_type: 'authorization_code',
          client_id: clientId,
          client_secret: clientSecret,
          code: code,
          redirect_uri: 'http://localhost:3000/auth/loginOAuth',
        },
      );
      // console.log("tokenResponse : ", tokenResponse)
      // if(tokenResponse.status != 200) {
      //     throw new HttpException("Invalid code", tokenResponse.status);
      // }
      return tokenResponse.data.access_token;
    } catch (error) {
      throw new UnauthorizedException(
        error.response.data.message,
        error.status,
      );
    }
  }

  private async OAuthGetUserData(accessToken: string): Promise<any> {
    try {
      const data = await axios.get('https://api.intra.42.fr/v2/me', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      // if(data.status != 200) {
      //     throw new HttpException("Invalid code", data.status);
      // }
      // console.log("data : ", data.data);
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
    console.error('createJWT : ', user, token);
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
