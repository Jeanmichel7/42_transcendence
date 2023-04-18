import { UserInterface } from 'src/modules/users/interfaces/users.interface';

export interface MessageInterface {
  id: bigint;
  text: string | object;
  createdAt: Date;
  updatedAt: Date;
  ownerUser: UserInterface;
  destUser: UserInterface;
}
