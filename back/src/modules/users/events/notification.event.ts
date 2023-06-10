import { NotificationInterface } from '../interfaces/notification.interface';

export class NotificationCreatedEvent {
  constructor(public readonly data: NotificationInterface) {}
}
