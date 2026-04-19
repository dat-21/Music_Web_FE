import { create } from 'zustand';
import authService from '../services/auth.service';
import type { AuthState } from '../types';



export const useAuthStore = create<AuthState>((set) => ({
    user: null,
    isAuthenticated: false,
    isLoading: true, // ✅ Ban đầu đang load

    login: async (username, password) => {
        set({ isLoading: true });
        try {
            const user = await authService.login(username, password);
            set({ user, isAuthenticated: true, isLoading: false });
        } catch (error) {
            set({ isLoading: false });
            throw error;
        }
    },
 
    logout: async () => {
        try {
            await authService.logout();
        } catch (error) {
            console.error('Logout failed:', error);
        } finally {
            // Always clear local auth state to guarantee guest flow transition.
            set({ user: null, isAuthenticated: false });
        }
    },

    loadUser: async () => {
        set({ isLoading: true }); // ✅ Set loading trước khi fetch
        try {
            const user = await authService.getProfile();
            set({ user, isAuthenticated: true, isLoading: false });
        } catch (error) {
            // ✅ Nếu lỗi verify email, clear cookie và logout
            //
            if (error instanceof Error && error.message?.includes('not verified')) {
                await authService.logout(); // Xóa cookie
            }
            // ✅ Silent fail - không log lỗi 401
            set({ user: null, isAuthenticated: false, isLoading: false });
        }
    },
}));