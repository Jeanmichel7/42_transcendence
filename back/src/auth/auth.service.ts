import { Injectable, UnauthorizedException } from '@nestjs/common';

import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService,
    ) {}

    async signIn(username: string, pass: string): Promise<any> {
        const user = await this.usersService.findOneByPseudo(username);
        if (user?.password !== pass) {
            throw new UnauthorizedException();
        }
        const payload = { username: user.pseudo, sub: user.id };
        console.log("payload : ", payload);

        const token = await this.jwtService.signAsync(payload);
        console.log("token : ", token);
        return {
            access_token: token,
        };


    }
}