import { UserInterface } from './users.interface';

export interface NotificationInterface {
  // id: number;
  type:
    | 'friendRequest'
    | 'friendRequestAccepted'
    | 'friendRequestDeclined'
    | 'friendRequestCanceled'
    | 'friendDeleted'
    | 'blockUser'
    | 'unblockUser'
    | 'message';
  // title: string;
  content: string;
  read: boolean;
  createdAt: Date;
  receiver: UserInterface;
  sender: UserInterface;
}
