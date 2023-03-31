import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import * as bcrypt from 'bcrypt';
import { Observable } from 'rxjs';
import { AxiosResponse, AxiosError } from 'axios';
import { catchError, firstValueFrom } from 'rxjs';
import axios from 'axios';

import { Response, Request } from 'express';

import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService,
        private readonly httpService: HttpService
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
    

    async logInOauth(req: Request, res: Response): Promise<any> {
        console.log("req : ", req.query)
        // console.log("res : ", res  )

        //check req.querry
        const code = req.query.code; // récupération du code
        if (!code || code == undefined) {
            return res.status(400).send({
                error: req.query.error_access,
                description: req.query.error_description}
            );
        }
        console.log("code : ", code);




        // traitement du code
        // Envoi de la requête POST pour récupérer le jeton d'accès OAuth
        let clientId: string = "u-s4t2ud-406bbf6d602e19bc839bfe3f45f42cf949704f9d71f1de286e9721bcdeff5171"
        let clientSecret: string = "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"

        try {

            const tokenResponse = await axios.post('https://api.intra.42.fr/oauth/token', {
                grant_type: 'authorization_code',
                client_id: clientId,
                client_secret: clientSecret,
                code: code,
                redirect_uri: 'http://localhost:3000/auth/loginOauth'
            });
            if(!tokenResponse) {
                return res.status(400).send({
                    error: "tokenResponse is undefined",
                    description: "tokenResponse is undefined"}
                );
            }
            console.log("response token : ", tokenResponse.data);
    
            const accessToken = tokenResponse.data.access_token;
            
            return accessToken;
        }
        catch (error) {
            console.error(error);
        }
        


        
        
    }

}