/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import useNotification from "../../hooks/useNotification";
import { useNavigate } from "react-router-dom";
import authService from "../../services/authService";
import { IoEyeSharp, IoEyeOffSharp } from "react-icons/io5";
import { UserPlus, User, Mail, Lock, ShieldCheck, CheckCircle, XCircle } from "lucide-react";

const RegisterPage = () => {
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
    });
    const navigate = useNavigate();
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showPassword1, setShowPassword1] = useState(false);
    const { showSuccess, showError, showInfo } = useNotification();
    const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        setError("");
        setSuccess(false);

        // Validate
        if (formData.username.length < 3) {
            showError("Tên đăng nhập phải có ít nhất 3 ký tự!");
            return;
        }

        if (!formData.email || !formData.email.includes('@')) {
            showError("Email không hợp lệ!");
            return;
        }

        if (formData.password.length < 6) {
            showError("Mật khẩu phải có ít nhất 6 ký tự!");
            return;
        }

        if (formData.password !== formData.confirmPassword) {
            showError("Mật khẩu xác nhận không khớp!");
            return;
        }

        try {
            const result = await authService.signup(
                formData.username,
                formData.email,
                formData.password,
                formData.confirmPassword,
            )

            const successMessage =
                typeof result === "string"
                    ? result
                    : (result as any)?.message ?? "Đăng Kí Thành Công!"

            showSuccess(successMessage)
            setSuccess(true)
            setTimeout(() => {
                navigate("/login");
            }, 2000);
        } catch (error) {
            const errorMessage = (error as any).message || "Đăng Kí Không Thành Công!"
            showError(errorMessage)
            setSuccess(false);
        }
    };

    return (
        <div className="min-h-screen relative flex items-center justify-center overflow-hidden py-8">
            {/* Background image */}
            <div
                className="absolute inset-0 bg-cover bg-center bg-no-repeat scale-110"
                style={{ backgroundImage: "url('/auth-bg.jpg')" }}
            />
            {/* Dark overlay with subtle gradient */}
            <div className="absolute inset-0 bg-linear-to-br from-black/70 via-black/50 to-black/70" />
            {/* Animated floating particles effect */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="auth-particle auth-particle-1" />
                <div className="auth-particle auth-particle-2" />
                <div className="auth-particle auth-particle-3" />
            </div>

            {/* Card */}
            <div className="relative z-10 max-w-md w-full mx-4 auth-card-appear">
                <div className="bg-zinc-900/70 backdrop-blur-2xl border border-white/8 rounded-2xl shadow-2xl shadow-black/60 p-8">
                    {/* Header */}
                    <div className="text-center mb-6">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-linear-to-br from-spotify-blue/30 to-cyan-500/20 border border-white/10 rounded-2xl mb-5 shadow-lg shadow-spotify-blue/10">
                            <UserPlus className="w-8 h-8 text-spotify-blue" strokeWidth={1.5} />
                        </div>
                        <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">
                            Đăng ký tài khoản
                        </h1>
                        <p className="text-zinc-400 text-sm">Tạo tài khoản mới để bắt đầu!</p>
                    </div>

                    {/* Success Message */}
                    {success && (
                        <div className="mb-5 p-3.5 bg-green-500/10 border border-green-500/20 text-green-400 rounded-xl animate-pulse">
                            <div className="flex items-center gap-2">
                                <CheckCircle className="w-5 h-5 shrink-0" />
                                <span className="text-sm">Đăng ký thành công! Đang chuyển đến trang đăng nhập...</span>
                            </div>
                        </div>
                    )}

                    {/* Error Message */}
                    {error && (
                        <div className="mb-5 p-3.5 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl">
                            <div className="flex items-center gap-2">
                                <XCircle className="w-5 h-5 shrink-0" />
                                <span className="text-sm">{error}</span>
                            </div>
                        </div>
                    )}

                    {/* Form */}
                    <div className="space-y-4">
                        {/* Username */}
                        <div>
                            <label htmlFor="username" className="block text-sm font-medium text-zinc-300 mb-2">
                                Tên đăng nhập
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                                    <User className="h-[18px] w-[18px] text-zinc-500" />
                                </div>
                                <input
                                    id="username"
                                    type="text"
                                    value={formData.username}
                                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                                    className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/8 text-white placeholder-zinc-500 rounded-xl focus:ring-2 focus:ring-spotify-blue/40 focus:border-spotify-blue/40 focus:bg-white/8 transition-all duration-200 outline-none disabled:opacity-50"
                                    placeholder="Nhập tên đăng nhập"
                                    disabled={success}
                                />
                            </div>
                        </div>

                        {/* Email */}
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-zinc-300 mb-2">
                                Email
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                                    <Mail className="h-[18px] w-[18px] text-zinc-500" />
                                </div>
                                <input
                                    id="email"
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/8 text-white placeholder-zinc-500 rounded-xl focus:ring-2 focus:ring-spotify-blue/40 focus:border-spotify-blue/40 focus:bg-white/8 transition-all duration-200 outline-none disabled:opacity-50"
                                    placeholder="Nhập email của bạn"
                                    disabled={success}
                                />
                            </div>
                        </div>

                        {/* Password */}
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-zinc-300 mb-2">
                                Mật khẩu
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                                    <Lock className="h-[18px] w-[18px] text-zinc-500" />
                                </div>
                                <input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    className="w-full pl-10 pr-10 py-3 bg-white/5 border border-white/8 text-white placeholder-zinc-500 rounded-xl focus:ring-2 focus:ring-spotify-blue/40 focus:border-spotify-blue/40 focus:bg-white/8 transition-all duration-200 outline-none disabled:opacity-50"
                                    placeholder="Nhập mật khẩu (tối thiểu 6 ký tự)"
                                    disabled={success}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-zinc-500 hover:text-zinc-300 transition-colors"
                                    tabIndex={-1}
                                >
                                    {showPassword ? (
                                        <IoEyeOffSharp className="h-5 w-5" />
                                    ) : (
                                        <IoEyeSharp className="h-5 w-5" />
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* Confirm Password */}
                        <div>
                            <label htmlFor="confirmPassword" className="block text-sm font-medium text-zinc-300 mb-2">
                                Xác nhận mật khẩu
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                                    <ShieldCheck className="h-[18px] w-[18px] text-zinc-500" />
                                </div>
                                <input
                                    id="confirmPassword"
                                    type={showPassword1 ? "text" : "password"}
                                    value={formData.confirmPassword}
                                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                                    className="w-full pl-10 pr-10 py-3 bg-white/5 border border-white/8 text-white placeholder-zinc-500 rounded-xl focus:ring-2 focus:ring-spotify-blue/40 focus:border-spotify-blue/40 focus:bg-white/8 transition-all duration-200 outline-none disabled:opacity-50"
                                    placeholder="Nhập lại mật khẩu"
                                    disabled={success}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword1(!showPassword1)}
                                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-zinc-500 hover:text-zinc-300 transition-colors"
                                    tabIndex={-1}
                                >
                                    {showPassword1 ? (
                                        <IoEyeOffSharp className="h-5 w-5" />
                                    ) : (
                                        <IoEyeSharp className="h-5 w-5" />
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* Terms */}
                        <div className="flex items-start">
                            <input
                                type="checkbox"
                                id="terms"
                                className="w-4 h-4 mt-0.5 bg-white/5 border-white/20 rounded text-spotify-blue focus:ring-spotify-blue/40 focus:ring-offset-0"
                            />
                            <label htmlFor="terms" className="ml-2 text-sm text-zinc-400">
                                Tôi đồng ý với{" "}
                                <button
                                    type="button"
                                    onClick={() => showInfo("Điều khoản dịch vụ")}
                                    className="text-spotify-blue hover:text-cyan-400 font-medium transition-colors"
                                >
                                    Điều khoản dịch vụ
                                </button>
                                {" "}và{" "}
                                <button
                                    type="button"
                                    onClick={() => showInfo("Chính sách bảo mật")}
                                    className="text-spotify-blue hover:text-cyan-400 font-medium transition-colors"
                                >
                                    Chính sách bảo mật
                                </button>
                            </label>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="button"
                            onClick={handleSubmit}
                            disabled={success}
                            className="w-full bg-linear-to-r from-spotify-blue to-cyan-600 hover:from-spotify-blue/90 hover:to-cyan-600/90 text-white py-3 rounded-xl font-semibold focus:outline-none focus:ring-2 focus:ring-spotify-blue/50 focus:ring-offset-2 focus:ring-offset-zinc-900 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.01] active:scale-[0.99] shadow-lg shadow-spotify-blue/20"
                        >
                            {success ? (
                                <span className="inline-flex items-center gap-2">
                                    <CheckCircle className="w-5 h-5" />
                                    Đăng ký thành công!
                                </span>
                            ) : "Đăng ký"}
                        </button>
                    </div>

                    {/* Divider */}
                    <div className="relative my-6">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-white/8"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-3 bg-zinc-900/70 text-zinc-500">Hoặc đăng ký với</span>
                        </div>
                    </div>

                    {/* Social Register */}
                    <div className="grid grid-cols-2 gap-3">
                        <button
                            type="button"
                            onClick={() => showInfo("Đăng ký Google")}
                            className="flex items-center justify-center px-4 py-2.5 bg-white/5 border border-white/8 rounded-xl hover:bg-white/10 transition-all duration-200"
                        >
                            <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                            </svg>
                            <span className="text-sm font-medium text-zinc-300">Google</span>
                        </button>

                        <button
                            type="button"
                            onClick={() => showInfo("Đăng ký Facebook")}
                            className="flex items-center justify-center px-4 py-2.5 bg-white/5 border border-white/8 rounded-xl hover:bg-white/10 transition-all duration-200"
                        >
                            <svg className="w-5 h-5 mr-2" fill="#1877F2" viewBox="0 0 24 24">
                                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                            </svg>
                            <span className="text-sm font-medium text-zinc-300">Facebook</span>
                        </button>
                    </div>

                    {/* Footer */}
                    <p className="mt-6 text-center text-sm text-zinc-500">
                        Đã có tài khoản?{" "}
                        <button
                            type="button"
                            onClick={() => {
                                showInfo("Chuyển đến trang đăng nhập");
                                navigate("/login");
                            }}
                            className="text-spotify-blue hover:text-cyan-400 font-medium transition-colors"
                        >
                            Đăng nhập ngay
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default RegisterPage;
