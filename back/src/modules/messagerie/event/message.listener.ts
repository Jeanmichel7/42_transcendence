import { OnEvent } from '@nestjs/event-emitter';
import { Injectable } from '@nestjs/common';
import { MessageCreatedEvent } from 'src/modules/messagerie/event/message.event';
import { MessagerieWebsocketService } from 'src/modules/messagerie/gateway/message.gateway';

@Injectable()
export class MessageListener {
  constructor(private readonly socketEvents: MessagerieWebsocketService) {}

  @OnEvent('message.created')
  handleMessageCreated(event: MessageCreatedEvent) {
    console.log('event message.created recu', event.message.text);
    this.socketEvents.emitMessage(event.message);
  }

  @OnEvent('message.updated')
  handleMessageUpdated(event: MessageCreatedEvent) {
    console.log('event message.updated recu', event.message.text);
    this.socketEvents.emitEditMessage(event.message);
  }
}
