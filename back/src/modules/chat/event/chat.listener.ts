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
    this.socketEvents.emitNewMessage(event.message);
  }
  @OnEvent('chat_message.edited')
  handleMessageEdit(event: ChatMessageEvent) {
    this.socketEvents.emitEditMessage(event.message);
  }
  @OnEvent('chat_message.deleted')
  handleMessageDelete(event: ChatMessageEvent) {
    this.socketEvents.emitDeleteMessage(event.message);
  }

  /* ROOM */
  @OnEvent('chat_room.join')
  handleRoomJoin(event: ChatUserRoomEvent) {
    this.socketEvents.emitJoinRoom(event.roomId, event.user);
  }
  @OnEvent('chat_room.leave')
  handleRoomLeave(event: BotChatMessageEvent) {
    this.socketEvents.emitLeaveRoom(
      event.botMessage.roomId,
      event.botMessage.userId,
    );
  }
  // @OnEvent('chat_room.invit')
  // handleRoomInvit(event: ChatUserRoomEvent) {
  //   console.log('event room.invit recu', event);
  //   this.socketEvents.emitInvitRoom(event.roomId, event.user);
  // }

  /*ROOM ADMIN */
  @OnEvent('chat_room.muted')
  handleRoomMuted(event: ChatUserRoomEvent) {
    this.socketEvents.emitMutedRoom(event.roomId, event.user);
  }
  @OnEvent('chat_room.unmuted')
  handleRoomUnmuted(event: ChatUserRoomEvent) {
    this.socketEvents.emitUnmutedRoom(event.roomId, event.user);
  }
  @OnEvent('chat_room.kicked')
  handleRoomKicked(event: BotChatMessageEvent) {
    this.socketEvents.emitKickedRoom(
      event.botMessage.roomId,
      event.botMessage.userId,
    );
  }
  @OnEvent('chat_room.banned')
  handleRoomBanned(event: ChatUserRoomEvent) {
    this.socketEvents.emitBannedRoom(event.roomId, event.user);
  }
  @OnEvent('chat_room.unbanned')
  handleRoomUnbanned(event: BotChatMessageEvent) {
    this.socketEvents.emitUnbannedRoom(
      event.botMessage.roomId,
      event.botMessage.userId,
    );
  }

  /* ROOM OWNER */
  @OnEvent('chat_room.admin.added')
  handleRoomAdminAdded(event: ChatUserRoomEvent) {
    this.socketEvents.emitAdminAddedRoom(event.roomId, event.user);
  }
  @OnEvent('chat_room.admin.removed')
  handleRoomAdminRemoved(event: BotChatMessageEvent) {
    this.socketEvents.emitAdminRemovedRoom(
      event.botMessage.roomId,
      event.botMessage.userId,
    );
  }
  @OnEvent('chat_room.deleted')
  handleRoomDeleted(event: bigint) {
    this.socketEvents.emitDeletedRoom(event);
  }
}
