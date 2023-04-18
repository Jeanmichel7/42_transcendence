import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Reflector } from '@nestjs/core';

import { jwtConstants } from './constants';
import { Request } from 'express';
import { IS_PUBLIC_KEY } from 'src/modules/auth/decorators/public.decorator';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private jwtService: JwtService, private reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) return true;

    const request = context.switchToHttp().getRequest();
    // const token = this.extractTokenFromHeader(request);
    const token = this.extractTokenFromCookie(request);
    console.log("token : ", token)
    if (!token) {
      throw new UnauthorizedException();
    }
    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: jwtConstants.secret,
      });
      // console.error('payload : ', payload);
      request.user = payload;
    } catch (e) {
      throw new UnauthorizedException('Authorization error', e.message);
    }
    return true;
  }

  private extractTokenFromCookie(request: Request): string | undefined {
    const jwtCookieName = 'jwt';
    const cookies = request.cookies;
    // console.log("request.cookies: ", request.cookies)

    return cookies[jwtCookieName];
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }

  async getUserByJWT(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    if (!token) {
      throw new UnauthorizedException();
    }
    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: jwtConstants.secret,
      });
      return payload;
      // request['user'] = payload;
    } catch {
      throw new UnauthorizedException();
    }
  }

  // async test(context: ExecutionContext) {
  //     const request = context.switchToHttp().getRequest();
  //     const token = this.extractTokenFromHeader(request);
  //     if (!token) {
  //         throw new UnauthorizedException();
  //     }
  //     try {
  //         const payload = await this.jwtService.verifyAsync(
  //             token,
  //             { secret: jwtConstants.secret }
  //         );
  //         // request['user'] = payload;
  //         return true
  //     } catch {
  //         throw new UnauthorizedException();
  //     }
  // }
}
