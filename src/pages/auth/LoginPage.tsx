import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/auth.store";
import useNotification from "../../hooks/useNotification";
import { Headphones, User, Lock, Loader2 } from "lucide-react";

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
        <div className="min-h-screen relative flex items-center justify-center overflow-hidden">
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
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-linear-to-br from-spotify-blue/30 to-cyan-500/20 border border-white/10 rounded-2xl mb-5 shadow-lg shadow-spotify-blue/10">
                            <Headphones className="w-8 h-8 text-spotify-blue" strokeWidth={1.5} />
                        </div>
                        <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">
                            Đăng nhập
                        </h1>
                        <p className="text-zinc-400 text-sm">Chào mừng bạn quay trở lại!</p>
                    </div>

                    {/* Error */}
                    {error && (
                        <div className="mb-5 p-3.5 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl text-sm flex items-center gap-2">
                            <div className="w-1 h-8 bg-red-500 rounded-full shrink-0" />
                            {error}
                        </div>
                    )}

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label
                                htmlFor="username"
                                className="block text-sm font-medium text-zinc-300 mb-2"
                            >
                                Tên đăng nhập
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                                    <User className="h-[18px] w-[18px] text-zinc-500" />
                                </div>
                                <input
                                    id="username"
                                    type="text"
                                    required
                                    value={formData.username}
                                    onChange={(e) =>
                                        setFormData({ ...formData, username: e.target.value })
                                    }
                                    className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/8 text-white placeholder-zinc-500 rounded-xl focus:ring-2 focus:ring-spotify-blue/40 focus:border-spotify-blue/40 focus:bg-white/8 transition-all duration-200 outline-none"
                                    placeholder="Nhập tên đăng nhập"
                                />
                            </div>
                        </div>

                        <div>
                            <label
                                htmlFor="password"
                                className="block text-sm font-medium text-zinc-300 mb-2"
                            >
                                Mật khẩu
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                                    <Lock className="h-[18px] w-[18px] text-zinc-500" />
                                </div>
                                <input
                                    id="password"
                                    type="password"
                                    required
                                    value={formData.password}
                                    onChange={(e) =>
                                        setFormData({ ...formData, password: e.target.value })
                                    }
                                    className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/8 text-white placeholder-zinc-500 rounded-xl focus:ring-2 focus:ring-spotify-blue/40 focus:border-spotify-blue/40 focus:bg-white/8 transition-all duration-200 outline-none"
                                    placeholder="Nhập mật khẩu"
                                />
                            </div>
                        </div>

                        <div className="flex items-center justify-between">
                            <label className="flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    className="w-4 h-4 bg-white/5 border-white/20 rounded text-spotify-blue focus:ring-spotify-blue/40 focus:ring-offset-0"
                                />
                                <span className="ml-2 text-sm text-zinc-400">
                                    Ghi nhớ đăng nhập
                                </span>
                            </label>

                            <a
                                href="/forgot-password"
                                className="text-sm text-spotify-blue hover:text-cyan-400 font-medium transition-colors"
                            >
                                Quên mật khẩu?
                            </a>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-linear-to-r from-spotify-blue to-cyan-600 hover:from-spotify-blue/90 hover:to-cyan-600/90 text-white py-3 rounded-xl font-semibold focus:outline-none focus:ring-2 focus:ring-spotify-blue/50 focus:ring-offset-2 focus:ring-offset-zinc-900 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.01] active:scale-[0.99] shadow-lg shadow-spotify-blue/20"
                        >
                            {loading ? (
                                <span className="inline-flex items-center gap-2">
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                    Đang đăng nhập...
                                </span>
                            ) : "Đăng nhập"}
                        </button>
                    </form>

                    {/* Footer */}
                    <p className="mt-6 text-center text-sm text-zinc-500">
                        Chưa có tài khoản?{" "}
                        <a
                            href="/register"
                            className="text-spotify-blue hover:text-cyan-400 font-medium transition-colors"
                        >
                            Đăng ký ngay
                        </a>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
