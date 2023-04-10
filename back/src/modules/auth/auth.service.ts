import { BadRequestException, HttpException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import * as bcrypt from 'bcrypt';
import { Observable } from 'rxjs';
import { AxiosResponse, AxiosError } from 'axios';
import { catchError, firstValueFrom } from 'rxjs';
import axios from 'axios';

import { Response, Request } from 'express';

import { UsersService } from 'src/modules/users/users.service';
import { JwtService } from '@nestjs/jwt';

import { UserInterface } from '../users/interfaces/users.interface';
import { UserLoginDTO } from '../users/dto/user.login.dto';
import { UserEntity } from '../users/entity/users.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class AuthService {
	constructor(
		private usersService: UsersService,
		private jwtService: JwtService,
		@InjectRepository(UserEntity) private readonly userRepository: Repository<UserEntity>,
		// private readonly httpService: HttpService
	) { }

	async login(data: UserLoginDTO): Promise<string> {
		const user: UserEntity = await this.userRepository.findOneBy({ login: data.login });
		if (!user)
			throw new NotFoundException(`User ${data.login} not found`);

		const isMatch = await bcrypt.compare(data.password, user.password);
		if (!isMatch)
			throw new BadRequestException(`Wrong password`);

		const payload = { username: user.login, sub: user.id };
		const token = await this.jwtService.signAsync(payload);
		return token;
	}

	async logInOAuth(code: string): Promise<string> {
		// console.error("code: ", code);
		// check req.querry
		const accessToken: string = await this.OAuthGetToken(code);
		const userData: UserInterface = await this.OAuthGetUserData(accessToken);
		// console.log("userData: ", userData);


		let user: UserInterface;
		if (await this.isLoginAvailable(userData.login))
			user = await this.usersService.createOAuthUser(userData);
		else
			user = await this.usersService.findOneByLogin(userData.login);



		// user 2FA enable ?

		const JWToken = await this.createJWT(user);
		return JWToken;
	}

	async getActuelUser(req): Promise<UserInterface> {
		if (!req.authorization)
			throw new UnauthorizedException();
		const token = req.authorization.split(' ')[1];
		const payload = this.jwtService.verify(token);
		const user = await this.usersService.findOneByLogin(payload.username);
		return user;
	}


	
	/* ************************************************ */
	/*                                                  */
	/*                         2FA                      */
	/*                                                  */
	/* ************************************************ */
	
	async active2fa(userId: bigint): Promise<UserInterface> {
		let userToUpdate: UserInterface = await this.usersService.findUser(userId)
		if (!userToUpdate)
			throw new NotFoundException(`User with id ${userId} not found`);

		let resultUpdate = await this.userRepository.update({ id: userId }, { is2FAEnabled: true });
		if (resultUpdate.affected === 0)
			throw new BadRequestException(`L'option 2FA de l'user ${userId} has not be enabled.`);

		const user = await this.usersService.findUser(userId);
		return user;
	}

	async desactive2fa(userId: bigint): Promise<UserInterface> {
		let userToUpdate = await this.usersService.findUser(userId)
		if (!userToUpdate)
			throw new NotFoundException(`User with id ${userId} not found`);

		let resultUpdate = await this.userRepository.update({ id: userId }, { is2FAEnabled: false });
		if (resultUpdate.affected === 0)
			throw new BadRequestException(`2FA of user ${userId} has not been disabled.`);

		const user = await this.usersService.findUser(userId);
		return user;
	}


	


	/* ************************************************ */
	/*                                                  */
	/*                   Utils OAuths                   */
	/*                                                  */
	/* ************************************************ */

	private async OAuthGetToken(code: string): Promise<string> {
		let clientId: string = "u-s4t2ud-406bbf6d602e19bc839bfe3f45f42cf949704f9d71f1de286e9721bcdeff5171"
		let clientSecret: string = "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"

		try {
			const tokenResponse = await axios.post('https://api.intra.42.fr/oauth/token', {
				grant_type: 'authorization_code',
				client_id: clientId,
				client_secret: clientSecret,
				code: code,
				redirect_uri: 'http://localhost:3000/auth/loginOAuth'
			});
			// console.log("tokenResponse : ", tokenResponse)
			// if(tokenResponse.status != 200) {
			//     throw new HttpException("Invalid code", tokenResponse.status);
			// }
			return tokenResponse.data.access_token;
		}
		catch (error) {
			// console.error(error);
			throw new UnauthorizedException(error.response.data.message, error.status);
		}
	}

	private async OAuthGetUserData(accessToken: string): Promise<any> {
		try {
			const data = await axios.get('https://api.intra.42.fr/v2/me', {
				headers: {
					"Authorization": `Bearer ${accessToken}`
				}
			});
			// if(data.status != 200) {
			//     throw new HttpException("Invalid code", data.status);
			// }
			// console.log("data : ", data.data);
			return data.data;
		}
		catch (error) {
			// console.error(error.response);
			throw new UnauthorizedException(error.response.data.message, error.status);
		}
	}

	private async createJWT(user: UserInterface): Promise<string> {
		const payload = { username: user.login, sub: user.id };
		const token = await this.jwtService.signAsync(payload);
		return token
	}

	private async isLoginAvailable(login: string): Promise<Boolean> {
		const user: UserEntity = await this.userRepository.findOne({
			where: { login: login },
			select: ["id"]
		});
		if (!user)
			return true;
		return false;
	}
}