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

export async function getOldMessages(userId: number): Promise< MessageInterface[] | ApiErrorResponse > {
  return apiRequest< MessageInterface[] >(
    'get',
    'messages/users/' + userId,
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
