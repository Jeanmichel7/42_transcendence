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

export async function getFriendProfile(login: string) {
  try {
    const response = await api.get('/relations/profilefriends/' + login );
    if (response.status === 200) {
      return response.data;
    }
  }
  catch (e: any) {
    return e.response.data
    // throw new Error('Failed to get friend profile');
  }
}

export async function deleteFriend(userIdToRemove: number) {
  try {
    const response = await api.delete('relations/friends/' + userIdToRemove + '/delete');
    if (response.status === 200) {
      return response.data;
    }
  }
  catch (e: any) {
    return e.response.data
    // throw new Error('Failed to remove friend');
  }
}

export async function addFriend(userIdToAdd: number) {
  try {
    const response = await api.put('relations/friends/' + userIdToAdd + '/add');
    if (response.status === 200) {
      return response.data;
    }
  }
  catch (e: any) {
    return e.response.data
    // throw new Error('Failed to add friend');
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
