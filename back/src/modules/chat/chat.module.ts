import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { ChatService } from './chat.service';

import { ChatMessageEntity, ChatRoomEntity, UserEntity } from 'config';
import { ChatController } from './chat.controller';

import { MessageChatListener } from './event/chat.listener';
import { ChatGateway } from './gateway/chat.gateway';

@Module({
  imports: [
    TypeOrmModule.forFeature([ChatMessageEntity, ChatRoomEntity, UserEntity]),
    // EventEmitterModule.forRoot(),
    // WebsocketModule,
  ],
  providers: [ChatService, MessageChatListener, ChatGateway, JwtService],
  controllers: [ChatController],
})
export class ChatModule {}
