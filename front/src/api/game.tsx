import { apiRequest } from './index';
import { ApiErrorResponse } from '../types';
import { GameInterface } from '../types/GameTypes';

export async function getHistoryGames(userId: number): Promise< GameInterface[] | ApiErrorResponse > {
  return apiRequest<GameInterface[]>(
    'get',
    '/games/users/' + userId + '/allUserGames',
    'Failed to get history games: ',
  );
}
