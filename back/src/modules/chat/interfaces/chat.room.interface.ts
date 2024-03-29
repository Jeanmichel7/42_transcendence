import { UserInterface } from 'src/modules/users/interfaces/users.interface';
import { ChatMsgInterface } from './chat.message.interface';

export interface ChatRoomInterface {
  id: bigint;
  name: string;
  type: 'public' | 'private';
  isProtected: boolean;
  password?: string;
  createdAt?: Date;
  updatedAt?: Date;
  users?: UserInterface[];
  messages?: ChatMsgInterface[];
  ownerUser?: UserInterface;
  admins?: UserInterface[];
  bannedUsers?: UserInterface[];
  mutedUsers?: UserInterface[];
  acceptedUsers?: UserInterface[];
}

export interface ChatBotInterface {
  roomId: bigint;
  userId: bigint;
  userLogin: string;
  text: string;
  createdAt?: Date;
}
