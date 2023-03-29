import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { MessageController } from './messages.controller';
import { MessageService } from './messages.service';

import { UsersService } from 'src/users/users.service';
import { UserInfo } from 'src/typeorm';

import { MessageInfo } from 'src/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([MessageInfo, UserInfo])],
  controllers: [MessageController],
  providers: [MessageService, UsersService]
})
export class MessageModule {}
