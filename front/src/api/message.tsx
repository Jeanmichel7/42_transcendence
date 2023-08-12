import { ApiErrorResponse } from '../types';
import { apiRequest } from './index';
import { MessageInterface } from '../types/ChatTypes';
import { HttpStatusCode } from 'axios';

export async function sendMessage(
  message: string,
  receiverId: string,
): Promise<MessageInterface | ApiErrorResponse> {
  return apiRequest<MessageInterface>(
    'post',
    'messages/users/' + receiverId + '/send',
    'Failed to send message: ',
    { text: message },
  );
}

export async function getOldMessages(
  userId: number,
  page: number,
  offset: number,
): Promise< MessageInterface[] | ApiErrorResponse > {
  return apiRequest< MessageInterface[] >(
    'get',
    'messages/users/' + userId + '?page=' + page + '&offset=' + offset,
    'Failed to get old messages: ',
  );
}

export async function apiDeleteMessage(
  messageId: number,
): Promise< HttpStatusCode | ApiErrorResponse> {
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