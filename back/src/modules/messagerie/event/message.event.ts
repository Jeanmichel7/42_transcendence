import { MessageInterface } from 'src/modules/messagerie/interfaces/message.interface';

export class MessageCreatedEvent {
  constructor(public readonly message: MessageInterface) {}
}
