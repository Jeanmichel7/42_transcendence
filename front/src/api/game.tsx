import { apiRequest } from './index';
import { ApiErrorResponse } from '../types';
import { GameInterface } from '../types/GameTypes';

export async function getHistoryGames(
  userId: number,
): Promise<GameInterface[] | ApiErrorResponse> {
  return apiRequest<GameInterface[]>(
    'get',
    '/games/users/' + userId + '/allUserGames',
    'Failed to get history games: ',
  );
}

export async function getGame(
  gameId: number,
): Promise<GameInterface | ApiErrorResponse> {
  return apiRequest<GameInterface>(
    'get',
    '/games/' + gameId,
    'Failed to get game: ',
  );
}

export async function inviteGameUser(
  userId: number,
): Promise<GameInterface | ApiErrorResponse> {
  return apiRequest<GameInterface>(
    'patch',
    '/games/users/' + userId + '/invite',
    'Failed to invite user: ',
  );
}

export async function acceptGame(
  gameId: number,
): Promise<GameInterface | ApiErrorResponse> {
  return apiRequest<GameInterface>(
    'patch',
    '/games/' + gameId + '/accept',
    'Failed to accept game: ',
  );
}

export async function declineGame(
  gameId: number,
): Promise<void | ApiErrorResponse> {
  return apiRequest<void>(
    'patch',
    '/games/' + gameId + '/decline',
    'Failed to decline game: ',
  );
}
