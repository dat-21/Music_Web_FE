// src/pages/errors/ForbiddenPage.tsx
import { useNavigate } from "react-router-dom";

export default function ForbiddenPage() {
    const navigate = useNavigate();
    return (
        <div className="flex flex-col items-center justify-center min-h-screen gap-4">
            <h1 className="text-4xl font-medium text-(--color-text-primary)">403</h1>
            <p className="text-(--color-text-secondary)">
                Bạn không có quyền truy cập trang này.
            </p>
            <button
                onClick={() => navigate("/")}
                className="px-4 py-2 rounded-lg bg-(--color-accent-neon) text-black text-sm"
            >
                Về trang chủ
            </button>
        </div>
    );
}