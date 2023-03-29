import { Body, Controller, Post, HttpCode, HttpStatus, Get } from '@nestjs/common';
import { AuthService } from './auth.service';

import { AuthDto } from './dto/auth-user.dto';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) { }

    @Get()
    getHello(): string {
        return "Je suis bien la";
    }

    @HttpCode(HttpStatus.OK)
    @Post('login')
    signIn(@Body() signInDto: AuthDto) {
        return this.authService.signIn(signInDto.pseudo, signInDto.password);
    }
}


