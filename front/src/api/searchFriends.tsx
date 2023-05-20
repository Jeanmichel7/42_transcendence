import api from './index';

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
