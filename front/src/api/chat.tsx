import { ApiErrorResponse } from '../types';
import { apiRequest } from './index';
import { RoomInterface } from '../types/ChatTypes';

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
