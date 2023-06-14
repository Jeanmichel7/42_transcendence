import { RoomInterface } from './ChatTypes';
import { UserInterface } from './UserTypes';

export interface SnackbarInterface {
  open: boolean;
  message: string;
  severity: 'success' | 'info' | 'warning' | 'error';
  vertical: 'top' | 'bottom';
  horizontal: 'left' | 'center' | 'right';
}

export interface PutSnackbarInterface {
  open?: boolean;
  message?: string;
  severity?: 'success' | 'info' | 'warning' | 'error';
  vertical?: 'top' | 'bottom';
  horizontal?: 'left' | 'center' | 'right';
}

export interface UserActionInterface {
  type: string;
  payload?: UserInterface | UserInterface[];
}

export interface RoomUserActionInterface {
  type: string;
  payload?: RoomInterface;
}

export interface NotificationInterface {
  // id: number;
  type: 'friendRequest' |
  'friendRequestAccepted' |
  'friendRequestDeclined' |
  'friendRequestCanceled' |
  'friendDeleted' |
  'blockUser' |
  'unblockUser' |
  'message';
  // title: string;
  content: string;
  read: boolean;
  createdAt: Date;
  receiver: UserInterface;
  sender: UserInterface;
}