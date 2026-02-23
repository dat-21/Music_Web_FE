import { cn } from '../../../lib/utils';

interface SkeletonProps {
    className?: string;
}

/** Generic shimmer skeleton block – Spotify style */
const Skeleton = ({ className }: SkeletonProps) => {
    return (
        <div
            className={cn(
                'animate-shimmer rounded bg-zinc-800 bg-size-[200%_100%] bg-linear-to-r from-zinc-800 via-zinc-700 to-zinc-800',
                className
            )}
        />
    );
};

export default Skeleton;
