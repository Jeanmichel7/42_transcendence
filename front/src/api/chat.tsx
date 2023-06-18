import { ApiErrorResponse } from '../types';
import { apiRequest } from './index';
import { ChatMsgInterface, RoomInterface } from '../types/ChatTypes';
import { HttpStatusCode } from 'axios';



/* ****************************
 *             ROOM           *
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

export async function inviteUser(
  roomId: number,
  userId: number,
): Promise< RoomInterface | ApiErrorResponse> {
  return apiRequest(
    'patch',
    'chat/rooms/' + roomId + '/users/' + userId + '/invite',
    'Failed to invite user: ',
  );
}

export async function editChannel(
  roomId: number,
  data: any,
): Promise< RoomInterface | ApiErrorResponse> {
  return apiRequest(
    'patch',
    'chat/rooms/' + roomId,
    'Failed to edit room: ',
    data,
  );
}

export async function deleteChannel(
  roomId: number,
): Promise< RoomInterface | ApiErrorResponse> {
  return apiRequest(
    'delete',
    'chat/rooms/' + roomId,
    'Failed to delete room: ',
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

export async function getRoomData(
  roomId: string,
): Promise< RoomInterface | ApiErrorResponse> {
  console.log('roomId : ', roomId, typeof(roomId));
  console.log('roomIdNumber : ', roomId, typeof(roomId));
  return apiRequest(
    'get',
    'chat/rooms/' + roomId,
    'Failed to get room data: ',
  );
}

/* ****************************
 *          ADMIN ROOM        *
 ******************************/

export async function muteUser(
  roomId: number,
  userIdToBeMuted: number,
  duration?: number,
): Promise< RoomInterface | ApiErrorResponse> {
  let muteDuration = 30;
  if (duration) muteDuration = duration;
  return apiRequest(
    'post',
    'chat/rooms/' + roomId + '/users/' + userIdToBeMuted + '/mute',
    'Failed to mute user: ',
    { muteDurationSec: muteDuration },
  );
}

export async function unMuteUser(
  roomId: number,
  userIdToBeUnMuted: number,
): Promise< RoomInterface | ApiErrorResponse> {
  return apiRequest(
    'patch',
    'chat/rooms/' + roomId + '/users/' + userIdToBeUnMuted + '/unmute',
    'Failed to unmute user: ',
  );
}

export async function kickUser(
  roomId: number,
  userIdToBeKicked: number,
): Promise< RoomInterface | ApiErrorResponse> {
  return apiRequest(
    'patch',
    'chat/rooms/' + roomId + '/users/' + userIdToBeKicked + '/kick',
    'Failed to kick user: ',
  );
}

export async function banUser(
  roomId: number,
  userIdToBeBanned: number,
): Promise< RoomInterface | ApiErrorResponse> {
  return apiRequest(
    'patch',
    'chat/rooms/' + roomId + '/users/' + userIdToBeBanned + '/ban',
    'Failed to ban user: ',
  );
}

export async function unBanUser(
  roomId: number,
  userIdToBeUnBanned: number,
): Promise< RoomInterface | ApiErrorResponse> {
  return apiRequest(
    'patch',
    'chat/rooms/' + roomId + '/users/' + userIdToBeUnBanned + '/unban',
    'Failed to unban user: ',
  );
}

/* ADMIN ROOM */
export async function addAdminToRoom(
  roomId: number,
  userIdToBeAdmin: number,
): Promise< RoomInterface | ApiErrorResponse> {
  return apiRequest(
    'patch',
    'chat/rooms/' + roomId + '/users/' + userIdToBeAdmin + '/admins/add',
    'Failed to add admin to room: ',
  );
}

export async function removeAdminFromRoom(
  roomId: number,
  userIdToBeRemoved: number,
): Promise< RoomInterface | ApiErrorResponse> {
  return apiRequest(
    'patch',
    'chat/rooms/' + roomId + '/users/' + userIdToBeRemoved + '/admins/remove',
    'Failed to remove admin from room: ',
  );
}







/* ***************************
*            MESSAGE         *
**************************** */

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
