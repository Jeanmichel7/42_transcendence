// import { Param, Query } from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
// import { MessageInterface } from 'src/modules/messagerie/interfaces/message.interface';
import { ChatMsgInterface } from '../interfaces/chat.message.interface';

@WebSocketGateway({
  namespace: 'chat',
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
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
    @MessageBody() data: { roomId: string; userId: string },
    @ConnectedSocket() client: Socket,
  ) {
    client.join(data.roomId);
    console.log('joined chat room', data.roomId, data);
  }

  @SubscribeMessage('leaveRoom')
  async handleLeaveRoom(
    @MessageBody() data: { roomName: string; userId: string },
    @ConnectedSocket() client: Socket,
  ) {
    client.leave(data.roomName);
    console.log('left private room', data.roomName);
  }

  emitMessage(message: ChatMsgInterface) {
    this.server.to(message.room.id.toString()).emit('chat_message', message);
    console.log('message sent to room' + message.room.id);
  }

  emitJoinRoom(roomId: string, userId: string) {
    this.server.to(roomId).emit('join-room', `${userId} join the room`);
    console.log('user joined room' + roomId);
  }
}
