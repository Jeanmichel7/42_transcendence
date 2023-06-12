import { ApiErrorResponse } from '../types';
import { apiRequest } from './index';
import { MessageInterface } from '../types/ChatTypes';

export async function sendMessage(
  message: string,
  receiverId: number,
): Promise<MessageInterface | ApiErrorResponse> {
  return apiRequest<MessageInterface>(
    'post',
    'messages/users/' + receiverId + '/send',
    'Failed to send message: ',
    { text: message },
  );
}

export async function getOldMessages(userId: number, page: number): Promise< MessageInterface[] | ApiErrorResponse > {
  return apiRequest< MessageInterface[] >(
    'get',
    'messages/users/' + userId + '?page=' + page,
    'Failed to get old messages: ',
  );
}

// export async function imgExist(url: string) {
//   try {
//     const response = await apiAvatar(url);
//     // console.log('respons eimage exist : ', response);
//     if (response.status === 200) {
//       return true;
//     }
//   } catch (e: any) {
//     return false;
//   }
// }

export async function apiDeleteMessage(messageId: number): Promise< any> {
  return apiRequest(
    'delete',
    'messages/' + messageId,
    'Failed to delete message: ',
  );
}

export async function apiEditMessage(messageId: number, message: string)
  : Promise< MessageInterface | ApiErrorResponse> {
  return apiRequest(
    'patch',
    'messages/' + messageId,
    'Failed to edit message: ',
    { text: message },
  );
}