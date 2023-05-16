import api from './index';

export async function getFriends() {
  try {
    const response = await api.get('/relations/friends');
    if (response.status === 200) {
      return response.data;
    }
  }
  catch (e: any) {
    return e.response.data
    // throw new Error('Failed to get friends');
  }
}

export async function apiBlockUser(userIdToBlock: number) {
  try {
    const response = await api.put('relations/friends/' + userIdToBlock + '/block');
    if (response.status === 200) {
      return response.data;
    }
  }
  catch (e: any) {
    return e.response.data
    // throw new Error('Failed to block user');
  }

}