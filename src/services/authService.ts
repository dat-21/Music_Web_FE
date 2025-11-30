import axiosInstance from '../api/axiosConfig';

interface User {
    id: string;
    username: string;
    email?: string;
}

interface LoginResponse {
    user: User;
}

interface RegisterResponse {
    message: string;
    user?: User;
}

class AuthService {
    /**
     * Đăng nhập (BE sẽ set cookie HttpOnly)
     */
    async login(username: string, password: string): Promise<User> {
        try {
            const res = await axiosInstance.post<LoginResponse>('/auth/login', {
                username,
                password,
            });

            // FE không lưu token — cookie đã được set bởi server
            return res.data.user;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (err: any) {
            throw new Error(err.response?.data?.message || 'Đăng nhập thất bại');
        }
    }

    /**
     * Đăng ký và tự đăng nhập (optional: bạn có thể tắt auto login)
     */
    async signup(username: string, email: string, password: string, confirmPassword: string): Promise<User> {
        try {
            const res = await axiosInstance.post<RegisterResponse>('/auth/register', {
                username,
                email,
                password,
                confirmPassword,
            });
            console.log(res);
            
            // Tự login sau khi đăng ký
            const user = await this.login(username, password);
            return user;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (err: any) {
            throw new Error(err.response?.data?.message || 'Đăng ký thất bại');
        }
    }

    /**
     * Đăng xuất
     * BE sẽ xoá cookie HttpOnly
     */
    async logout(): Promise<void> {
        try {
            await axiosInstance.post('/auth/logout');
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (err: any) {
            throw new Error(err.response?.data?.message || 'Đăng xuất thất bại');
        }
    }

    /** 
     * Lấy thông tin user hiện tại dựa trên cookie
     * FE không cần lưu token, chỉ fetch /auth/me
     */
    async getProfile(): Promise<User> {
        try {
            const res = await axiosInstance.get('/auth/me');
            return res.data.user;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (err: any) {
            throw new Error(err.response?.data?.message || 'Không thể lấy thông tin người dùng');
        }
    }
}

export default new AuthService();
