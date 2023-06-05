import { UserInterface } from './UserTypes';

export interface MessageInterface {
  id: number;
  text: string;
  createdAt: Date;
  updatedAt: Date;
  ownerUser: UserInterface;
  destUser: UserInterface;
}
