import axios from 'axios';

export function isNetworkError(error: unknown): boolean {
  if (typeof navigator !== 'undefined' && !navigator.onLine) return true;
  return axios.isAxiosError(error) && !error.response;
}
