import axios from 'axios';
import { ApiErrorResponse } from '../types';

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

export const networkErrorResponse: ApiErrorResponse = {
  status: 500,
  error: 'Network Error',
  message: 'Failed to connect. Please check your internet connection.',
};

export default api;
export { apiAvatar };


