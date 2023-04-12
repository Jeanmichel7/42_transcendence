import { UserInterface } from "src/modules/users/interfaces/users.interface";
import { ChatRoomInterface } from "./chat.room.interface";

export interface ChatMsgInterface {
  id: bigint;
  text: string;
  room?: ChatRoomInterface;
  user?: UserInterface;
  createdAt?: Date;
  updatedAt?: Date;
}
