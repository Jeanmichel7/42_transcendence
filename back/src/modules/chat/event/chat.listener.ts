import { OnEvent } from '@nestjs/event-emitter';
import { Injectable } from '@nestjs/common';
import {
  ChatMessageCreatedEvent,
  ChatJoinRoomEvent,
} from 'src/modules/chat/event/chat.event';
import { ChatGateway } from 'src/modules/chat/gateway/chat.gateway';

@Injectable()
export class MessageChatListener {
  constructor(private readonly socketEvents: ChatGateway) {}

  @OnEvent('chat_message.created')
  handleMessageCreated(event: ChatMessageCreatedEvent) {
    console.log('event message.created recu', event.message.text);
    this.socketEvents.emitMessage(event.message);
  }

  @OnEvent('chat_room.join')
  handleRoomJoin(event: ChatJoinRoomEvent, userId: string) {
    console.log('event room.join recu', event);
    this.socketEvents.emitJoinRoom(event.room.id.toString(), userId);
  }
}
