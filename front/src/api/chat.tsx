import api, { apiAvatar } from './index';

export async function sendMessage(message: any, receiverId: any) {
  try {
    const response = await api.post('messages/users/' + receiverId + '/send', {
      text: message,
    });
    if (response.status === 200 || response.status === 201) {
      return response.data;
    }
  } catch (e: any) {
    return e.response;
  }
}

export async function getOldMessages(userId: any) {
  try {
    const response = await api.get('/messages/users/' + userId);
    if (response.status === 200) {
      return response.data;
    }
  } catch (e: any) {
    return e.response;
  }
}

export async function imgExist(url: string) {
  try {
    const response = await apiAvatar(url);
    console.log('respons eimage exist : ', response);
    if (response.status === 200) {
      return true;
    }
  } catch (e: any) {
    return false;
  }
}