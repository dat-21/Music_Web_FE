// src/api/axiosConfig.ts
import axios from 'axios';
import { env } from '@/config/env';
import { API_ENDPOINTS } from '../../../shared/contracts';

const axiosInstance = axios.create({
  baseURL: `${env.API_URL}${API_ENDPOINTS.base.api}`,
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