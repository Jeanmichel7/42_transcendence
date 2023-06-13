import { ChatMsgInterface } from 'src/modules/chat/interfaces/chat.message.interface';

export class ChatMessageEvent {
  constructor(public readonly message: ChatMsgInterface) {}
}
