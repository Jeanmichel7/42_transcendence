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
  // UseGuards,
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
// import { AuthAdmin } from './guard/authAdmin.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Get('isAuthenticated')
  async isAuth(@Req() req: RequestWithUser): Promise<boolean> {
    // console.log('test route isAutheticated : ', req.user);
    if (req.user.id != undefined) return true;
    else return false;
  }

  /*
	https://api.intra.42.fr/oauth/authorize?client_id=u-s4t2ud-406bbf6d602e19bc839bfe3f45f42cf949704f9d71f1de286e9721bcdeff5171&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Fauth%2FloginOAuth&response_type=code
	*/
  @Get('loginOAuth')
  @Public()
  async logInOAuth(
    @Query('code') code: string,
    @Res() res: Response,
  ): Promise<void> {
    const result: AuthInterface = await this.authService.logInOAuth(code);
    console.log('token : ', result.accessToken);
    res.cookie('jwt', result.accessToken, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 999, //999 jours
      sameSite: 'strict',
    });
    res.redirect(`http://localhost:3006/connection`);
  }

  // supprimer plus tard
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
    console.log('body : ', body);
    const result: AuthInterface = await this.authService.loginOAuth2FA(
      body.code,
      body.userId,
    );
    console.log('token : ', result.accessToken);
    res.cookie('jwt', result.accessToken, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 999, //999 jours
      sameSite: 'strict',
    });
    res.status(200).send({ message: 'Connexion réussie' });
  }

  @Public() // remove ?
  @Get('check-2FA')
  async checkJwtCookie(
    @Req() req: RequestWithUser,
    @Res() res: Response,
  ): Promise<void> {
    const jwtCookie: string = req.cookies['jwt'];
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
  // @UseGuards(AuthAdmin)
  async adminActive2fa(
    @Param('userId', ParseIntPipe) userId: bigint,
  ): Promise<string> {
    const result: string = await this.authService.active2fa(userId);
    return result;
  }

  @Put(':userId/desactive2fa')
  // @UseGuards(AuthAdmin)
  async adminDesactive2fa(
    @Param('userId', ParseIntPipe) userId: bigint,
  ): Promise<UserInterface> {
    const result: UserInterface = await this.authService.desactive2fa(userId);
    return result;
  }
}
