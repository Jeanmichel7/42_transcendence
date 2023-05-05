// import { Param, Query } from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { MessageInterface } from 'src/modules/messagerie/interfaces/message.interface';

@WebSocketGateway({
  namespace: 'messagerie',
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
})
export class MessagerieWebsocketService {
  @WebSocketServer() server: Server;

  async handleConnection(@ConnectedSocket() client: Socket) {
    console.log('user is connected', client.id);
  }

  async handleDisconnect(@ConnectedSocket() client: Socket) {
    console.log('user is disconnected', client.id);
  }

  @SubscribeMessage('joinPrivateRoom')
  async handleJoin(
    @MessageBody() data: { user1Id: string; user2Id: string },
    @ConnectedSocket() client: Socket,
  ) {
    const privateRoomName = this.PrivateRoomName(data.user1Id, data.user2Id);
    client.join(privateRoomName);
    console.log('joined private room', privateRoomName, data);
  }

  async handleLeave(
    @MessageBody() data: { user1Id: string; user2Id: string },
    @ConnectedSocket() client: Socket,
  ) {
    const privateRoomName = this.PrivateRoomName(data.user1Id, data.user2Id);
    client.leave(privateRoomName);
    console.log('left private room', privateRoomName, data);
  }

  emitMessage(message: MessageInterface) {
    const user1 = message.ownerUser.id;
    const user2 = message.destUser.id;
    const roomName = this.PrivateRoomName(user1, user2);
    this.server.to(roomName).emit('message', message);
    console.log('message sent to room' + roomName);
  }

  /* ************************* */
  /*           Utils           */
  /* ************************* */

  private PrivateRoomName(userId1, userId2) {
    if (userId1 > userId2) {
      [userId1, userId2] = [userId2, userId1];
    }
    return `private_room_${userId1}_${userId2}`;
  }
}
