import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
// import { EventEmitterModule } from '@nestjs/event-emitter';

import { MessageController } from './messages.controller';
import { MessageService } from './messages.service';

import { UserEntity } from 'src/modules/users/entity/users.entity';
import { MessageEntity } from 'src/modules/messagerie/entity/messages.entity';

// import { AuthOwner } from 'src/modules/auth/guard/authOwner.guard';
// import { AuthAdmin } from 'src/modules/auth/guard/authAdmin.guard';

import { MessageListener } from 'src/modules/messagerie/event/message.listener';
import { MessagerieWebsocketService } from 'src/modules/messagerie/gateway/message.gateway';
import { JwtService } from '@nestjs/jwt';
import { NotificationModule } from '../notification/notification.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([MessageEntity, UserEntity]),
    NotificationModule,
  ],
  providers: [
    MessageService,
    MessageListener,
    MessagerieWebsocketService,
    JwtService,
  ],
  controllers: [MessageController],
  exports: [MessageService],
})
export class MessageModule {}
