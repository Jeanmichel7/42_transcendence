import { AxiosError } from 'axios';
import api, { networkErrorResponse } from './index';
import { ApiErrorResponse, Api2FAResponse, UserInterface, ApiLogin2FACode } from '../types';

export async function isAuthenticated() {
  try {
    const response = await api.get('/auth/isAuthenticated');
    if (response.status === 200) {
      return response.data;
    }
  } catch (e: any) {
    return e.response.data;
    // throw new Error('Failed to check auth');
  }
}

export async function check2FACookie(): Promise< Api2FAResponse | ApiErrorResponse > {
  try {
    const response = await api.get< Api2FAResponse >('/auth/check-2FA');
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
    throw new Error('Failed to check auth: ' + e);
  }
  throw new Error('Unexpected error');
}

// export async function send2FA(code: any, userId: any) {
//   const body = {
//     code,
//     userId,
//   };
//   try {
//     const response = await api.post('/auth/2FA', body);
//     if (response.status === 200) {
//       return response.data;
//     }
//   }
//   catch (e: any) {
//     return e.response.data
//     // throw new Error('Failed to send 2FA code');
//   }
// }

export async function logout() {
  try {
    const response = await api.get('/auth/logout');
    if (response.status === 200) {
      return response.data;
    }
  } catch (e: any) {
    return e.response.data;
    // throw new Error('Failed to logout');
  }
}

export async function Active2FA(): Promise< string | ApiErrorResponse > {
  try {
    const response = await api.put<string>('auth/enable2FA');
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
    throw new Error('Failed to active 2FA: ' + e);
  }
  throw new Error('Unexpected error');
}

export async function Desactive2FA(): Promise< UserInterface | ApiErrorResponse > {
  try {
    const response = await api.put<UserInterface>('auth/disable2fa');
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
    throw new Error('Failed to desactive 2FA: ' + e);
  }
  throw new Error('Unexpected error');
}

export async function check2FACode(code: string, userId: number): Promise< ApiLogin2FACode | ApiErrorResponse > {
  try {
    const response = await api.post< ApiLogin2FACode >('/auth/login2fa', { 
      code: code,
      userId: userId,
    });
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
    throw new Error('Failed to check 2FA code: ' + e);
  }
  throw new Error('Unexpected error');
}