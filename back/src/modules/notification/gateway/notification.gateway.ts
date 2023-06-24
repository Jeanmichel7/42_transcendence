import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { NotificationInterface } from '../interfaces/notification.interface';
import { UserStatusInterface } from 'src/modules/users/interfaces/status.interface';
import { MessageInterface } from 'src/modules/messagerie/interfaces/message.interface';

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
    console.log('user is connected to NOTIF', client.id);
  }

  async handleDisconnect(@ConnectedSocket() client: Socket) {
    console.log('user is disconnected to NOTIF', client.id);
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
    // console.log('emitNotificationFriendRequest', data);
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

  /* ROOM */
  emitNotificationRoomInvite(data: NotificationInterface) {
    this.server
      .to('notification_room_' + data.receiver.id)
      .emit('notification_room_invite', data);
  }

  /* UPDATE USER STATUS */
  emitUpdateUserStatus(updateStatusUser: UserStatusInterface) {
    console.log('SEND updateStatusUser : ', updateStatusUser);
    this.server.emit('update_user_status', updateStatusUser, (ack) => {
      if (ack) {
        // console.log('update status sent to room' + updateStatusUser);
      } else {
        // console.log('update status not sent to room' + updateStatusUser);
      }
    });
  }

  /* GAME */
  emitNotificationGameInvite(data: NotificationInterface) {
    this.server
      .to('notification_room_' + data.receiver.id)
      .emit('notification_game_invite', data);
  }

  emitNotificationGameInviteAccepted(data: NotificationInterface) {
    this.server
      .to('notification_room_' + data.receiver.id)
      .emit('notification_game_invite_accepted', data);
  }

  emitNotificationGameInviteDeclined(data: NotificationInterface) {
    this.server
      .to('notification_room_' + data.receiver.id)
      .emit('notification_game_invite_declined', data);
  }

  /* Private Message */
  emitNotificationPrivateMessage(data: MessageInterface) {
    this.server
      .to('notification_room_' + data.destUser.id)
      .emit('notification_private_message', data);
  }
}
