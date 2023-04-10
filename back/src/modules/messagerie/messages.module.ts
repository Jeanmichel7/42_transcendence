import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
// import { EventEmitterModule } from '@nestjs/event-emitter';

import { MessageController } from './messages.controller';
import { MessageService } from './messages.service';

import { UserEntity } from 'src/modules/users/entity/users.entity';
import { MessageEntity } from 'src/modules/messagerie/entity/messages.entity';

import { AuthOwner } from 'src/modules/auth/guard/authOwner.guard';
import { AuthAdmin } from 'src/modules/auth/guard/authAdmin.guard';

import { MessageListener } from 'src/modules/messagerie/event/message.listener';
import { WebsocketModule } from 'src/modules/webSockets/websocket.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([MessageEntity, UserEntity]),
    // EventEmitterModule.forRoot(),
    WebsocketModule,
  ],
  providers: [MessageService, MessageListener, AuthOwner, AuthAdmin],
  controllers: [MessageController],
})
export class MessageModule {}

