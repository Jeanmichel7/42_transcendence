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
import { RequestWithUser } from './interfaces/request.user.interface';
import { UserLoginDTO } from '../users/dto/user.login.dto';
import { AuthDTO } from './dto/user2fa.auth.dto';
import { AuthAdmin } from './guard/authAdmin.guard';
import { ConfigService } from '@nestjs/config';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private configService: ConfigService,
  ) {}

  // @Public()
  @Get('isAuthenticated')
  async isAuth(@Req() req: RequestWithUser): Promise<boolean> {
    if (req.user?.id != undefined) return true;
    else return false;
  }

  @Get('loginOAuth')
  @Public()
  async logInOAuth(
    @Query('code') code: string,
    @Res() res: Response,
  ): Promise<void> {
    const result: AuthInterface = await this.authService.logInOAuth(code);
    // console.log('token : ', result.accessToken);
    res.cookie('jwt', result.accessToken, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 999, //999 jours
      sameSite: 'strict',
    });
    const url = this.configService.get('API_URL') + '/connection?checked=true';
    res.redirect(
      this.configService.get('API_URL') + '/connection?checked=true',
    );
  }

  @Post('loginFakeUser')
  @Public()
  @UsePipes(ValidationPipe)
  async login(
    @Body() newUser: UserLoginDTO,
    @Res() res: Response,
  ): Promise<any> {
    const result: AuthInterface = await this.authService.login(newUser);
    res.cookie('jwt', result.accessToken, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 999, //999 jours
      sameSite: 'strict',
    });
    res.status(200).send(result);
  }

  @Get('logout')
  async logOut(
    @Req() req: RequestWithUser,
    @Res() res: Response,
  ): Promise<void> {
    await this.authService.logout(req.user.id);
    res.clearCookie('jwt');
    res.status(200).send({ message: 'Déconnexion réussie' });
  }

  @Public()
  @Post('login2fa')
  async loginOAuth2FA(
    @Body() body: AuthDTO,
    @Res() res: Response,
  ): Promise<void> {
    const result: AuthInterface = await this.authService.loginOAuth2FA(
      body.code,
      body.userId,
    );
    // console.log('token : ', result.accessToken);
    res.cookie('jwt', result.accessToken, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 999, //999 jours
      sameSite: 'strict',
    });
    res.status(200).send({ message: 'Connexion réussie' });
  }

  @Public()
  @Get('check-2FA')
  async checkJwtCookie(
    @Req() req: RequestWithUser,
    @Res() res: Response,
  ): Promise<void> {
    const jwtCookie: string = req.cookies['jwt'];
    // console.log('jwt cookie : ', jwtCookie);
    if (!jwtCookie) return;
    const isNeed2FA: boolean = jwtCookie.split(',')[0] === 'need2FA';
    if (isNeed2FA) {
      res.status(200).send({
        is2FAactived: true,
        user: {
          id: jwtCookie.split(':')[1],
        },
      });
    } else {
      res.status(200).send({
        is2FAactived: false,
        user: {
          id: jwtCookie.split(':')[1],
        },
      });
    }
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
