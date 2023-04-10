import { Query, Controller, Get, Post, Put, UsePipes, ValidationPipe, Body, Param, ParseIntPipe, UseGuards } from '@nestjs/common';

import { AuthService } from './auth.service';
import { Public } from 'src/modules/auth/decorators/public.decorator';

import { UserInterface } from '../users/interfaces/users.interface';

import { AuthResponse } from './interfaces/auth.interface';
import { UserLoginDTO } from '../users/dto/user.login.dto';
import { AuthOwnerAdmin } from './guard/authAdminOwner.guard';

@Controller('auth')
export class AuthController {
	constructor(private authService: AuthService) { }

	@Post('login')
	@Public()
	@UsePipes(ValidationPipe)
	async login(@Body() newUser: UserLoginDTO): Promise<AuthResponse> {
		const token: string = await this.authService.login(newUser);
		return {
			access_token: token
		};
	}

	/*
	https://api.intra.42.fr/oauth/authorize?client_id=u-s4t2ud-406bbf6d602e19bc839bfe3f45f42cf949704f9d71f1de286e9721bcdeff5171&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Fauth%2FloginOAuth&response_type=code
	*/
	@Get('loginOAuth')
	@Public()
	async logInOAuth(@Query('code') code: string): Promise<AuthResponse> {
		const token: string = await this.authService.logInOAuth(code);
		return {
			access_token: token
		};
	}

	/* ************************************************ */
	/*                                                  */
	/*                         2FA                      */
	/*                                                  */
	/* ************************************************ */

	@Put(':userId/active2fa')
	@UseGuards(AuthOwnerAdmin)
	async active2fa(@Param('userId', ParseIntPipe) userId: bigint): Promise<UserInterface> {
		const result: UserInterface = await this.authService.active2fa(userId);
		return result;
	}

	@Put(':userId/desactive2fa')
	@UseGuards(AuthOwnerAdmin)
	async desactive2fa(@Param('userId', ParseIntPipe) userId: bigint): Promise<UserInterface> {
		const result: UserInterface = await this.authService.desactive2fa(userId);
		return result;
	}


}

