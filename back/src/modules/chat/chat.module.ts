import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { ChatService } from './chat.service';

import {
  ChatMessageEntity,
  ChatRoomEntity,
  NotificationEntity,
  UserEntity,
} from 'config';
import { ChatController } from './chat.controller';

import { MessageChatListener } from './event/chat.listener';
import { ChatGateway } from './gateway/chat.gateway';
import { NotificationService } from '../notification/notification.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ChatMessageEntity,
      ChatRoomEntity,
      UserEntity,
      NotificationEntity,
    ]),
  ],
  providers: [
    ChatService,
    MessageChatListener,
    ChatGateway,
    JwtService,
    NotificationService,
  ],
  controllers: [ChatController],
})
export class ChatModule {}
