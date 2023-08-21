import { apiRequest } from './index';
import { ApiErrorResponse, UserStatGamesInterface } from '../types';
import { GameInterface } from '../types/GameTypes';

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

export async function getStatusGame(
  gameId: number,
): Promise<string | ApiErrorResponse> {
  return apiRequest<string>(
    'get',
    '/games/' + gameId + '/status',
    'Failed to get status game: ',
  );
}

export async function acceptGameByBtn(
  gameId: number,
): Promise<GameInterface | ApiErrorResponse> {
  return apiRequest<GameInterface>(
    'patch',
    '/games/' + gameId + '/accept/noNotif',
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

export async function statsUserGames(
  userId: number,
): Promise<UserStatGamesInterface[] | ApiErrorResponse> {
  return apiRequest<UserStatGamesInterface[]>(
    'get',
    '/games/users/' + userId + '/stats',
    'Failed to get stats games: ',
  );
}

export async function getHistoryGames(
  userId: number,
  page: number,
  offset: number,
): Promise<GameInterface[] | ApiErrorResponse> {
  return apiRequest<GameInterface[]>(
    'get',
    '/games/users/' + userId + '/games?page=' + page + '&offset=' + offset,
    'Failed to get history games: ',
  );
}

export async function getAllGamesCount(
  userId: number,
): Promise<number | ApiErrorResponse> {
  return apiRequest<number>(
    'get',
    '/games/users/' + userId + '/countAllGames',
    'Failed to get all games count: ',
  );
}
