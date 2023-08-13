import { ApiErrorResponse, NotificationInterface } from '../types';
import { apiRequest } from './index';

/* ****************************
 *             ROOM           *
 ******************************/

export async function readNotification(
  notifId: number,
): Promise<void | ApiErrorResponse> {
  return apiRequest(
    'patch',
    'notification/' + notifId + '/read',
    'Failed to create room: ',
  );
}

export async function getNotifsNotRead(): Promise<
  NotificationInterface[] | ApiErrorResponse
> {
  return apiRequest('get', 'notification', 'Failed to get notifs: ');
}
