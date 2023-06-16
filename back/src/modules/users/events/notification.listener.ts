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
    console.log('notif friend request', event.data);
    this.socketEvents.emitNotificationFriendRequest(event.data);
  }

  @OnEvent('notification.friendRequestAccepted')
  handleFriendRequestAccepted(event: NotificationCreatedEvent) {
    console.log('notif friend request accepted', event.data);
    this.socketEvents.emitNotificationFriendRequestAccepted(event.data);
  }

  @OnEvent('notification.friendRequestDeclined')
  handleFriendRequestDeclined(event: NotificationCreatedEvent) {
    console.log('notif friend request declined', event.data);
    this.socketEvents.emitNotificationFriendRequestDeclined(event.data);
  }

  @OnEvent('notification.friendRequestCanceled')
  handleFriendRequestCanceled(event: NotificationCreatedEvent) {
    console.log('notif friend request canceled', event.data);
    this.socketEvents.emitNotificationFriendRequestCanceled(event.data);
  }

  //notif remove friend
  @OnEvent('notification.removeFriend')
  handleRemoveFriend(event: NotificationCreatedEvent) {
    console.log('notif remove friend', event.data);
    this.socketEvents.emitNotificationRemoveFriend(event.data);
  }

  //notif user blocked
  @OnEvent('notification.blockUser')
  handleBlockUser(event: NotificationCreatedEvent) {
    console.log('notif block user', event.data);
    this.socketEvents.emitNotificationBlockUser(event.data);
  }

  @OnEvent('notification.unblockUser')
  handleUnblockUser(event: NotificationCreatedEvent) {
    console.log('notif unblock user', event.data);
    this.socketEvents.emitNotificationUnblockUser(event.data);
  }
}