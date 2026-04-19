// FE: src/api/auth.api.ts
import axiosInstance from './axiosConfig';
import { API_ENDPOINTS, type ApiResponse, type UserDTO } from '../../../shared/contracts';

export const authApi = {
  login: (username: string, password: string) =>
    axiosInstance.post<ApiResponse<UserDTO>>(API_ENDPOINTS.auth.login, { username, password }),

  register: (username: string, email: string, password: string, confirmPassword: string) =>
    axiosInstance.post<ApiResponse<UserDTO>>(API_ENDPOINTS.auth.register, { username, email, password, confirmPassword }),
  
  logout: () =>
    axiosInstance.post<ApiResponse<null>>(API_ENDPOINTS.auth.logout),

  me: () =>
    axiosInstance.get<ApiResponse<UserDTO>>(API_ENDPOINTS.auth.me),
};