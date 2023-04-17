import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatService } from './chat.service';
import { AuthAdmin } from '../auth/guard/authAdmin.guard';
import { AuthOwner } from '../auth/guard/authOwner.guard';
// import { WebsocketModule } from '../webSockets/websocket.module';

import { ChatMessageEntity, ChatRoomEntity, UserEntity } from 'src/config';
import { AuthModule } from '../auth/auth.module';
import { UsersModule } from '../users/users.module';
import { UsersService } from '../users/users.service';
import { ChatController } from './chat.controller';

import { MessageChatListener } from './event/chat.listener';
import { ChatGateway } from './gateway/chat.gateway';
import { AdminRoomGuard } from './guard/room.admin.guard';
import { OwnerRoomGuard } from './guard/room.owner.guard';

@Module({
  imports: [
    TypeOrmModule.forFeature([ChatMessageEntity, ChatRoomEntity, UserEntity]),
    // EventEmitterModule.forRoot(),
    // WebsocketModule,
  ],
  providers: [ChatService, MessageChatListener, ChatGateway],
  controllers: [ChatController],
})
export class ChatModule {}
