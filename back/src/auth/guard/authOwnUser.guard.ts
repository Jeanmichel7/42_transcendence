import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Observable } from 'rxjs';
import { Repository } from 'typeorm';
import { UserInfo } from 'src/typeorm';

@Injectable()
export class AuthOwnUserGuard implements CanActivate {
    constructor(
        private jwtService: JwtService,
        private reflector: Reflector,
        @InjectRepository(UserInfo) private readonly userRepository: Repository<UserInfo>
    ) {}

    async canActivate(context: ExecutionContext,): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const token = request.headers.authorization?.split(' ')[1];

        if(!token)
            throw new UnauthorizedException("You are not authorized to access this resource")
        const payload = this.jwtService.verify(token);
        const id = request.params.id;
        if (payload.sub === id)
            return true;

        const user = await this.userRepository.findOneBy({ id: payload.sub });
        if (!user)
            return false;
        if (user.role === "admin")
            return true;

        throw new UnauthorizedException("You are not authorized to access this resource")
    }
}
