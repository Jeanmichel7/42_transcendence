import { UserInterface } from 'src/modules/users/interfaces/users.interface';
import { ChatRoomInterface } from './chat.room.interface';

export interface ChatMsgInterface {
  id: bigint;
  text: string;
  room: ChatRoomInterface;
  ownerUser: UserInterface;
  createdAt?: Date;
  updatedAt?: Date;
}
