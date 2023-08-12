import { apiRequest } from './index';
import { TrophyInterface, ApiErrorResponse } from '../types';

export async function getAllTrophies()
: Promise<TrophyInterface[] | ApiErrorResponse> {
  return apiRequest<TrophyInterface[]>(
    'get',
    '/trophies/all',
    'Failed to get all trophies',
  );
}

export async function getUserIdTrophies(
  login: string | null,
) : Promise<TrophyInterface[] | ApiErrorResponse> {
  return apiRequest<TrophyInterface[]>(
    'get',
    '/trophies/user/' + (login ? login : ''),
    'Failed to get user trophies',
  );
}
