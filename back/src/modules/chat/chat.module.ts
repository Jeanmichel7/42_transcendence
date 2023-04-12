import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatService } from './chat.service';
import { AuthAdmin } from '../auth/guard/authAdmin.guard';
import { AuthOwner } from '../auth/guard/authOwner.guard';
import { WebsocketModule } from '../webSockets/websocket.module';

import { ChatMessageEntity, ChatRoomEntity, UserEntity } from 'src/config';
import { AuthModule } from '../auth/auth.module';
import { UsersModule } from '../users/users.module';
import { UsersService } from '../users/users.service';
import { ChatController } from './chat.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([ChatMessageEntity, ChatRoomEntity, UserEntity]),
    // EventEmitterModule.forRoot(),
    WebsocketModule,
  ],
  providers: [ChatService, AuthOwner, AuthAdmin],
  controllers: [ChatController],

})
export class ChatModule {}
