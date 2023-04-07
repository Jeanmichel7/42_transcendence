import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import { UserEntity } from 'src/modules/users/entity/users.entity';

@Injectable()
export class AuthAdmin implements CanActivate {
    constructor(
        private jwtService: JwtService,
        @InjectRepository(UserEntity) private readonly userRepository: Repository<UserEntity>
    ) {}

    async canActivate(context: ExecutionContext,): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const token = request.headers.authorization?.split(' ')[1];

        if(!token)
            throw new UnauthorizedException("You are not authorized to access this resource")
        const payload = this.jwtService.verify(token);

        const user = await this.userRepository.findOneBy({ id: payload.sub });
        if (!user)
            return false;
        if (user.role === "admin")
            return true;

        throw new UnauthorizedException("You are not authorized to access this resource")
    }
}
