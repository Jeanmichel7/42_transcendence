import { ConfigService } from '@nestjs/config';

// const configService: ConfigService = new ConfigService();
// console.log("configService : ", configService.get('JWT_SECRET'));

export const jwtConstants = {
  secret: 'secretKey',
};

// export const jwtConstants = {
//     secret: configService.get('JWT_SECRET')
// };

// export const jwtConstants = () => {
//     const configService: ConfigService = new ConfigService();
//     const result:string = configService.get('JWT_SECRET');
//     console.log("super secret: ",result)
//     return ("sdfsdsdfsdd")

// };
