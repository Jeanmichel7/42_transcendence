import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatMsgInterface } from '../interfaces/chat.message.interface';
import { UserInterface } from 'src/modules/users/interfaces/users.interface';

@WebSocketGateway({
  namespace: 'chat',
  cors: {
    origin: 'k1r2p6:3006',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    credentials: true,
  },
})
export class ChatGateway {
  @WebSocketServer() server: Server;

  async handleConnection(@ConnectedSocket() client: Socket) {
    console.log('user is connected to CHAT', client.id);
  }
  async handleDisconnect(@ConnectedSocket() client: Socket) {
    console.log('user is disconnected to CHAT', client.id);
  }

  @SubscribeMessage('joinRoom')
  async handleJoinRoom(
    @MessageBody() data: { roomId: number },
    @ConnectedSocket() client: Socket,
  ) {
    client.join(data.roomId.toString());
    console.log('JOINED chat room', data.roomId);
  }

  @SubscribeMessage('leaveRoom')
  async handleLeaveRoom(
    @MessageBody() data: { roomId: number },
    @ConnectedSocket() client: Socket,
  ) {
    client.leave(data.roomId.toString());
    console.log('DISCONNECT TO chat room', data.roomId);
  }

  emitNewMessage(message: ChatMsgInterface) {
    this.server
      .to(message.room.id.toString())
      .emit('chat_message', message, ack => {
        if (ack) {
          // console.log('message sent to room' + message.room.id, message);
        } else {
          // console.log('message not sent to room' + message.room.id, message);
        }
      });
  }

  /* MESSAGE */
  emitEditMessage(message: ChatMsgInterface) {
    this.server
      .to(message.room.id.toString())
      .emit('chat_message_edit', message);
  }

  emitDeleteMessage(message: ChatMsgInterface) {
    this.server
      .to(message.room.id.toString())
      .emit('chat_message_delete', message);
  }

  /* ROOM */
  emitJoinRoom(roomId: bigint, user: UserInterface) {
    this.server.to(roomId.toString()).emit('room_join', roomId, user);
  }

  emitLeaveRoom(roomId: bigint, userId: bigint) {
    this.server.to(roomId.toString()).emit('room_leave', roomId, userId);
  }

  emitMutedRoom(roomId: bigint, user: UserInterface) {
    this.server.to(roomId.toString()).emit('room_muted', roomId, user);
  }

  emitUnmutedRoom(roomId: bigint, user: UserInterface) {
    this.server.to(roomId.toString()).emit('room_unmuted', roomId, user);
  }

  emitKickedRoom(roomId: bigint, userId: bigint) {
    this.server.to(roomId.toString()).emit('room_kicked', roomId, userId);
  }

  emitBannedRoom(roomId: bigint, user: UserInterface) {
    this.server.to(roomId.toString()).emit('room_banned', roomId, user);
  }

  emitUnbannedRoom(roomId: bigint, userId: bigint) {
    this.server.to(roomId.toString()).emit('room_unbanned', roomId, userId);
  }

  /* ROOM ADMIN */
  emitAdminAddedRoom(roomId: bigint, user: UserInterface) {
    this.server.to(roomId.toString()).emit('room_admin_added', roomId, user);
  }

  emitAdminRemovedRoom(roomId: bigint, userId: bigint) {
    this.server
      .to(roomId.toString())
      .emit('room_admin_removed', roomId, userId);
  }

  emitDeletedRoom(roomId: bigint) {
    this.server.to(roomId.toString()).emit('room_owner_deleted', roomId);
  }
}
