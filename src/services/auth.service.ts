import { authApi } from '../api/auth.api';
import { withApiError } from '../utils/apiError.utils';
import type { UserDTO } from '../../../shared/contracts';

class AuthService {
  async login(username: string, password: string): Promise<UserDTO> {
    return withApiError(async () => {
      const res = await authApi.login(username, password); 
      return res.data.data!;
    }, 'Đăng nhập thất bại');
  }

  async signup(username: string, email: string, password: string, confirmPassword: string): Promise<UserDTO> {
    return withApiError(async () => {
      await authApi.register(username, email, password, confirmPassword);
      return await this.login(username, password);
    }, 'Đăng ký thất bại');
  }

  async logout(): Promise<void> {
    return withApiError(async () => {
      await authApi.logout();
    }, 'Đăng xuất thất bại');
  }

  async getProfile(): Promise<UserDTO> {
    return withApiError(async () => {
      const res = await authApi.me();
      return res.data.data!;
    }, 'Không thể lấy thông tin người dùng');
  }
}

export default new AuthService();