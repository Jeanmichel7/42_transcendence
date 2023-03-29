import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { MessageController } from './messages.controller';
import { MessageService } from './messages.service';

import { UsersService } from 'src/users/users.service';
import { UserInfo } from 'src/typeorm';

import { MessageInfo } from 'src/typeorm';
import { UsersController } from 'src/users/users.controller';

@Module({
  imports: [TypeOrmModule.forFeature([MessageInfo, UserInfo])],
  controllers: [MessageController, UsersController],
  providers: [MessageService, UsersService]
})
export class MessageModule {}
