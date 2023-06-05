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
