import { AxiosError } from 'axios';
import api, { networkErrorResponse } from './index';
import { ApiErrorResponse, UserInterface } from '../types';

export async function getFriends() {
  try {
    const response = await api.get('/relations/friends');
    console.log('response gerFriends : ', response);
    if (response.status === 200) {
      return response.data;
    }
  } catch (e: any) {
    return e.response.data;
    // throw new Error('Failed to get friends');
  }
}

export async function getFriendProfile(login: string):
Promise< ApiErrorResponse | UserInterface[] > {
  try {
    const response = await api.get<UserInterface[]>('/relations/profilefriends/' + login );
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
    throw new Error('Failed to get friend profile: ' + e);
  }
  throw new Error('Unexpected error');
}

export async function deleteFriend(userIdToRemove: number) {
  try {
    const response = await api.delete('relations/friends/' + userIdToRemove + '/delete');
    if (response.status === 200) {
      return response.data;
    }
  } catch (e: any) {
    return e.response.data;
    // throw new Error('Failed to remove friend');
  }
}

export async function addFriend(userIdToAdd: number) {
  try {
    const response = await api.put('relations/friends/' + userIdToAdd + '/add');
    if (response.status === 200) {
      return response.data;
    }
  } catch (e: any) {
    return e.response.data;
    // throw new Error('Failed to add friend');
  }
}

export async function getBlockedUsers() {
  try {
    const response = await api.get('/relations/blocked');
    if (response.status === 200) {
      return response.data;
    }
  } catch (e: any) {
    return e.response.data;
    // throw new Error('Failed to get blocked users');
  }
}

export async function apiBlockUser(userIdToBlock: number) {
  try {
    const response = await api.put('relations/friends/' + userIdToBlock + '/block');
    if (response.status === 200) {
      return response.data;
    }
  } catch (e: any) {
    return e.response.data;
    // throw new Error('Failed to block user');
  }
}
