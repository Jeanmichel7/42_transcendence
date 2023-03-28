import { Module } from '@nestjs/common';
import { ChatController } from './chats.controller';
import { ChatService } from './chats.service';

@Module({
  controllers: [ChatController],
  providers: [ChatService]
})
export class ChatModule {}
