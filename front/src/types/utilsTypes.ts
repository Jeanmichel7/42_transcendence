import { RoomInterface } from './ChatTypes';
import { UserInterface } from './UserTypes';

export interface SnackbarInterface {
  open: boolean;
  message: string;
  loginFrom?: string;
  avatar: string;
  severity: 'success' | 'info' | 'warning' | 'error';
  vertical: 'top' | 'bottom';
  horizontal: 'left' | 'center' | 'right';
  link: string;
  trophyImg?: string;
}

export interface PutSnackbarInterface {
  open?: boolean;
  message?: string;
  loginFrom?: string;
  avatar?: string;
  severity?: 'success' | 'info' | 'warning' | 'error';
  vertical?: 'top' | 'bottom';
  horizontal?: 'left' | 'center' | 'right';
  link?: string;
  trophyImg?: string;
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
  id: number;
  type: 'friendRequest' |
  'friendRequestAccepted' |
  'friendRequestDeclined' |
  'friendRequestCanceled' |
  'friendDeleted' |
  'blockUser' |
  'unblockUser' |
  'roomInvite' |
  'gameInvite' |
  'gameInviteAccepted' |
  'gameInviteDeclined' |
  'message';
  // title: string;
  content: string;
  read: boolean;
  createdAt: Date;
  receiver: UserInterface;
  sender: UserInterface;
  invitationLink?: string;
  trophyImg?: string;
}

export interface UserStatusInterface {
  id: number;
  status: 'online' | 'offline' | 'absent' | 'inactive' | 'in game';
  login?: string;
  avatar?: string;
  updatedAt?: Date;
}