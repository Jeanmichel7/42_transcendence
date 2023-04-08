import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { MessageController } from './messages.controller';
import { MessageService } from './messages.service';

import { UserEntity } from 'src/modules/users/entity/users.entity';
import { MessageEntity } from 'src/modules/messagerie/entity/messages.entity';

import { AuthOwner } from 'src/modules/auth/guard/authOwner.guard';
import { AuthAdmin } from 'src/modules/auth/guard/authAdmin.guard';

@Module({
  imports: [TypeOrmModule.forFeature([MessageEntity, UserEntity])],
  providers: [MessageService, AuthOwner, AuthAdmin],
  controllers: [MessageController],
})
export class MessageModule {}
