import { UserStatusInterface } from 'src/modules/users/interfaces/status.interface';
import { NotificationInterface } from '../interfaces/notification.interface';

export class NotificationCreatedEvent {
  constructor(public readonly data: NotificationInterface) {}
}

export class UserUpdateEvent {
  constructor(public readonly userStatus: UserStatusInterface) {}
}

