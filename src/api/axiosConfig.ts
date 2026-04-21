// src/api/axiosConfig.ts
import axios from 'axios';
import { env } from '@/config/env';

const normalizedApiUrl = env.API_URL.replace(/\/+$/, '');
const apiHost = normalizedApiUrl.endsWith('/api')
  ? normalizedApiUrl.slice(0, -'/api'.length)
  : normalizedApiUrl;

const axiosInstance = axios.create({
  baseURL: apiHost,
  withCredentials: true,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosInstance.interceptors.response.use(
  (res) => res,
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosInstance;