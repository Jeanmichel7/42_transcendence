import { OnEvent } from '@nestjs/event-emitter';
import { Injectable } from '@nestjs/common';
import { ChatMessageCreatedEvent } from 'src/modules/chat/event/chat.event';
import { ChatGateway } from  'src/modules/chat/gateway/chat.gateway';

@Injectable()
export class MessageChatListener {
  constructor(private readonly socketEvents: ChatGateway) {}

  @OnEvent('chat-message.created')
  handleMessageCreated(event: ChatMessageCreatedEvent) {
    console.log("event message.created recu", event.message.text)
    this.socketEvents.emitMessage(event.message);
  }
}

