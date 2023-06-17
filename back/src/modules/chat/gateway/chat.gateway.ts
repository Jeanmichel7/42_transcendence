// import { Param, Query } from '@nestjs/common';
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
    origin: 'http://localhost:3006',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    credentials: true,
  },
})
export class ChatGateway {
  @WebSocketServer() server: Server;

  async handleConnection(@ConnectedSocket() client: Socket) {
    console.log('user is connected', client.id);
  }
  async handleDisconnect(@ConnectedSocket() client: Socket) {
    console.log('user is disconnected', client.id);
  }

  @SubscribeMessage('joinRoom')
  async handleJoinRoom(
    @MessageBody() data: { roomId: number },
    @ConnectedSocket() client: Socket,
  ) {
    client.join(data.roomId.toString());
    console.log('JOINED chat room', data.roomId);
    // client.emit('room_joined', `User joined room: ${data.roomId}`);
    // this.server.to(data.roomId.toString()).emit('room_joined', `User joined room`);
    // this.server.to(msg.room.id.toString()).emit('chat_message', msg, (ack) => {
    //   if (ack) {
    //     console.log('message sent to room' + data.roomId, msg);
    //   } else {
    //     console.log('message not sent to room' + data.roomId, msg);
    //   }
    // });
  }

  @SubscribeMessage('leaveRoom')
  async handleLeaveRoom(
    @MessageBody() data: { roomId: number },
    @ConnectedSocket() client: Socket,
  ) {
    client.leave(data.roomId.toString());
    console.log('DISCONNECT TO room', data.roomId);
  }

  emitNewMessage(message: ChatMsgInterface) {
    console.log(
      'send to room : ',
      message.room.id.toString(),
      'message : ',
      message,
    );
    this.server
      .to(message.room.id.toString())
      .emit('chat_message', message, (ack) => {
        if (ack) {
          console.log('message sent to room' + message.room.id, message);
        } else {
          console.log('message not sent to room' + message.room.id, message);
        }
      });
  }

  /* MESSAGE */
  emitEditMessage(message: ChatMsgInterface) {
    this.server
      .to(message.room.id.toString())
      .emit('chat_message_edit', message);
    console.log('message edited in room' + message.room.id, message);
  }

  emitDeleteMessage(message: ChatMsgInterface) {
    this.server
      .to(message.room.id.toString())
      .emit('chat_message_delete', message);
    console.log('message deleted in room' + message.room.id, message);
  }

  /* ROOM */
  emitJoinRoom(roomId: bigint, user: UserInterface) {
    this.server.to(roomId.toString()).emit('room_join', roomId, user);
    console.log('user join room ' + roomId);
  }

  emitLeaveRoom(roomId: bigint, userId: bigint) {
    this.server.to(roomId.toString()).emit('room_leave', roomId, userId);
    console.log('user leave room ' + roomId);
  }

  emitMutedRoom(roomId: bigint, user: UserInterface) {
    this.server.to(roomId.toString()).emit('room_muted', roomId, user);
    console.log('user muted in room ' + roomId);
  }

  emitUnmutedRoom(roomId: bigint, user: UserInterface) {
    this.server.to(roomId.toString()).emit('room_unmuted', roomId, user);
    console.log('user unmuted in room ' + roomId);
  }

  emitKickedRoom(roomId: bigint, userId: bigint) {
    this.server.to(roomId.toString()).emit('room_kicked', roomId, userId);
    console.log('user kicked from room ' + roomId);
  }

  emitBannedRoom(roomId: bigint, user: UserInterface) {
    this.server.to(roomId.toString()).emit('room_banned', roomId, user);
    console.log('user banned from room ' + roomId);
  }

  emitUnbannedRoom(roomId: bigint, userId: bigint) {
    this.server.to(roomId.toString()).emit('room_unbanned', roomId, userId);
    console.log('user unbanned from room ' + roomId);
  }

  /* ROOM ADMIN */
  emitAdminAddedRoom(roomId: bigint, user: UserInterface) {
    this.server.to(roomId.toString()).emit('room_admin_added', roomId, user);
    console.log('user added as admin in room ' + roomId);
  }

  emitAdminRemovedRoom(roomId: bigint, userId: bigint) {
    this.server
      .to(roomId.toString())
      .emit('room_admin_removed', roomId, userId);
    console.log('user removed as admin in room ' + roomId);
  }

  emitDeletedRoom(roomId: bigint) {
    this.server.to(roomId.toString()).emit('room_owner_deleted', roomId);
    console.log('room deleted ' + roomId);

    // this.server.of('/chat').sockets.forEach((socket) => {
    //   if (socket.rooms.has(roomId.toString())) {
    //     socket.leave(roomId.toString());
    //   }
    // });
  }
}
