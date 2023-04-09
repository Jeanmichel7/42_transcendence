import { OnEvent } from '@nestjs/event-emitter';
import { Injectable } from '@nestjs/common';
import { MessageCreatedEvent } from 'src/modules/messagerie/event/message.event';
import { SocketEvents } from 'src/modules/sockets/socket.events';

@Injectable()
export class MessageListener {
  constructor(private readonly socketEvents: SocketEvents) {}

  @OnEvent('message.created')
  handleMessageCreated(event: MessageCreatedEvent) {
    this.socketEvents.emitMessage(event.message);
  }
}

