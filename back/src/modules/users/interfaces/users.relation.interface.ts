import { UserInterface } from './users.interface';

export interface UserRelationInterface {
    id: bigint,
    relationType: string,
    createdAt: string,
    updatedAt: string,
    userFriend: UserInterface,
    user: UserInterface,

}