import api from './index';

export async function getFriends() {
  const res = await api.get('/relations/friends');

  if (res.status === 200) {
    console.log(res.data)
    return res.data;
  } else {
    throw new Error('Failed to get friends');
  }
}

export async function sendMessage(message: any, receiverId: any) {
  try {
    const response = await api.post('messages/users/' + receiverId + '/send', {
      text: message,
    });
    if (response.status === 200 || response.status === 201) {
      return response.data;
    }
  } catch(e: any) {
    return e.response.data
  }
}

export async function getOldMessages(userId: any) {
  try {
    const response = await api.get('/messages/users/' + userId);
    if (response.status === 200) {
      return response.data;
    }
  } catch (e: any) {
    return e.response.data
  }
}



// export async function getUserData() {
//   const response = await api.get('/users');

//   if (response.status === 200) {
//     return response.data;
//   }
//   else {
//     throw new Error('Failed to get user data');
//   }
// }