import { OnEvent } from '@nestjs/event-emitter';
import { Injectable } from '@nestjs/common';
import { MessageCreatedEvent } from 'src/modules/messagerie/event/message.event';
import { MessagerieWebsocketService } from 'src/modules/messagerie/gateway/message.gateway';
import { NotificationGateway } from 'src/modules/notification/gateway/notification.gateway';

@Injectable()
export class MessageListener {
  constructor(
    private readonly socketPrivateMessage: MessagerieWebsocketService,
    private readonly socketNotification: NotificationGateway,
  ) {}

  @OnEvent('message.created')
  handleMessageCreated(event: MessageCreatedEvent) {
    // console.log('event message.created recu', event.message.text);
    this.socketPrivateMessage.emitMessage(event.message);
    this.socketNotification.emitNotificationPrivateMessage(event.message);
  }

  @OnEvent('message.updated')
  handleMessageUpdated(event: MessageCreatedEvent) {
    // console.log('event message.updated recu', event.message.text);
    this.socketPrivateMessage.emitEditMessage(event.message);
  }

  @OnEvent('message.deleted')
  handleMessageDeleted(event: MessageCreatedEvent) {
    // console.log('event message.deleted recu', event.message.text);
    this.socketPrivateMessage.emitDeleteMessage(event.message);
  }
}
