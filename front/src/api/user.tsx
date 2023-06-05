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

// export async function fetchUserAccount(): Promise< UserInterface | ApiErrorResponse> {
//   try {
//     const response = await api.get< UserInterface >('users/allDatass');
//     if (response.status === 200) {
//       return response.data;
//     }
//   } catch (e: unknown) {
//     console.log('e : ', e)
//     if (e instanceof Error && 'response' in e) {
//       // const errorResponse = e.response.data ;
//       return e.response.data;
//     }
//     throw new Error('Failed to check auth: ' + e);
//   }
//   throw new Error('Unexpected error');
// }

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

export async function getAllUsers()
: Promise< UserInterface[] | ApiErrorResponse > {
  return apiRequest<UserInterface[]>(
    'get',
    '/users/all',
    'Failed to get all users: ',
  );
}
