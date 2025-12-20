import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/auth.store";
import useNotification from "../../hooks/useNotification";
const LoginPage = () => {
    const navigate = useNavigate();
    const login = useAuthStore((state) => state.login);

    const { showSuccess, showError } = useNotification();

    const [formData, setFormData] = useState({
        username: "",
        password: "",
    });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            // Gọi login từ Zustand store
            await login(formData.username, formData.password);

            showSuccess(`Xin chào ${formData.username}!`);
            navigate("/");
        } catch (err: unknown) {
            if (err instanceof Error) {
                showError(err.message, 'Error while login!');
            } else {
                showError("Tên đăng nhập hoặc mật khẩu không chính xác!", "Lỗi đăng nhập!");
                setError("Tên đăng nhập hoặc mật khẩu không chính xác!")
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-blue-50 to-indigo-100">
            <div className="max-w-md w-full mx-4 bg-white rounded-2xl shadow-xl p-8">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                        Đăng nhập
                    </h1>
                    <p className="text-gray-600">Chào mừng bạn quay trở lại!</p>
                </div>

                {/* Error */}
                {error && (
                    <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
                        {error}
                    </div>
                )}

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label
                            htmlFor="username"
                            className="block text-sm font-medium text-gray-700 mb-2"
                        >
                            Tên đăng nhập
                        </label>
                        <input
                            id="username"
                            type="text"
                            required
                            value={formData.username}
                            onChange={(e) =>
                                setFormData({ ...formData, username: e.target.value })
                            }
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                        />
                    </div>

                    <div>
                        <label
                            htmlFor="password"
                            className="block text-sm font-medium text-gray-700 mb-2"
                        >
                            Mật khẩu
                        </label>
                        <input
                            id="password"
                            type="password"
                            required
                            value={formData.password}
                            onChange={(e) =>
                                setFormData({ ...formData, password: e.target.value })
                            }
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                        />
                    </div>

                    <div className="flex items-center justify-between">
                        <label className="flex items-center">
                            <input
                                type="checkbox"
                                className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                            />
                            <span className="ml-2 text-sm text-gray-600">
                                Ghi nhớ đăng nhập
                            </span>
                        </label>

                        <a
                            href="/forgot-password"
                            className="text-sm text-indigo-600 hover:text-indigo-700 font-medium"
                        >
                            Quên mật khẩu?
                        </a>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-indigo-600 text-white py-3 rounded-lg font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? "Đang đăng nhập..." : "Đăng nhập"}
                    </button>
                </form>

                {/* Footer */}
                <p className="mt-6 text-center text-sm text-gray-600">
                    Chưa có tài khoản?{" "}
                    <a
                        href="/register"
                        className="text-indigo-600 hover:text-indigo-700 font-medium"
                    >
                        Đăng ký ngay
                    </a>
                </p >
            </div >
        </div >
    );
};

export default LoginPage;