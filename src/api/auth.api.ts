// FE: src/api/auth.api.ts
import axios from 'axios';
import { API_ENDPOINTS,type ApiResponse,type UserDTO } from '../../../shared/contracts';

const rawBaseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
const normalizedBaseUrl = rawBaseUrl.replace(/\/+$/, '').replace(/\/api$/, '');

const http = axios.create({
  baseURL: normalizedBaseUrl,
  withCredentials: true,
});

export const authApi = {
  login: (username: string, password: string) =>
    http.post<ApiResponse<UserDTO>>(API_ENDPOINTS.auth.login, { username, password }),

  register: (username: string, email: string, password: string, confirmPassword: string) =>
    http.post<ApiResponse<UserDTO>>(API_ENDPOINTS.auth.register, { username, email, password, confirmPassword }),
  
  logout: () =>
    http.post<ApiResponse<null>>(API_ENDPOINTS.auth.logout),

  me: () =>
    http.get<ApiResponse<UserDTO>>(API_ENDPOINTS.auth.me),
};