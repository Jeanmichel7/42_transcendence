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
import { ChatRoomInterface } from '../interfaces/chat.room.interface';

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
  emitLeaveRoom(roomId: bigint, userId: bigint, userLogin: string) {
    console.log('emit leave room', roomId.toString(), userId, userLogin);
    this.server
      .to(roomId.toString())
      .emit('room_leave', roomId, userId, userLogin);
    console.log('user ' + userLogin + ' leave room ' + roomId);
  }
}
