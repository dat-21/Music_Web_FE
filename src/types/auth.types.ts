export interface User {
    id: string;
  username: string;
  email?: string;
  fullName?: string;
  role?: string;
  avatar?: string;
  createdAt?: string;
}

export interface LoginRequest {
  username: string; // Thay đổi từ email
  password: string;
}
export interface LoginResponse {
  token: string;
  user: User;
}

export interface ApiResponse {
  message: string;
}
export interface AuthContextType {
    user: User | null;
    token: string | null;
    login: (user: User, token: string) => void;
    logout: () => void;
    isAuthenticated: boolean;
}
export interface RegisterRequest {
//   fullName: string;
    //   email: string;
    username: string;
  password: string;
//   confirmPassword: string;
}

export interface VerifyEmailRequest {
  email: string;
  otpCode: string;
}

export interface ResetPasswordRequest {
  email: string;
  otpCode: string;
  newPassword: string;
  confirmPassword: string;
}

export interface ChangePasswordRequest {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
}