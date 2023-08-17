import { UserInterface } from 'src/modules/users/interfaces/users.interface';

export interface UserRelationInterface {
  id: bigint;
  relationType: string;
  createdAt: Date;
  updatedAt: Date;
  userRelation: UserInterface;
}
