import { OnEvent } from '@nestjs/event-emitter';
import { Injectable } from '@nestjs/common';
import { NotificationGateway } from '../gateway/user.notification.gateway';
import { NotificationCreatedEvent } from './notification.event';

@Injectable()
export class NotificationListener {
  constructor(private readonly socketEvents: NotificationGateway) {}

  @OnEvent('notification.created')
  handleMessageCreated(event: NotificationCreatedEvent) {
    console.log('event notification.created recu', event.data);
    this.socketEvents.emitNotification(event.data);
  }
}
