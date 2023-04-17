import {
  Query,
  Controller,
  Get,
  Post,
  Put,
  UsePipes,
  ValidationPipe,
  Body,
  Param,
  ParseIntPipe,
  UseGuards,
  Req,
  Res,
} from '@nestjs/common';

import { Response } from 'express';
import { AuthService } from './auth.service';
import { Public } from 'src/modules/auth/decorators/public.decorator';

import { UserInterface } from '../users/interfaces/users.interface';
import { AuthInterface } from './interfaces/auth.interface';
import { RequestWithUser } from '../users/interfaces/request.user.interface';
import { UserLoginDTO } from '../users/dto/user.login.dto';
import { AuthDTO } from './dto/user2fa.auth.dto';

import { AuthAdmin } from './guard/authAdmin.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  @Public()
  @UsePipes(ValidationPipe)
  async login(@Body() newUser: UserLoginDTO): Promise<AuthInterface> {
    const result: AuthInterface = await this.authService.login(newUser);
    return result;
  }

  /*
	https://api.intra.42.fr/oauth/authorize?client_id=u-s4t2ud-406bbf6d602e19bc839bfe3f45f42cf949704f9d71f1de286e9721bcdeff5171&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Fauth%2FloginOAuth&response_type=code
	*/
  @Get('loginOAuth')
  @Public()
  async logInOAuth(
    @Query('code') code: string,
    @Res() res: Response,
  ): Promise<AuthInterface> {
    const result: AuthInterface = await this.authService.logInOAuth(code);
    res.redirect(
      `http://localhost:3006/connection?accessToken=${result.accessToken}`,
    );
    return result;
  }

  @Post('login2fa')
  @Public()
  async logInOAuth2FA(@Body() body: AuthDTO): Promise<AuthInterface> {
    const result: AuthInterface = await this.authService.loginOAuth2FA(
      body.code,
      body.userId,
    );
    return result;
  }

  /* ************************************************ */
  /*                                                  */
  /*                         2FA                      */
  /*                                                  */
  /* ************************************************ */

  @Put('enable2fa')
  async active2fa(@Req() req: RequestWithUser): Promise<string> {
    const result: string = await this.authService.active2fa(req.user.id);
    return result;
  }

  @Put('disable2fa')
  async desactive2fa(@Req() req: RequestWithUser): Promise<UserInterface> {
    const result: UserInterface = await this.authService.desactive2fa(
      req.user.id,
    );
    return result;
  }

  /* ************************************************ */
  /*                      ADMIN                       */
  /* ************************************************ */

  @Put(':userId/active2fa')
  @UseGuards(AuthAdmin)
  async adminActive2fa(
    @Param('userId', ParseIntPipe) userId: bigint,
  ): Promise<string> {
    const result: string = await this.authService.active2fa(userId);
    return result;
  }

  @Put(':userId/desactive2fa')
  @UseGuards(AuthAdmin)
  async adminDesactive2fa(
    @Param('userId', ParseIntPipe) userId: bigint,
  ): Promise<UserInterface> {
    const result: UserInterface = await this.authService.desactive2fa(userId);
    return result;
  }
}
