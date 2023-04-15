import { ChatMsgInterface } from "src/modules/chat/interfaces/chat.message.interface";

export class ChatMessageCreatedEvent {
  constructor(public readonly message: ChatMsgInterface) {}
}
