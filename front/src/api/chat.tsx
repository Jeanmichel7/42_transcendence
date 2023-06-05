import { AxiosError } from 'axios';
import { ApiErrorResponse } from '../types';
import api, { networkErrorResponse } from './index';
import { MessageInterface } from '../types/ChatTypes';

export async function sendMessage(message: string, receiverId: number):
Promise< MessageInterface | ApiErrorResponse > {
  try {
    const response = await api.post< MessageInterface >('messages/users/' + receiverId + '/send', {
      text: message,
    });
    if (response.status === 200 || response.status === 201) {
      return response.data;
    }
  } catch (e: unknown) {
    const axiosError = e as AxiosError;
    if (axiosError) {
      if (!axiosError.response)
        return networkErrorResponse;
      else
        return axiosError.response.data as ApiErrorResponse;
    }
    throw new Error('Failed to send message : ' + e);
  }
  throw new Error('Unexpected error');
}

export async function getOldMessages(userId: number): Promise< MessageInterface[] | ApiErrorResponse > {
  try {
    const response = await api.get< MessageInterface[] >('/messages/users/' + userId);
    if (response.status === 200) {
      return response.data;
    }
  } catch (e: unknown) {
    const axiosError = e as AxiosError;
    if (axiosError) {
      if (!axiosError.response)
        return networkErrorResponse;
      else
        return axiosError.response.data as ApiErrorResponse;
    }
    throw new Error('Failed to get all messages: ' + e);
  }
  throw new Error('Unexpected error');
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
