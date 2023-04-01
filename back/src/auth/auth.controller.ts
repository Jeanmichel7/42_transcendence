import { Body, Controller, Req, Res, Post, HttpCode, HttpStatus, Get, ValidationPipe, UsePipes, UseGuards } from '@nestjs/common';
import { Response, Request } from 'express';

import { AuthService } from './auth.service';
// import { AuthGuard } from './guard/auth.guard';
import { Public } from 'src/auth/decorators/public.decorator';


import { AuthResponse } from './interfaces/auth.interface';
import { AuthDto } from './dto/auth-user.dto';


@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) { }

    // @Get()
    // getHello(): string {
    //     return "Je suis bien la";
    // }

    @HttpCode(HttpStatus.OK)
    @Post('login')
    @UsePipes(ValidationPipe)
    logIn(@Body() signInDto: AuthDto) : Promise<AuthResponse> {
        return this.authService.logIn(signInDto.login, signInDto.password);
    }

/*
https://api.intra.42.fr/oauth/authorize?client_id=u-s4t2ud-406bbf6d602e19bc839bfe3f45f42cf949704f9d71f1de286e9721bcdeff5171&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Fauth%2FloginOAuth&response_type=code
*/
    @Public()
    @Get('loginOAuth')
    async logInOAuth(@Req() req: Request, @Res() res: Response) {
        let token = await this.authService.logInOAuth(req, res);
        return res.status(HttpStatus.OK).json({access_token: token});
    }

    // @Public()
    // @Post('2fa')
    // async twoFactorAuth(@Req() req: Request, @Res() res: Response) {
    //     let token = await this.authService.twoFactorAuth(req, res);
    //     console.log("token : ", token);

    //     return {
    //         access_token: token,
    //     };

    // }

}

