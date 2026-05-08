// FE: src/api/auth.api.ts
import api from '@/lib/api';
import { API_ENDPOINTS, type UserDTO } from '../contracts';

export const authApi = {
  login: (username: string, password: string) =>
    api.post<UserDTO>(API_ENDPOINTS.auth.login, { username, password }),

  register: (username: string, email: string, password: string, confirmPassword: string) =>
    api.post<UserDTO>(API_ENDPOINTS.auth.register, { username, email, password, confirmPassword }),
  
  logout: () =>
    api.post<null>(API_ENDPOINTS.auth.logout),

  me: () =>
    api.get<UserDTO>(API_ENDPOINTS.auth.me),
};