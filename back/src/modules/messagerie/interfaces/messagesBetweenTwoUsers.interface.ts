import { UserInterface } from "src/modules/users/interfaces/users.interface";

export interface MessageBtwTwoUserInterface {
  id: bigint;
  text: string | object;
  createdAt: string;
  updatedAt: string;
  ownerUser: UserInterface;
  destUser: UserInterface;
}
