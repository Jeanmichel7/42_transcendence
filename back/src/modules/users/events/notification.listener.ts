import { OnEvent } from '@nestjs/event-emitter';
import { Injectable } from '@nestjs/common';
import { NotificationGateway } from '../gateway/user.notification.gateway';
import { NotificationCreatedEvent } from './notification.event';

@Injectable()
export class NotificationListener {
  constructor(private readonly socketEvents: NotificationGateway) {}

  // notif friend request
  @OnEvent('notification.friendRequest')
  handleMessageCreated(event: NotificationCreatedEvent) {
    this.socketEvents.emitNotificationFriendRequest(event.data);
  }

  @OnEvent('notification.friendRequestAccepted')
  handleFriendRequestAccepted(event: NotificationCreatedEvent) {
    this.socketEvents.emitNotificationFriendRequestAccepted(event.data);
  }

  @OnEvent('notification.friendRequestDeclined')
  handleFriendRequestDeclined(event: NotificationCreatedEvent) {
    this.socketEvents.emitNotificationFriendRequestDeclined(event.data);
  }

  @OnEvent('notification.friendRequestCanceled')
  handleFriendRequestCanceled(event: NotificationCreatedEvent) {
    this.socketEvents.emitNotificationFriendRequestCanceled(event.data);
  }

  //notif remove friend
  @OnEvent('notification.removeFriend')
  handleRemoveFriend(event: NotificationCreatedEvent) {
    this.socketEvents.emitNotificationRemoveFriend(event.data);
  }

  //notif user blocked
  @OnEvent('notification.blockUser')
  handleBlockUser(event: NotificationCreatedEvent) {
    this.socketEvents.emitNotificationBlockUser(event.data);
  }

  @OnEvent('notification.unblockUser')
  handleUnblockUser(event: NotificationCreatedEvent) {
    this.socketEvents.emitNotificationUnblockUser(event.data);
  }
}
