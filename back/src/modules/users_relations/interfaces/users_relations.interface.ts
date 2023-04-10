import { UserInterface } from 'src/modules/users/interfaces/users.interface';

export interface UserRelationInterface {
  id: bigint,
  // userId: bigint,
  relationType: string,
  createdAt: Date,
  updatedAt: Date,
  userRelation: UserInterface,
}