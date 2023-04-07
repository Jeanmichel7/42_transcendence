import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { MessageController } from './messages.controller';
import { MessageService } from './messages.service';

import { UserEntity } from 'src/modules/users/entity/users.entity';
import { MessageEntity } from 'src/modules/messagerie/entity/messages.entity';

import { UsersService } from 'src/modules/users/users.service';
import { AuthService } from 'src/modules/auth/auth.service';

import { jwtConstants } from 'src/modules/auth/guard/constants';
import { HttpModule } from '@nestjs/axios';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    TypeOrmModule.forFeature([MessageEntity, UserEntity]),
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
