import { UserInterface } from "src/modules/users/interfaces/users.interface";

export interface ChatRoomInterface {
  id: bigint;
  status: string;
  password?: string;
  createdAt?: Date;
  updatedAt?: Date;
  users?: UserInterface[];
}
