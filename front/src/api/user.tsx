import api, { networkErrorResponse } from './index';
import { UserInterface, ApiErrorResponse } from '../types';
import { AxiosError } from 'axios';

export async function getUserData(): Promise< UserInterface | ApiErrorResponse > {
  try {
    const response = await api.get< UserInterface >('/users');
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
    throw new Error('Failed to get user data: ' + e);
  }
  throw new Error('Unexpected error');
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

export async function fetchUserAccount(): Promise< UserInterface | ApiErrorResponse > {
  try {
    const response = await api.get< UserInterface >('users/allDatas');
    if (response.status === 200)
      return response.data;
  } catch (e: unknown) {
    const axiosError = e as AxiosError;
    if (axiosError) {
      if (!axiosError.response)
        return networkErrorResponse;
      else
        return axiosError.response.data as ApiErrorResponse;
    }
    throw new Error('Failed to check auth: ' + e);
  }
  throw new Error('Unexpected error');
}

export async function getProfileByPseudo(pseudo: string): Promise< UserInterface | ApiErrorResponse > {
  try {
    const response = await api.get< UserInterface >('users/' + pseudo + '/profile');
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
    throw new Error('Failed to get profile \'' + pseudo + '\' : ' + e);
  }
  throw new Error('Unexpected error');
}

export async function patchUserAccount(data: FormData) {
  try {
    const response = await api.patch('users', data);
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
    throw new Error('Failed to modify user: ' + e);
  }
  throw new Error('Unexpected error');
}


export async function getAllUsers(): Promise< UserInterface[] | ApiErrorResponse > {
  try {
    const response = await api.get<UserInterface[]>('users/all');
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
    throw new Error('Failed to get all users: ' + e);
  }
  throw new Error('Unexpected error');
}

