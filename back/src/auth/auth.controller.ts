import { Body, Controller, Request, Post, HttpCode, HttpStatus, Get, ValidationPipe, UsePipes, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from './guard/auth.guard';

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

    // @UseGuards(AuthGuard)
    // @Get('profile')
    // getProfile(@Request() req) {
    //     return req.user;
    // }
    
}
