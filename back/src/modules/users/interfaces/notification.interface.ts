import { UserInterface } from './users.interface';

export interface NotificationInterface {
  // id: number;
  type: 'friendRequest' | 'message';
  // title: string;
  content: string;
  read: boolean;
  createdAt: Date;
  receiver: UserInterface;
  sender: UserInterface;
}
