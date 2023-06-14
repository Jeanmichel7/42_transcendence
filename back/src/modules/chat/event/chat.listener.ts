import { OnEvent } from '@nestjs/event-emitter';
import { Injectable } from '@nestjs/common';
import {
  BotChatMessageEvent,
  ChatMessageEvent,
  ChatRoomEvent,
  // ChatJoinRoomEvent,
} from 'src/modules/chat/event/chat.event';
import { ChatGateway } from 'src/modules/chat/gateway/chat.gateway';
import { ChatBotInterface } from '../interfaces/chat.room.interface';

@Injectable()
export class MessageChatListener {
  constructor(private readonly socketEvents: ChatGateway) {}

  @OnEvent('chat_message.created')
  handleMessageCreated(event: ChatMessageEvent) {
    console.log('event message.created recu', event.message.text);
    this.socketEvents.emitNewMessage(event.message);
  }

  @OnEvent('chat_message.edited')
  handleMessageEdit(event: ChatMessageEvent) {
    console.log('event message.edit recu', event.message.text);
    this.socketEvents.emitEditMessage(event.message);
  }

  @OnEvent('chat_message.deleted')
  handleMessageDelete(event: ChatMessageEvent) {
    console.log('event message.delete recu', event.message.text);
    this.socketEvents.emitDeleteMessage(event.message);
  }
  // @OnEvent('chat_room.join')
  // handleRoomJoin(event: ChatJoinRoomEvent, userId: string) {
  //   console.log('event room.join recu', event);
  //   this.socketEvents.emitJoinRoom(event.room.id.toString(), userId);
  // }

  @OnEvent('chat_room.leave')
  handleRoomLeave(event: BotChatMessageEvent) {
    console.log('event room.leave recu', event.botMessage);
    this.socketEvents.emitLeaveRoom(
      event.botMessage.roomId,
      event.botMessage.userId,
      event.botMessage.userLogin,
    );
  }
}
