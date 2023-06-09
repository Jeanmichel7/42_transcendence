import { apiRequest } from './index';
import { UserInterface, ApiErrorResponse } from '../types';

export async function getUserData()
: Promise< UserInterface | ApiErrorResponse > {
  return apiRequest<UserInterface>(
    'get',
    '/users',
    'Failed to get user data: ',
  );
}

export async function fetchUserAccount()
: Promise< UserInterface | ApiErrorResponse > {
  return apiRequest<UserInterface>(
    'get',
    '/users/allDatas',
    'Failed to get user data: ',
  );
}

export async function getProfileByPseudo(
  pseudo: string,
): Promise< UserInterface | ApiErrorResponse > {
  return apiRequest<UserInterface>(
    'get',
    '/users/' + pseudo + '/profile',
    'Failed to get profile: ',
  );
}

export async function patchUserAccount(
  data: FormData,
): Promise< UserInterface | ApiErrorResponse > {
  return apiRequest<UserInterface>(
    'patch',
    '/users',
    'Failed to modify user: ',
    data,
  );
}

export async function getAllUsers(
): Promise< UserInterface[] | ApiErrorResponse > {
  return apiRequest<UserInterface[]>(
    'get',
    `/users/all`,
    'Failed to get all users: ',
  );
}

export async function getAllUsersPaginate(
  page: number,
  limit: number,
): Promise< UserInterface[] | ApiErrorResponse > {
  return apiRequest<UserInterface[]>(
    'get',
    `/users/all?page=${page}&limit=${limit}`,
    'Failed to get all users: ',
  );
}

export async function getAllUsersCount()
: Promise< number | ApiErrorResponse > {
  return apiRequest<number>(
    'get',
    '/users/all/count',
    'Failed to get all users count: ',
  );
}