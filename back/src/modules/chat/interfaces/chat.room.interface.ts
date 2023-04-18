import { UserInterface } from 'src/modules/users/interfaces/users.interface';
import { ChatMsgInterface } from './chat.message.interface';

export interface ChatRoomInterface {
  id: bigint;
  // name: string;
  status: string;
  password?: string;
  createdAt?: Date;
  updatedAt?: Date;
  users?: UserInterface[];
  messages?: ChatMsgInterface[];
  ownerUser?: UserInterface;
  admins?: UserInterface[];
  bannedUsers?: UserInterface[];
  mutedUsers?: UserInterface[];
}
