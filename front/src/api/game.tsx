import api from './index';

export async function getHistoryGames(userId: bigint) {
  try {
    const response = await api.get('/games/users/' + userId + '/allUserGames');
    if (response.status === 200) {
      return response.data;
    }
  } catch (e: any) {
    return e.response.data;
    // throw new Error('Failed to get user');
  }
}