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

    const hasError = Boolean(error);
    const inputClass = `w-full pl-10 pr-4 py-3.5 rounded-xl text-white placeholder-zinc-500 outline-none transition-all duration-200 bg-[#0a1020]/88 border ${
        hasError
            ? "border-red-400/60 focus:border-red-400/70 focus:ring-2 focus:ring-red-400/30"
            : "border-white/12 focus:border-cyan-400/65 focus:ring-2 focus:ring-cyan-400/35"
    }`;

    return (
        <div
            className="relative min-h-screen overflow-hidden"
            style={{
                background:
                    "radial-gradient(circle at 15% -12%, rgba(0,229,255,0.2) 0%, rgba(5,7,15,0) 40%), radial-gradient(circle at 85% -8%, rgba(179,136,255,0.24) 0%, rgba(5,7,15,0) 42%), linear-gradient(180deg, #03050d 0%, #070d1d 55%, #04060f 100%)",
            }}
        >
            <style>
                {`
                    @keyframes auth-orbit {
                        from { transform: rotate(0deg); }
                        to { transform: rotate(360deg); }
                    }

                    @keyframes auth-float {
                        0% { transform: translateY(0px) translateX(0px); }
                        50% { transform: translateY(-12px) translateX(7px); }
                        100% { transform: translateY(0px) translateX(0px); }
                    }

                    @keyframes auth-grid {
                        from { background-position: 0 0, 0 0; }
                        to { background-position: 110px 110px, 0 0; }
                    }
                `}
            </style>

            <div className="pointer-events-none absolute inset-0">
                <div
                    className="absolute inset-0"
                    style={{
                        backgroundImage:
                            "linear-gradient(rgba(0,229,255,0.055) 1px, transparent 1px), linear-gradient(90deg, rgba(0,229,255,0.045) 1px, transparent 1px)",
                        backgroundSize: "74px 74px",
                        animation: "auth-grid 24s linear infinite",
                        opacity: 0.46,
                    }}
                />
            </div>

            <div className="relative z-10 grid min-h-screen lg:grid-cols-[1.05fr_0.95fr]">
                <aside className="relative hidden overflow-hidden border-r border-white/10 lg:block">
                    <div className="pointer-events-none absolute inset-0">
                        <div
                            className="absolute -left-20 top-16 h-72 w-72 rounded-full"
                            style={{
                                background: "radial-gradient(circle, rgba(0,229,255,0.22) 0%, rgba(0,229,255,0) 72%)",
                                animation: "auth-float 9s ease-in-out infinite",
                            }}
                        />
                        <div
                            className="absolute -right-22 top-56 h-80 w-80 rounded-full"
                            style={{
                                background: "radial-gradient(circle, rgba(179,136,255,0.24) 0%, rgba(179,136,255,0) 74%)",
                                animation: "auth-float 11s ease-in-out infinite reverse",
                            }}
                        />
                        <div
                            className="absolute left-1/2 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full border border-cyan-300/20"
                            style={{ animation: "auth-orbit 24s linear infinite" }}
                        />
                        <div
                            className="absolute left-1/2 top-1/2 h-40 w-40 -translate-x-1/2 -translate-y-1/2 rounded-full border border-violet-300/25"
                            style={{ animation: "auth-orbit 16s linear infinite reverse" }}
                        />
                        <div className="absolute inset-x-0 bottom-0 h-36 bg-linear-to-t from-[#04070f] to-transparent" />
                    </div>

                    <div className="relative flex h-full flex-col justify-between p-10">
                        <div>
                            <p className="text-xs uppercase tracking-[0.2em] text-cyan-200/70">Melody Auth</p>
                            <h2 className="mt-3 text-4xl font-black leading-tight text-white">
                                Enter the neon
                                <br />
                                music universe.
                            </h2>
                        </div>
                        <p className="max-w-sm text-sm text-zinc-400">
                            Your playlists, recommendations, and listening flow stay perfectly synced across every device.
                        </p>
                    </div>
                </aside>

                <section className="flex items-center justify-center px-4 py-8 sm:px-8 lg:px-10">
                    <div className="w-full max-w-md">
                        <div
                            className="rounded-2xl border p-8 shadow-2xl"
                            style={{
                                background: "rgba(8,12,24,0.7)",
                                borderColor: "rgba(0,229,255,0.22)",
                                backdropFilter: "blur(22px)",
                                WebkitBackdropFilter: "blur(22px)",
                                boxShadow: "0 22px 48px rgba(0,0,0,0.55), inset 0 0 0 1px rgba(255,255,255,0.04)",
                            }}
                        >
                            <div className="mb-8 text-center">
                                <div
                                    className="mb-5 inline-flex h-16 w-16 items-center justify-center rounded-2xl border"
                                    style={{
                                        background:
                                            "linear-gradient(135deg, rgba(0,229,255,0.28) 0%, rgba(179,136,255,0.22) 100%)",
                                        borderColor: "rgba(255,255,255,0.14)",
                                        boxShadow: "0 10px 26px rgba(0,229,255,0.2)",
                                    }}
                                >
                                    <Headphones className="h-8 w-8 text-cyan-200" strokeWidth={1.5} />
                                </div>
                                <h1 className="mb-2 text-3xl font-bold tracking-tight text-white">Đăng nhập</h1>
                                <p className="text-sm text-zinc-400">Chào mừng bạn quay trở lại!</p>
                            </div>

                            {error && (
                                <div className="mb-5 flex items-center gap-2 rounded-xl border border-red-400/40 bg-red-500/12 p-3.5 text-sm text-red-300">
                                    <div className="h-8 w-1 shrink-0 rounded-full bg-red-400" />
                                    {error}
                                </div>
                            )}

                            <form onSubmit={handleSubmit} className="space-y-5">
                                <div>
                                    <label htmlFor="username" className="mb-2 block text-sm font-medium text-zinc-300">
                                        Tên đăng nhập
                                    </label>
                                    <div className="relative">
                                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
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
                                            className={inputClass}
                                            placeholder="Nhập tên đăng nhập"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label htmlFor="password" className="mb-2 block text-sm font-medium text-zinc-300">
                                        Mật khẩu
                                    </label>
                                    <div className="relative">
                                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
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
                                            className={inputClass}
                                            placeholder="Nhập mật khẩu"
                                        />
                                    </div>
                                </div>

                                <div className="flex items-center justify-between">
                                    <label className="flex cursor-pointer items-center">
                                        <input
                                            type="checkbox"
                                            className="h-4 w-4 rounded border-white/20 bg-white/5 text-cyan-400 focus:ring-cyan-400/40 focus:ring-offset-0"
                                        />
                                        <span className="ml-2 text-sm text-zinc-400">Ghi nhớ đăng nhập</span>
                                    </label>

                                    <a href="/forgot-password" className="text-sm font-medium text-cyan-300 transition-colors hover:text-cyan-200">
                                        Quên mật khẩu?
                                    </a>
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full rounded-xl py-3 font-semibold text-[#04111b] transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-50"
                                    style={{
                                        background: "var(--gradient-accent-neon)",
                                        boxShadow: "0 12px 26px rgba(0,229,255,0.25)",
                                    }}
                                >
                                    {loading ? (
                                        <span className="inline-flex items-center gap-2">
                                            <Loader2 className="h-4 w-4 animate-spin" />
                                            Đang đăng nhập...
                                        </span>
                                    ) : (
                                        "Đăng nhập"
                                    )}
                                </button>
                            </form>

                            <p className="mt-6 text-center text-sm text-zinc-500">
                                Chưa có tài khoản?{" "}
                                <a href="/register" className="font-medium text-cyan-300 transition-colors hover:text-cyan-200">
                                    Đăng ký ngay
                                </a>
                            </p>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default LoginPage;
