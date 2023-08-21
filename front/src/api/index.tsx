import axios, { AxiosError } from 'axios';
import { ApiErrorResponse } from '../types';

const api = axios.create({
  baseURL: '/api/',
  withCredentials: true,
});

export const networkErrorResponse: ApiErrorResponse = {
  statusCode: 500,
  error: 'Network Error',
  message: 'Failed to connect. Please check your internet connection.',
};

export async function apiRequest<T>(
  method: 'get' | 'post' | 'patch' | 'put' | 'delete',
  url: string,
  error: string,
  data?: unknown,
): Promise<T | ApiErrorResponse> {
  try {
    const response = await api[method]<T>(url, data);
    if (response.status === 200 || response.status === 201) {
      return response.data;
    }
  } catch (e: unknown) {
    const axiosError = e as AxiosError;
    if (axiosError) {
      if (!axiosError.response) {
        return networkErrorResponse;
      } else {
        return axiosError.response.data as ApiErrorResponse;
      }
    }
    throw new Error(`${error}: ${e}`);
  }
  throw new Error('Unexpected error');
}

export default api;
