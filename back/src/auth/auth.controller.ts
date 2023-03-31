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
        return this.authService.logIn(signInDto.pseudo, signInDto.password);
    }

/*
https://api.intra.42.fr/oauth/authorize?client_id=u-s4t2ud-406bbf6d602e19bc839bfe3f45f42cf949704f9d71f1de286e9721bcdeff5171&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Fauth%2FloginOauth&response_type=code
*/
    @Public()
    @Get('loginOauth')
    async logInOauth(@Req() req: Request, @Res() res: Response) {
        let token = await this.authService.logInOauth(req, res);
        console.log("token : ", token);

        let result = {
            token: token,
            message: "Vous êtes connecté",
            redirection: "http://localhost:5500/front/index.html"
        }

        // const redirectUrl = `http://localhost:5500/front/index.html`;
        // return res.redirect(redirectUrl);
        return res.status(HttpStatus.OK).json(result);
    }

    // @Public()
    // @Get('loginOauth')
    // logInOauth() {

    //     // return this.authService.logInOauth();
    // }

//http://localhost:5500/front/?code=d0252129f3fddc9aa70ebda1c32eb9c51957ca6470c06fa7ba8a9af57cd943c6
//http://localhost:5500/front/?error=access_denied&error_description=The+resource+owner+or+authorization+server+denied+the+request.



    // @UseGuards(AuthGuard)
    // @Get('profile')
    // getProfile(@Request() req) {
    //     return req.user;
    // }
    
}
