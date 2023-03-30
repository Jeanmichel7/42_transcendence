import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';


import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService,
    ) {}

    async logIn(username: string, pass: string): Promise<any> {
        const user = await this.usersService.findOneByPseudo(username);
        if (!user) {
            throw new NotFoundException();
        }
        // console.error("pass: ", pass, " user.password: ", user.password)

        const isMatch = await bcrypt.compare(pass, user.password);
        if (!isMatch) {
            throw new UnauthorizedException();
        }
        console.log("password match")

        const payload = { username: user.pseudo, sub: user.id };
        // console.log("payload : ", payload);

        const token = await this.jwtService.signAsync(payload);
        console.log("token creation: ", token);
        return {
            access_token: token,
        };


    }
}