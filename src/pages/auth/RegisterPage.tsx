import { useState } from "react";
import useNotification from "../../hooks/useNotification";
import { useNavigate } from "react-router-dom";
import authService from "../../services/auth.service";
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
                    : (result as unknown as { message: string })?.message ?? "Đăng Kí Thành Công!"

            showSuccess(successMessage)
            setSuccess(true)
            setTimeout(() => {
                navigate("/login");
            }, 2000);
        } catch (error) {
            const errorMessage = (error as unknown as { message: string }).message || "Đăng Kí Không Thành Công!"
            showError(errorMessage)
            setSuccess(false);
        }
    };

    const hasError = Boolean(error);
    const baseInputClass = `w-full pl-10 pr-10 py-3.5 rounded-xl text-white placeholder-zinc-500 outline-none transition-all duration-200 bg-[#0a1020]/88 border ${
        hasError
            ? "border-red-400/60 focus:border-red-400/70 focus:ring-2 focus:ring-red-400/30"
            : "border-white/12 focus:border-cyan-400/65 focus:ring-2 focus:ring-cyan-400/35"
    }`;

    return (
        <div
            className="relative min-h-screen overflow-hidden"
            style={{
                background:
                    "radial-gradient(circle at 14% -14%, rgba(0,229,255,0.2) 0%, rgba(5,7,15,0) 40%), radial-gradient(circle at 84% -8%, rgba(179,136,255,0.24) 0%, rgba(5,7,15,0) 43%), linear-gradient(180deg, #03050d 0%, #070d1d 55%, #04060f 100%)",
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
                            className="absolute -left-24 top-20 h-80 w-80 rounded-full"
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
                            className="absolute left-1/2 top-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full border border-cyan-300/20"
                            style={{ animation: "auth-orbit 23s linear infinite" }}
                        />
                        <div
                            className="absolute left-1/2 top-1/2 h-44 w-44 -translate-x-1/2 -translate-y-1/2 rounded-full border border-violet-300/25"
                            style={{ animation: "auth-orbit 16s linear infinite reverse" }}
                        />
                        <div className="absolute inset-x-0 bottom-0 h-36 bg-linear-to-t from-[#04070f] to-transparent" />
                    </div>

                    <div className="relative flex h-full flex-col justify-between p-10">
                        <div>
                            <p className="text-xs uppercase tracking-[0.2em] text-cyan-200/70">Melody Account</p>
                            <h2 className="mt-3 text-4xl font-black leading-tight text-white">
                                Build your
                                <br />
                                listening cosmos.
                            </h2>
                        </div>
                        <p className="max-w-sm text-sm text-zinc-400">
                            Join millions of listeners and unlock your personalized universe across every screen.
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
                            <div className="mb-6 text-center">
                                <div
                                    className="mb-5 inline-flex h-16 w-16 items-center justify-center rounded-2xl border"
                                    style={{
                                        background:
                                            "linear-gradient(135deg, rgba(0,229,255,0.28) 0%, rgba(179,136,255,0.22) 100%)",
                                        borderColor: "rgba(255,255,255,0.14)",
                                        boxShadow: "0 10px 26px rgba(0,229,255,0.2)",
                                    }}
                                >
                                    <UserPlus className="h-8 w-8 text-cyan-200" strokeWidth={1.5} />
                                </div>
                                <h1 className="mb-2 text-3xl font-bold tracking-tight text-white">Đăng ký tài khoản</h1>
                                <p className="text-sm text-zinc-400">Tạo tài khoản mới để bắt đầu!</p>
                            </div>

                            {success && (
                                <div className="mb-5 animate-pulse rounded-xl border border-green-400/35 bg-green-500/12 p-3.5 text-green-300">
                                    <div className="flex items-center gap-2">
                                        <CheckCircle className="h-5 w-5 shrink-0" />
                                        <span className="text-sm">Đăng ký thành công! Đang chuyển đến trang đăng nhập...</span>
                                    </div>
                                </div>
                            )}

                            {error && (
                                <div className="mb-5 rounded-xl border border-red-400/40 bg-red-500/12 p-3.5 text-red-300">
                                    <div className="flex items-center gap-2">
                                        <XCircle className="h-5 w-5 shrink-0" />
                                        <span className="text-sm">{error}</span>
                                    </div>
                                </div>
                            )}

                            <div className="space-y-4">
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
                                            value={formData.username}
                                            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                                            className={`${baseInputClass} pr-4 disabled:opacity-50`}
                                            placeholder="Nhập tên đăng nhập"
                                            disabled={success}
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label htmlFor="email" className="mb-2 block text-sm font-medium text-zinc-300">
                                        Email
                                    </label>
                                    <div className="relative">
                                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
                                            <Mail className="h-[18px] w-[18px] text-zinc-500" />
                                        </div>
                                        <input
                                            id="email"
                                            type="email"
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                            className={`${baseInputClass} pr-4 disabled:opacity-50`}
                                            placeholder="Nhập email của bạn"
                                            disabled={success}
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
                                            type={showPassword ? "text" : "password"}
                                            value={formData.password}
                                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                            className={`${baseInputClass} disabled:opacity-50`}
                                            placeholder="Nhập mật khẩu (tối thiểu 6 ký tự)"
                                            disabled={success}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-zinc-500 transition-colors hover:text-zinc-300"
                                            tabIndex={-1}
                                        >
                                            {showPassword ? <IoEyeOffSharp className="h-5 w-5" /> : <IoEyeSharp className="h-5 w-5" />}
                                        </button>
                                    </div>
                                </div>

                                <div>
                                    <label htmlFor="confirmPassword" className="mb-2 block text-sm font-medium text-zinc-300">
                                        Xác nhận mật khẩu
                                    </label>
                                    <div className="relative">
                                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
                                            <ShieldCheck className="h-[18px] w-[18px] text-zinc-500" />
                                        </div>
                                        <input
                                            id="confirmPassword"
                                            type={showPassword1 ? "text" : "password"}
                                            value={formData.confirmPassword}
                                            onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                                            className={`${baseInputClass} disabled:opacity-50`}
                                            placeholder="Nhập lại mật khẩu"
                                            disabled={success}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword1(!showPassword1)}
                                            className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-zinc-500 transition-colors hover:text-zinc-300"
                                            tabIndex={-1}
                                        >
                                            {showPassword1 ? <IoEyeOffSharp className="h-5 w-5" /> : <IoEyeSharp className="h-5 w-5" />}
                                        </button>
                                    </div>
                                </div>

                                <div className="flex items-start">
                                    <input
                                        type="checkbox"
                                        id="terms"
                                        className="mt-0.5 h-4 w-4 rounded border-white/20 bg-white/5 text-cyan-400 focus:ring-cyan-400/40 focus:ring-offset-0"
                                    />
                                    <label htmlFor="terms" className="ml-2 text-sm text-zinc-400">
                                        Tôi đồng ý với{" "}
                                        <button
                                            type="button"
                                            onClick={() => showInfo("Điều khoản dịch vụ")}
                                            className="font-medium text-cyan-300 transition-colors hover:text-cyan-200"
                                        >
                                            Điều khoản dịch vụ
                                        </button>
                                        {" "}và{" "}
                                        <button
                                            type="button"
                                            onClick={() => showInfo("Chính sách bảo mật")}
                                            className="font-medium text-cyan-300 transition-colors hover:text-cyan-200"
                                        >
                                            Chính sách bảo mật
                                        </button>
                                    </label>
                                </div>

                                <button
                                    type="button"
                                    onClick={handleSubmit}
                                    disabled={success}
                                    className="w-full rounded-xl py-3 font-semibold text-[#04111b] transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-50"
                                    style={{
                                        background: "var(--gradient-accent-neon)",
                                        boxShadow: "0 12px 26px rgba(0,229,255,0.25)",
                                    }}
                                >
                                    {success ? (
                                        <span className="inline-flex items-center gap-2">
                                            <CheckCircle className="h-5 w-5" />
                                            Đăng ký thành công!
                                        </span>
                                    ) : (
                                        "Đăng ký"
                                    )}
                                </button>
                            </div>

                            <div className="relative my-6">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-white/10" />
                                </div>
                                <div className="relative flex justify-center text-sm">
                                    <span className="px-3 text-zinc-500" style={{ background: "rgba(8,12,24,0.7)" }}>
                                        Hoặc đăng ký với
                                    </span>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <button
                                    type="button"
                                    onClick={() => showInfo("Đăng ký Google")}
                                    className="flex items-center justify-center rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 transition-all duration-200 hover:bg-white/10"
                                >
                                    <svg className="mr-2 h-5 w-5" viewBox="0 0 24 24">
                                        <path fill="var(--color-brand-google-blue)" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                        <path fill="var(--color-brand-google-green)" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                        <path fill="var(--color-brand-google-yellow)" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                        <path fill="var(--color-brand-google-red)" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                                    </svg>
                                    <span className="text-sm font-medium text-zinc-300">Google</span>
                                </button>

                                <button
                                    type="button"
                                    onClick={() => showInfo("Đăng ký Facebook")}
                                    className="flex items-center justify-center rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 transition-all duration-200 hover:bg-white/10"
                                >
                                    <svg className="mr-2 h-5 w-5" fill="var(--color-brand-facebook-blue)" viewBox="0 0 24 24">
                                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                                    </svg>
                                    <span className="text-sm font-medium text-zinc-300">Facebook</span>
                                </button>
                            </div>

                            <p className="mt-6 text-center text-sm text-zinc-500">
                                Đã có tài khoản?{" "}
                                <button
                                    type="button"
                                    onClick={() => {
                                        showInfo("Chuyển đến trang đăng nhập");
                                        navigate("/login");
                                    }}
                                    className="font-medium text-cyan-300 transition-colors hover:text-cyan-200"
                                >
                                    Đăng nhập ngay
                                </button>
                            </p>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default RegisterPage;
