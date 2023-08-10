import { UserInterface } from "./UserTypes";

export interface MessageInterface {
  id: number;
  text: string;
  createdAt: Date;
  updatedAt: Date;
  ownerUser: UserInterface;
  destUser: UserInterface;
}

export interface ChatMsgInterface {
  id: number;
  text: string;
  room: RoomInterface;
  ownerUser: UserInterface;
  createdAt: Date;
  updatedAt: Date;
}

export interface RoomInterface {
  id: number;
  name: string;
  type: "public" | "private";
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

// export interface ChatBotInterface {
//   id: number;
//   roomId: number;
//   userId: number;
//   userLogin: string;
//   text: string;
//   createdAt?: Date;
// }

export interface ConversationInterface {
  id: number;
  user: UserInterface;
  room: RoomInterface;
  msgNotRead: number;
}

export interface UpdateRoomData {
  name?: string;
  isProtected?: boolean;
  password?: string | null;
}

export interface JoinRoomDTO {
  roomId: number;
  password?: string;
}
