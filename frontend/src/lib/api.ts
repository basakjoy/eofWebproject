import axios from 'axios';
import { getApiBaseUrl } from './apiUrl';
import { clearAuthSession } from './authUtils';

const apiClient = axios.create({
  baseURL: getApiBaseUrl(),
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      const requestUrl = error.config?.url || '';
      const isAuthRequest =
        requestUrl.includes('/auth/login') ||
        requestUrl.includes('/auth/register');

      // Do not bounce anonymous visitors to /login when a public route is loading.
      const isPublicSignalRead =
        requestUrl.includes('/signals') ||
        requestUrl.includes('/signals/') ||
        requestUrl.includes('/signals?');

      const hasStoredUser = typeof window !== 'undefined' && !!localStorage.getItem('user');
      const hasStoredToken = typeof window !== 'undefined' && !!localStorage.getItem('token');

      if (
        !isAuthRequest &&
        !isPublicSignalRead &&
        typeof window !== 'undefined' &&
        hasStoredUser &&
        hasStoredToken
      ) {
        clearAuthSession();
        if (!window.location.pathname.startsWith('/home')) {
          window.location.href = '/login';
        }
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;
