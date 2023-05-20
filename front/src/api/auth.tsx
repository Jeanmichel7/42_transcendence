import api from './index';

export async function isAuthenticated() {
  try {
    const response = await api.get('/auth/isAuthenticated');
    if (response.status === 200) {
      return response.data;
    }
  }
  catch (e: any) {
    return e.response.data
    // throw new Error('Failed to check auth');
  }
}

export async function check2FACookie() {
  try {
    const response = await api.get('/auth/check-2FA');
    if (response.status === 200) {
      return response.data;
    }
  }
  catch (e: any) {
    return e.response.data
    // throw new Error('Failed to check  2FA ');
  }
}

export async function send2FA(code: any, userId: any) {
  const body = {
    code,
    userId,
  };
  try {
    const response = await api.post('/auth/2FA', body);
    if (response.status === 200) {
      return response.data;
    }
  }
  catch (e: any) {
    return e.response.data
    // throw new Error('Failed to send 2FA code');
  }
}

export async function logout() {
  try {
    const response = await api.get('/auth/logout');
    if (response.status === 200) {
      return response.data;
    }
  }
  catch (e: any) {
    return e.response.data
    // throw new Error('Failed to logout');
  }
}

export async function getUserData() {
  try {
    const response = await api.get('/users');
    if (response.status === 200) {
      return response.data;
    }
  }
  catch (e: any) {
    return e.response.data
    // throw new Error('Failed to get user');
  }
}