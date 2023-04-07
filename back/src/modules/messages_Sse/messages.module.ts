// import { Module } from '@nestjs/common';
// import { TypeOrmModule } from '@nestjs/typeorm';

// import { MessageController } from './messages.controller';
// import { MessageService } from './messages.service';

// import { UserEntity } from 'src/modules/users/entity/users.entity';
// import { MessageInfo } from 'src/modules/messages_Sse/entity/messages.entity';

// import { UsersService } from 'src/modules/users/users.service';
// import { AuthService } from 'src/modules/auth/auth.service';

// import { jwtConstants } from 'src/modules/auth/guard/constants';
// import { HttpModule } from '@nestjs/axios';
// import { JwtModule } from '@nestjs/jwt';

// @Module({
//   imports: [
//     TypeOrmModule.forFeature([MessageInfo, UserEntity]),
//     HttpModule,

//     JwtModule.register({
//       global: true,
//       secret: jwtConstants.secret,
//       signOptions: { expiresIn: '2 days' },
//     }),
//   ],
//   controllers: [MessageController],
//   providers: [MessageService, UsersService, AuthService]
// })
// export class MessageModuleSse {}
