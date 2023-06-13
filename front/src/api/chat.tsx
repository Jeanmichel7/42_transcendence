import { ApiErrorResponse } from '../types';
import { apiRequest } from './index';
import { ChatMsgInterface, RoomInterface } from '../types/ChatTypes';
import { HttpStatusCode } from 'axios';



/* ****************************
 *                            *
 *             ROOM           *
 *                            *
 ******************************/

export async function createChannel(
  body: any,
): Promise< RoomInterface | ApiErrorResponse> {
  return apiRequest(
    'post',
    'chat/rooms/add',
    'Failed to create room: ',
    body,
  );
}

export async function getAllPublicRooms(
): Promise< RoomInterface[] | ApiErrorResponse> {
  return apiRequest(
    'get',
    'chat/rooms/public',
    'Failed to get public rooms: ',
  );
}

export async function joinRoom(
  roomId: number,
  data: any,
): Promise< RoomInterface | ApiErrorResponse> {
  return apiRequest(
    'post',
    'chat/rooms/' + roomId + '/join',
    'Failed to get public rooms: ',
    data,
  );
}

export async function leaveRoom(
  roomId: number,
): Promise< RoomInterface | ApiErrorResponse> {
  return apiRequest(
    'patch',
    'chat/rooms/' + roomId + '/leave',
    'Failed to leave room: ',
  );
}






/******************************
 *                            *
 *            MESSAGE         *
 *                            *
 ******************************/

export async function sendChatMessage(
  roomId: string,
  data: any,
): Promise< ChatMsgInterface | ApiErrorResponse> {
  return apiRequest(
    'post',
    'chat/rooms/' + roomId + '/messages/add',
    'Failed to add message: ',
    data,
  );
}

export async function editChatMessage(
  messageId: number,
  data: any,
): Promise< ChatMsgInterface | ApiErrorResponse> {
  return apiRequest(
    'patch',
    'chat/messages/' + messageId + '/edit',
    'Failed to edit message: ',
    { text: data },
  );
}

export async function deleteChatMessage(
  messageId: number,
): Promise< HttpStatusCode | ApiErrorResponse> {
  return apiRequest(
    'delete',
    'chat/messages/' + messageId + '/delete',
    'Failed to delete message: ',
  );
}

export async function chatOldMessages(
  roomId: string,
  page: number,
  offset: number,
): Promise< ChatMsgInterface[] | ApiErrorResponse > {
  return apiRequest< ChatMsgInterface[] >(
    'get',
    'chat/rooms/' + roomId + '/messages?page=' + page + '&offset=' + offset,
    'Failed to get old messages: ',
  );
}




/* *****************************
*                              *
*          ADMIN ROOM          *
*                              *
* ******************************/

