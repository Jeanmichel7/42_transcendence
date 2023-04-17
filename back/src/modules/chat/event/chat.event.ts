import { ChatMsgInterface } from 'src/modules/chat/interfaces/chat.message.interface';
import { ChatRoomInterface } from 'src/modules/chat/interfaces/chat.room.interface';

export class ChatMessageCreatedEvent {
  constructor(public readonly message: ChatMsgInterface) {}
}

export class ChatJoinRoomEvent {
  constructor(
    public readonly room: ChatRoomInterface,
    public readonly userId: string,
  ) {}
}
