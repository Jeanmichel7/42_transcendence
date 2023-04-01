import { HttpException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import * as bcrypt from 'bcrypt';
import { Observable } from 'rxjs';
import { AxiosResponse, AxiosError } from 'axios';
import { catchError, firstValueFrom } from 'rxjs';
import axios from 'axios';

import { Response, Request } from 'express';

import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';

import { CreateUserDto } from 'src/users/dto/create-user.dto';

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService,
        private readonly httpService: HttpService
    ) {}

    // async logIn(username: string, pass: string): Promise<any> {
    //     const user = await this.usersService.findOneByLogin(username);
    //     if (!user) {
    //         throw new NotFoundException();
    //     }

    //     const isMatch = await bcrypt.compare(pass, user.password);
    //     if (!isMatch) {
    //         throw new UnauthorizedException();
    //     }

    //     const payload = { username: user.login, sub: user.id };
    //     const token = await this.jwtService.signAsync(payload);
    //     return {
    //         access_token: token,
    //     };
    // }

    async logInOAuth(code: string): Promise<string> {
        // console.error("code: ", code);
        // check req.querry
        const accessToken: string = await this.OAuthGetToken(code);
        const userData: CreateUserDto = await this.OAuthGetUserData(accessToken);
        // console.log("userData: ", userData);

        
        let user: CreateUserDto;
        if (!await this.usersService.userAlreadyExist(userData.login))
            user = await this.usersService.createOAuthUser(userData);
        else
            user = await this.usersService.findOneByLogin(userData.login);
            
            
            
        // user 2FA enable ?

        const JWToken = await this.createJWT(user);
        return JWToken;
    }

    // async logInOAuth(req: Request, res: Response): Promise<any> {
    //     //check req.querry
    //     const code: string = this.OAuthGetCode(req);
    //     const accessToken: string = await this.OAuthGetToken(code);
    //     const userData: CreateUserDto = await this.OAuthGetUserData(accessToken);
    //     // console.log("userData: ", userData);

    //     // 2FA

    //     let user: CreateUserDto;
    //     if (!await this.usersService.userAlreadyExist(userData.login))
    //         user = await this.usersService.createOAuthUser(userData);
    //     else
    //         user = await this.usersService.findOneByLogin(userData.login);
    //     const JWToken = await this.createJWT(user);
    //     return JWToken;
    // }

    // async twoFactorAuth(req: Request, res: Response): Promise<any> {
    //     return true;
    // }



    /* ************************************************ */
    /*                                                  */
    /*                   Utils OAuths                   */
    /*                                                  */
    /* ************************************************ */

    private async OAuthGetToken(code: string): Promise<string> {
        let clientId: string = "u-s4t2ud-406bbf6d602e19bc839bfe3f45f42cf949704f9d71f1de286e9721bcdeff5171"
        let clientSecret: string = "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"

        try {
            const tokenResponse = await axios.post('https://api.intra.42.fr/oauth/token', {
                grant_type: 'authorization_code',
                client_id: clientId,
                client_secret: clientSecret,
                code: code,
                redirect_uri: 'http://localhost:3000/auth/loginOAuth'
            });
            // console.log("tokenResponse : ", tokenResponse)
            // if(tokenResponse.status != 200) {
            //     throw new HttpException("Invalid code", tokenResponse.status);
            // }
            return tokenResponse.data.access_token;
        }
        catch (error) {
            // console.error(error);
            throw new UnauthorizedException(error.response.data.message, error.status);
        }
    }

    private async OAuthGetUserData(accessToken: string): Promise<any> {
        try {
            const data = await axios.get('https://api.intra.42.fr/v2/me', {
                headers: {
                    "Authorization": `Bearer ${accessToken}`
                }
            });
            // if(data.status != 200) {
            //     throw new HttpException("Invalid code", data.status);
            // }
            // console.log("data : ", data.data);
            return data.data;
        }
        catch (error) {
            // console.error(error.response);
            throw new UnauthorizedException(error.response.data.message, error.status);
        }
    }

    private async createJWT(user: CreateUserDto): Promise<string> {
        const payload = { username: user.login, sub: user.id };
        const token = await this.jwtService.signAsync(payload);
        return token
    }

}