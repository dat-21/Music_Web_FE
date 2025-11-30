/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import useNotification from "../../hooks/userNotification";
import { useNavigate } from "react-router-dom";
import authService from "../../services/authService";
import { IoEyeSharp, IoEyeOffSharp } from "react-icons/io5";
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
        <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-purple-50 to-pink-100 p-4">
            <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8">
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-100 rounded-full mb-4">
                        <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                        </svg>
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                        Đăng ký tài khoản
                    </h1>
                    <p className="text-gray-600">Tạo tài khoản mới để bắt đầu!</p>
                </div>

                {/* Success Message */}
                {success && (
                    <div className="mb-4 p-4 bg-green-50 border border-green-200 text-green-700 rounded-lg animate-pulse">
                        <div className="flex items-center">
                            <svg
                                className="w-5 h-5 mr-2 shrink-0"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                    clipRule="evenodd"
                                />
                            </svg>
                            <span>Đăng ký thành công! Đang chuyển đến trang đăng nhập...</span>
                        </div>
                    </div>
                )}

                {/* Error Message */}
                {error && (
                    <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
                        <div className="flex items-center">
                            <svg className="w-5 h-5 mr-2 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                            </svg>
                            {error}
                        </div>
                    </div>
                )}

                {/* Form */}
                <div className="space-y-6">
                    {/* Username */}
                    <div>
                        <label
                            htmlFor="username"
                            className="block text-sm font-medium text-gray-700 mb-2"
                        >
                            Tên đăng nhập
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                            </div>
                            <input
                                id="username"
                                type="text"
                                value={formData.username}
                                onChange={(e) =>
                                    setFormData({ ...formData, username: e.target.value })
                                }
                                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition disabled:opacity-50"
                                placeholder="Nhập tên đăng nhập"
                                disabled={success}
                            />
                        </div>
                    </div>

                    {/* Email */}
                    <div>
                        <label
                            htmlFor="email"
                            className="block text-sm font-medium text-gray-700 mb-2"
                        >
                            Email
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                                </svg>
                            </div>
                            <input
                                id="email"
                                type="email"
                                value={formData.email}
                                onChange={(e) =>
                                    setFormData({ ...formData, email: e.target.value })
                                }
                                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition disabled:opacity-50"
                                placeholder="Nhập email của bạn"
                                disabled={success}
                            />
                        </div>
                    </div>

                    {/* Password */}
                    <div>
                        <label
                            htmlFor="password"
                            className="block text-sm font-medium text-gray-700 mb-2 mt-2"
                        >
                            Mật khẩu
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                </svg>
                            </div>
                            <input
                                id="password"
                                type={showPassword ? "text" : "password"}
                                value={formData.password}
                                onChange={(e) =>
                                    setFormData({ ...formData, password: e.target.value })
                                }
                                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition disabled:opacity-50"
                                placeholder="Nhập mật khẩu (tối thiểu 6 ký tự)"
                                disabled={success}
                            />
                            {/* 👁 Icon toggle hiển thị mật khẩu */}
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
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
                    <div className="mb-2 mt-2">
                        <label
                            htmlFor="confirmPassword"
                            className="block text-sm font-medium text-gray-700 mb-2 mt-2"
                        >
                            Xác nhận mật khẩu
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <input
                                id="confirmPassword"
                                type={showPassword1 ? "text" : "password"}
                                value={formData.confirmPassword}
                                onChange={(e) =>
                                    setFormData({ ...formData, confirmPassword: e.target.value })
                                }
                                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition disabled:opacity-50"
                                placeholder="Nhập lại mật khẩu"
                                disabled={success}
                            />

                            {/* 👁 Icon toggle hiển thị mật khẩu */}
                            <button
                                type="button"
                                onClick={() => setShowPassword1(!showPassword1)}
                                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
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
                    <div className="flex items-start mt-2 mb-2">
                        <input
                            type="checkbox"
                            id="terms"
                            className="w-4 h-4 mt-1 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                        />
                        <label htmlFor="terms" className="ml-2 text-sm text-gray-600">
                            Tôi đồng ý với{" "}
                            <button
                                type="button"
                                onClick={() => showInfo("Điều khoản dịch vụ")}
                                className="text-purple-600 hover:text-purple-700 font-medium"
                            >
                                Điều khoản dịch vụ
                            </button>
                            {" "}và{" "}
                            <button
                                type="button"
                                onClick={() => showInfo("Chính sách bảo mật")}
                                className="text-purple-600 hover:text-purple-700 font-medium"
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
                        className="w-full bg-purple-600 text-white py-3 rounded-lg font-medium hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] active:scale-[0.98]"
                    >
                        {success ? "Đăng ký thành công!" : "Đăng ký"}
                    </button>
                </div>

                {/* Divider */}
                <div className="relative my-6">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-300"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                        <span className="px-2 bg-white text-gray-500">Hoặc đăng ký với</span>
                    </div>
                </div>

                {/* Social Register */}
                <div className="grid grid-cols-2 gap-4">
                    <button
                        type="button"
                        onClick={() => showInfo("Đăng ký Google")}
                        className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
                    >
                        <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                        </svg>
                        <span className="text-sm font-medium text-gray-700">Google</span>
                    </button>

                    <button
                        type="button"
                        onClick={() => showInfo("Đăng ký Facebook")}
                        className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
                    >
                        <svg className="w-5 h-5 mr-2" fill="#1877F2" viewBox="0 0 24 24">
                            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                        </svg>
                        <span className="text-sm font-medium text-gray-700">Facebook</span>
                    </button>
                </div>

                {/* Footer */}
                <p className="mt-6 text-center text-sm text-gray-600">
                    Đã có tài khoản?{" "}
                    <button
                        type="button"
                        onClick={() => {
                            showInfo("Chuyển đến trang đăng nhập");
                            navigate("/login");
                        }}
                        className="text-purple-600 hover:text-purple-700 font-medium"
                    >
                        Đăng nhập ngay
                    </button>
                </p>
            </div>
        </div >
    );
};

export default RegisterPage;