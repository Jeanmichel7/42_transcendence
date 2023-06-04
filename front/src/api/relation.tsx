import api, { networkErrorResponse } from './index';
import { AxiosError } from 'axios';
import { ApiErrorResponse, UserInterface, UserRelation } from '../types';

export async function getFriends(): Promise< ApiErrorResponse | UserInterface[] > {
  try {
    const response = await api.get< UserInterface[] >('/relations/friends');
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
    throw new Error('Failed to get friends: ' + e);
  }
  throw new Error('Unexpected error');
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
    throw new Error('Failed to get profile friend : ' + e);
  }
  throw new Error('Unexpected error');
}

export async function getBlockedUsers(): Promise< ApiErrorResponse | UserInterface[] > {
  try {
    const response = await api.get<UserInterface[]>('/relations/blocked');
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
    throw new Error('Failed to get profile blocked user : ' + e);
  }
  throw new Error('Unexpected error');
}

export async function deleteFriend(userIdToRemove: number): Promise<void | ApiErrorResponse> {
  try {
    const response = await api.delete< void >('relations/friends/' + userIdToRemove + '/delete');
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
    throw new Error('Failed to delete user friend : ' + e);
  }
  throw new Error('Unexpected error');
}

export async function addFriend(userIdToAdd: number): Promise< UserRelation | ApiErrorResponse > {
  try {
    const response = await api.put< UserRelation >('relations/friends/' + userIdToAdd + '/add');
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
    throw new Error('Failed to add user friend : ' + e);
  }
  throw new Error('Unexpected error');
}


export async function apiBlockUser(userIdToBlock: UserInterface['id']):
Promise< UserRelation | ApiErrorResponse> {
  try {
    const response = await api.put< UserRelation >('relations/friends/' + userIdToBlock + '/block');
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
    throw new Error('Failed to block user : ' + e);
  }
  throw new Error('Unexpected error');
}
