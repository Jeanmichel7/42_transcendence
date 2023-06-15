import { ChatMsgInterface } from 'src/modules/chat/interfaces/chat.message.interface';
import {
  ChatBotInterface,
  ChatRoomInterface,
} from '../interfaces/chat.room.interface';
import { UserInterface } from 'src/modules/users/interfaces/users.interface';

export class ChatMessageEvent {
  constructor(public readonly message: ChatMsgInterface) {}
}

export class ChatRoomEvent {
  constructor(public readonly room: ChatRoomInterface) {}
}

export class BotChatMessageEvent {
  constructor(public readonly botMessage: ChatBotInterface) {}
}

export class ChatUserRoomEvent {
  constructor(
    public readonly roomId: bigint,
    public readonly user: UserInterface,
  ) {}
}
