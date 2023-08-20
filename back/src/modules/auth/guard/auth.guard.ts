import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Reflector } from '@nestjs/core';

import { Request } from 'express';
import { IS_PUBLIC_KEY } from 'src/modules/auth/decorators/public.decorator';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from 'config';
import { UserUpdateEvent } from 'src/modules/notification/events/notification.event';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private reflector: Reflector,
    private readonly configService: ConfigService,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) return true;

    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromCookie(request);
    if (!token) {
      throw new UnauthorizedException("You're not logged in", 'No token found');
    }
    try {
      const jwtSecret = this.configService.get<string>('JWT_SECRET');
      const payload = await this.jwtService.verifyAsync(token, {
        secret: jwtSecret,
      });
      request.user = payload;
    } catch (e) {
      throw new UnauthorizedException('Authorization error', e.message);
    }

    // update last connection
    const user: UserEntity = await this.userRepository.findOneBy({
      id: request.user.id,
    });
    if (!user) throw new UnauthorizedException('User not found');

    user.lastActivity = new Date();
    if (user.status !== 'online') {
      const userUpdated = new UserUpdateEvent({
        id: user.id,
        status: 'online',
        login: user.login,
        avatar: user.avatar,
        updatedAt: new Date(),
      });
      this.eventEmitter.emit('user_status.updated', userUpdated);
      user.status = 'online';
    }
    await this.userRepository.save(user);

    return true;
  }

  private extractTokenFromCookie(request: Request): string | undefined {
    const jwtCookieName = 'jwt';
    const cookies = request.cookies;
    return cookies[jwtCookieName];
  }
}
