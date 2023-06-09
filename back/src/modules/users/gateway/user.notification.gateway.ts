import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { NotificationInterface } from '../interfaces/notification.interface';

@WebSocketGateway({
  namespace: 'notification',
  cors: {
    origin: 'http://localhost:3006',
    methods: ['GET', 'POST'],
    credentials: true,
  },
})
export class NotificationGateway {
  @WebSocketServer() server: Server;

  async handleConnection(@ConnectedSocket() client: Socket) {
    console.log('user is connected to notif', client.id);
  }

  async handleDisconnect(@ConnectedSocket() client: Socket) {
    console.log('user is disconnected to notif', client.id);
  }

  @SubscribeMessage('joinNotificationRoom')
  async handleJoinNotificationRoom(
    @MessageBody() data: { userId: string },
    @ConnectedSocket() client: Socket,
  ) {
    client.join('notification_room_' + data.userId);
    console.log('joined room notification_' + data.userId, data);
  }

  // @SubscribeMessage('leaveRoom')
  async handleLeaveRoom(
    @MessageBody() data: { roomName: string; userId: string },
    @ConnectedSocket() client: Socket,
  ) {
    client.leave('notification_room_' + data.userId);
    console.log('left private room notification_' + data.userId);
  }

  emitNotification(data: NotificationInterface) {
    this.server
      .to('notification_room_' + data.receiver.id)
      .emit('notification', data);
    console.log('notification sent to room' + data.receiver.id);
  }

  // emitJoinRoom(roomId: string, userId: string) {
  //   this.server.to(roomId).emit('join-room', `${userId} join the room`);
  //   console.log('user joined room' + roomId);
  // }
}
