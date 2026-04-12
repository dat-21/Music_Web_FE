// src/components/common/ErrorBoundary.tsx
import type { ErrorBoundaryProps, ErrorBoundaryState } from '@/types/ErrorBoundary.types';
import { Component } from 'react';



export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
    state: ErrorBoundaryState = { hasError: false, error: null };

    static getDerivedStateFromError(error: Error): ErrorBoundaryState {
        // Gọi khi có lỗi — cập nhật state để render fallback
        return { hasError: true, error };
    }

    componentDidCatch(error: Error) {
        // Gọi sau khi render fallback — dùng để log lỗi
        this.props.onError?.(error);
        console.error('[ErrorBoundary]', error);
    }

    reset = () => {
        this.setState({ hasError: false, error: null });
    };

    render() {
        if (this.state.hasError) {
            if (this.props.fallback) return this.props.fallback;

            return (
                <div className="min-h-[280px] w-full flex items-center justify-center p-6">
                    <div className="w-full max-w-md rounded-xl border border-red-500/30 bg-red-500/10 p-5 text-center">
                        <p className="text-base font-semibold text-red-300">Đã có lỗi xảy ra.</p>
                        <p className="mt-2 text-sm text-zinc-300">
                            Bạn có thể thử tải lại khu vực này.
                        </p>
                        <button
                            onClick={this.reset}
                            className="mt-4 rounded-lg bg-white px-4 py-2 text-sm font-medium text-black transition-colors hover:bg-zinc-200"
                        >
                            Thử lại
                        </button>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}