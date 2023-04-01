import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Observable } from 'rxjs';

@Injectable()
export class AuthOwnUserGuard implements CanActivate {
    constructor(
        private jwtService: JwtService,
        private reflector: Reflector
    ) { }

    canActivate(context: ExecutionContext,): boolean | Promise<boolean> | Observable<boolean> {
        const request = context.switchToHttp().getRequest();
        const token = request.headers.authorization?.split(' ')[1];

        if(!token)
            throw new UnauthorizedException("You are not authorized to access this resource")
        const payload = this.jwtService.verify(token);
        const id = request.params.id;
        if (payload.sub === id)
            return true;
        throw new UnauthorizedException("You are not authorized to access this resource")
    }
}
