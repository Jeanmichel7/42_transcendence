import { OnEvent } from '@nestjs/event-emitter';
import { Injectable } from '@nestjs/common';
import { MessageCreatedEvent } from 'src/modules/messagerie/event/message.event';
import { WebsocketService } from 'src/modules/webSockets/websocket.service';

@Injectable()
export class MessageListener {
  constructor(private readonly socketEvents: WebsocketService) {}

  @OnEvent('message.created')
  handleMessageCreated(event: MessageCreatedEvent) {
    // console.log("event message.created recu", event.message.text)
    this.socketEvents.emitMessage(event.message);
  }
}

