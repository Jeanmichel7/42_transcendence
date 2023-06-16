import { OnEvent } from '@nestjs/event-emitter';
import { Injectable } from '@nestjs/common';
import {
  BotChatMessageEvent,
  ChatUserRoomEvent,
  ChatMessageEvent,
} from 'src/modules/chat/event/chat.event';
import { ChatGateway } from 'src/modules/chat/gateway/chat.gateway';

@Injectable()
export class MessageChatListener {
  constructor(private readonly socketEvents: ChatGateway) {}

  /* CHAT */
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

  /* ROOM */
  @OnEvent('chat_room.join')
  handleRoomJoin(event: ChatUserRoomEvent) {
    console.log('event room.join recu', event);
    this.socketEvents.emitJoinRoom(event.roomId, event.user);
  }
  @OnEvent('chat_room.leave')
  handleRoomLeave(event: BotChatMessageEvent) {
    console.log('event room.leave recu', event.botMessage);
    this.socketEvents.emitLeaveRoom(
      event.botMessage.roomId,
      event.botMessage.userId,
    );
  }

  /*ROOM ADMIN */
  @OnEvent('chat_room.muted')
  handleRoomMuted(event: ChatUserRoomEvent) {
    console.log('event room.muted recu', event);
    this.socketEvents.emitMutedRoom(event.roomId, event.user);
  }
  @OnEvent('chat_room.unmuted')
  handleRoomUnmuted(event: ChatUserRoomEvent) {
    console.log('event room.unmuted recu', event);
    this.socketEvents.emitUnmutedRoom(event.roomId, event.user);
  }
  @OnEvent('chat_room.kicked')
  handleRoomKicked(event: BotChatMessageEvent) {
    console.log('event room.kicked recu', event.botMessage);
    this.socketEvents.emitKickedRoom(
      event.botMessage.roomId,
      event.botMessage.userId,
    );
  }
  @OnEvent('chat_room.banned')
  handleRoomBanned(event: ChatUserRoomEvent) {
    console.log('event room.banned recu', event);
    this.socketEvents.emitBannedRoom(event.roomId, event.user);
  }
  @OnEvent('chat_room.unbanned')
  handleRoomUnbanned(event: BotChatMessageEvent) {
    console.log('event room.unbanned recu', event);
    this.socketEvents.emitUnbannedRoom(
      event.botMessage.roomId,
      event.botMessage.userId,
    );
  }

  /* ROOM OWNER */
  @OnEvent('chat_room.admin.added')
  handleRoomAdminAdded(event: ChatUserRoomEvent) {
    console.log('event room.admin.added recu', event);
    this.socketEvents.emitAdminAddedRoom(event.roomId, event.user);
  }
  @OnEvent('chat_room.admin.removed')
  handleRoomAdminRemoved(event: BotChatMessageEvent) {
    console.log('event room.admin.removed recu', event);
    this.socketEvents.emitAdminRemovedRoom(
      event.botMessage.roomId,
      event.botMessage.userId,
    );
  }
  // @OnEvent('chat_room.owner.changed')
  // handleRoomOwnerChanged(event: ChatUserRoomEvent) {
  //   console.log('event room.owner.changed recu', event);
  //   this.socketEvents.emitOwnerChangedRoom(event.roomId, event.user);
  // }
  @OnEvent('chat_room.deleted')
  handleRoomDeleted(event: bigint) {
    console.log('event room.deleted recu', event);
    this.socketEvents.emitDeletedRoom(event);
  }
}
