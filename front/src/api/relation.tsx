import { apiRequest } from './index';
import { ApiErrorResponse, UserInterface, UserRelation } from '../types';

export async function getFriends(): Promise< ApiErrorResponse | UserInterface[] > {
  return apiRequest<UserInterface[]>(
    'get',
    '/relations/friends',
    'Failed to get friends: ',
  );
}

export async function getFriendProfile(
  login: string,
): Promise< ApiErrorResponse | UserInterface[] > {
  return apiRequest<UserInterface[]>(
    'get',
    '/relations/profilefriends/' + login,
    'Failed to get profile friend: ',
  );
}

export async function getBlockedUsers()
: Promise< ApiErrorResponse | UserInterface[] > {
  return apiRequest<UserInterface[]>(
    'get',
    '/relations/blocked',
    'Failed to get blocked users: ',
  );
}

export async function deleteFriend(
  userIdToRemove: number,
): Promise<void | ApiErrorResponse> {
  return apiRequest<void>(
    'delete',
    '/relations/friends/' + userIdToRemove + '/delete',
    'Failed to delete user friend: ',
  );
}

export async function requestAddFriend(
  userIdToAdd: number,
): Promise< UserRelation | ApiErrorResponse > {
  return apiRequest<UserRelation>(
    'get',
    '/relations/friends/' + userIdToAdd + '/request',
    'Failed to request add user friend: ',
  );
}

export async function acceptFriend(
  userIdToAdd: number,
): Promise< UserRelation | ApiErrorResponse > {
  return apiRequest<UserRelation>(
    'put',
    '/relations/friends/' + userIdToAdd + '/accept',
    'Failed to accept user friend: ',
  );
}

export async function declineFriend(
  userIdToAdd: number,
): Promise< void | ApiErrorResponse > {
  return apiRequest<void>(
    'put',
    '/relations/friends/' + userIdToAdd + '/decline',
    'Failed to decline user friend: ',
  );
}

export async function cancelFriendRequest(
  userIdToAdd: number,
): Promise< void | ApiErrorResponse > {
  return apiRequest<void>(
    'put',
    '/relations/friends/' + userIdToAdd + '/cancel',
    'Failed to cancel user friend request: ',
  );
}

export async function getFriendRequests(
): Promise< UserInterface[] | ApiErrorResponse > {
  return apiRequest<UserInterface[]>(
    'get',
    '/relations/friends/requestsPending',
    'Failed to get friend requests: ',
  );
}

export async function getFriendRequestsSent(
): Promise< UserInterface[] | ApiErrorResponse > {
  return apiRequest<UserInterface[]>(
    'get',
    '/relations/friends/requestsSent',
    'Failed to get friend requests: ',
  );
}

export async function addFriend(
  userIdToAdd: number,
): Promise< UserRelation | ApiErrorResponse > {
  return apiRequest<UserRelation>(
    'put',
    '/relations/friends/' + userIdToAdd + '/add',
    'Failed to add user friend: ',
  );
}

export async function apiBlockUser(
  userIdToBlock: UserInterface['id'],
): Promise< UserRelation | ApiErrorResponse> {
  return apiRequest<UserRelation>(
    'put',
    '/relations/friends/' + userIdToBlock + '/block',
    'Failed to block user: ',
  );
}
export async function apiUnblockUser(
  userIdToUnblock: UserInterface['id'],
): Promise< void | ApiErrorResponse> {
  return apiRequest<void>(
    'put',
    '/relations/friends/' + userIdToUnblock + '/unblock',
    'Failed to unblock user: ',
  );
}
