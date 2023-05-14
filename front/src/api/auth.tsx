import api from './index';

export async function check2FACookie() {
  const res = await api.get('/auth/check-2FA');

  if (res.status === 200) {
    console.log(res.data)
    return res.data;
  } else {
    throw new Error('Failed to check 2FA enabled');
  }
}

export async function send2FA(code: any, userId: any) {
  const body = {
    code,
    userId,
  };

  const response = await api.post('/auth/login2fa', body);

  if (response.status === 200) {
    return response.data;
  } else {
    throw new Error('Failed to send 2FA code');
  }
}

export async function logout() {
  const response = await api.get('/auth/logout');

  if (response.status === 200) {
    return response.data;
  } else {
    throw new Error('Failed to logout');
  }
}

export async function getUserData() {
  const response = await api.get('/users');

  if (response.status === 200) {
    return response.data;
  }
  else {
    throw new Error('Failed to get user data');
  }
}