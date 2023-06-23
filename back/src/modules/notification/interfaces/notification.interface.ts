import { UserEntity } from 'config';

export interface NotificationInterface {
  id: bigint;
  type:
    | 'friendRequest'
    | 'friendRequestAccepted'
    | 'friendRequestDeclined'
    | 'friendRequestCanceled'
    | 'friendDeleted'
    | 'blockUser'
    | 'unblockUser'
    | 'roomInvite'
    | 'gameInvite'
    | 'gameInviteAccepted'
    | 'gameInviteDeclined'
    | 'message';
  content: string;
  read: boolean;
  createdAt: Date;
  updatedAt?: Date;
  sender: UserEntity;
  receiver: UserEntity;
  invitationLink?: string;
}
