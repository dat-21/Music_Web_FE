// src/components/ui/page-loader.tsx
import { cn } from '@/lib/utils';
import { Spinner } from '../spinner/spinner';

interface PageLoaderProps {
    fullscreen?: boolean;
    message?: string;
    showBackdrop?: boolean;
    className?: string;
}

export function PageLoader({
    fullscreen = true,
    message = 'Đang tải dữ liệu...',
    showBackdrop = true,
    className,
}: PageLoaderProps) {
    return (
        <div
            className={cn(
                'flex items-center justify-center',
                fullscreen ? 'min-h-screen w-full' : 'h-full w-full min-h-[220px]',
                showBackdrop && 'bg-zinc-950/95',
                className
            )}
        >
            <div className="flex flex-col items-center gap-3 text-center">
                <div className="relative">
                    <div className="size-12 rounded-full border border-zinc-700/80" />
                    <Spinner className="absolute inset-0 m-auto size-6 text-spotify-blue" />
                </div>
                {message && (
                    <p className="text-sm text-zinc-300">{message}</p>
                )}
            </div>
        </div>
    );
}