import { AxiosError } from 'axios';
import api, { networkErrorResponse } from './index';
import { ApiErrorResponse } from '../types';
import { GameInterface } from '../types/GameTypes';

export async function getHistoryGames(userId: number): Promise< GameInterface[] | ApiErrorResponse > {
  try {
    const response = await api.get<GameInterface[]>('/games/users/' + userId + '/allUserGames');
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
    throw new Error('Failed to get history games: ' + e);
  }
  throw new Error('Unexpected error');
}