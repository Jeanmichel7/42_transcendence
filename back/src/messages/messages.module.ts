import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { MessageController } from './messages.controller';
import { MessageService } from './messages.service';

import { UsersService } from 'src/users/users.service';
import { UserInfo } from 'src/typeorm';

import { MessageInfo } from 'src/typeorm';
import { AuthService } from 'src/auth/auth.service';

import { jwtConstants } from 'src/auth/guard/constants';
import { HttpModule } from '@nestjs/axios';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    TypeOrmModule.forFeature([MessageInfo, UserInfo]),
    HttpModule,

    JwtModule.register({
      global: true,
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '2 days' },
    }),
  ],
  controllers: [MessageController],
  providers: [MessageService, UsersService, AuthService]
})
export class MessageModule {}
