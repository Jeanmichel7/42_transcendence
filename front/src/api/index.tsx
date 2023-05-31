import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000',
  withCredentials: true,
  // headers: {
  //   'Content-Type': 'application/json',
  // },
});

const apiAvatar = axios.create({
  baseURL: 'http://localhost:3000/avatars',
  withCredentials: true,
  method: 'HEAD',
});

export default api;
export { apiAvatar };
