import { Query, Controller, Get, Post, UsePipes, ValidationPipe, Body } from '@nestjs/common';

import { AuthService } from './auth.service';
import { Public } from 'src/modules/auth/decorators/public.decorator';

import { AuthResponse } from './interfaces/auth.interface';
import { UserLoginDTO } from '../users/dto/user.login.dto';

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

}

