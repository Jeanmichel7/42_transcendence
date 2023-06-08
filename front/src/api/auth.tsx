import { apiRequest } from './index';
import { ApiErrorResponse, Api2FAResponse, UserInterface, ApiLogin2FACode } from '../types';
import { AuthInterface, AuthLogout } from '../types/AuthTypes';

export async function isAuthenticated(): Promise< boolean | ApiErrorResponse > {
  return apiRequest<boolean>(
    'get',
    '/auth/isAuthenticated',
    'Failed to check authentication: ',
  );
}

export async function check2FACookie(): Promise< Api2FAResponse | ApiErrorResponse > {
  return apiRequest<Api2FAResponse>(
    'get',
    '/auth/check-2FA',
    'Failed to check 2FA cookie: ',
  );
}

export async function logout(): Promise < AuthLogout | ApiErrorResponse > {
  return apiRequest<AuthLogout>(
    'get',
    '/auth/logout',
    'Failed to logout: ',
  );
}

export async function Active2FA(): Promise< string | ApiErrorResponse > {
  return apiRequest<string>(
    'put',
    '/auth/enable2FA',
    'Failed to active 2FA: ',
  );
}

export async function Desactive2FA(): Promise< UserInterface | ApiErrorResponse > {
  return apiRequest<UserInterface>(
    'put',
    '/auth/disable2fa',
    'Failed to desactive 2FA: ',
  );
}

export async function check2FACode(
  code: string,
  userId: number,
): Promise< ApiLogin2FACode | ApiErrorResponse > {
  return apiRequest<ApiLogin2FACode>(
    'post',
    '/auth/login2fa',
    'Failed to check 2FA code: ',
    {
      code: code,
      userId: userId,
    },
  );
}

export async function loginFakeUser(
  login: string,
  password: string,
): Promise< AuthInterface | ApiErrorResponse > {
  return apiRequest<AuthInterface>(
    'post',
    '/auth/loginFakeUser',
    'Failed to login fake user: ',
    {
      login: login,
      password: password,
    },
  );
}

export async function registerFakeUser(body: any)
  : Promise< UserInterface | ApiErrorResponse > {
  return apiRequest<UserInterface>(
    'post',
    '/users/registerFakeUser',
    'Failed to register fake user: ',
    body,
  );
}