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

  emitNotificationFriendRequest(data: NotificationInterface) {
    console.log('emitNotificationFriendRequest', data);
    this.server
      .to('notification_room_' + data.receiver.id)
      .emit('notification_friend_request', data);
  }

  emitNotificationFriendRequestAccepted(data: NotificationInterface) {
    this.server
      .to('notification_room_' + data.receiver.id)
      .emit('notification_friend_request_accepted', data);
  }

  emitNotificationFriendRequestDeclined(data: NotificationInterface) {
    this.server
      .to('notification_room_' + data.receiver.id)
      .emit('notification_friend_request_declined', data);
  }

  emitNotificationFriendRequestCanceled(data: NotificationInterface) {
    this.server
      .to('notification_room_' + data.receiver.id)
      .emit('notification_friend_request_canceled', data);
  }

  emitNotificationRemoveFriend(data: NotificationInterface) {
    this.server
      .to('notification_room_' + data.receiver.id)
      .emit('notification_friend_deleted', data);
  }

  emitNotificationBlockUser(data: NotificationInterface) {
    this.server
      .to('notification_room_' + data.receiver.id)
      .emit('notification_block_user', data);
  }

  emitNotificationUnblockUser(data: NotificationInterface) {
    this.server
      .to('notification_room_' + data.receiver.id)
      .emit('notification_unblock_user', data);
  }

  // emitJoinRoom(roomId: string, userId: string) {
  //   this.server.to(roomId).emit('join-room', `${userId} join the room`);
  //   console.log('user joined room' + roomId);
  // }
}
