import api from './index';

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

export async function fetchUserAccount() {
  try {
    const response = await api.get('users/allDatas');
    if (response.status === 200) {
      return response.data;
    }
  }
  catch (e: any) {
    return e.response.data
    // throw new Error('Failed to check auth');
  }
}

export async function getProfileByPseudo(pseudo: string) {
  try {
    const response = await api.get('users/' + pseudo + '/profile');
    if (response.status === 200) {
      return response.data;
    }
  }
  catch (e: any) {
    return e.response.data
    // throw new Error('Failed to check auth');
  }
}

export async function patchUserAccount(data: any) {
  try {
    const response = await api.patch('users', data);
    if (response.status === 200) {
      return response.data;
    }
  }
  catch (e: any) {
    return e.response.data
    // throw new Error('Failed to check auth');
  }
}


export async function getAllUsers() {
  try {
    const response = await api.get('users/all');
    if (response.status === 200) {
      return response.data;
    }
  }
  catch (e: any) {
    return e.response.data
    // throw new Error('Failed to check auth');
  }
}
