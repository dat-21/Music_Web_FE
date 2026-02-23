import Skeleton from '../ui/skeleton/Skeleton';

/** Skeleton card matching PlaylistCard (square cover + title + description) */
const PlaylistCardSkeleton = () => {
    return (
        <div className="bg-zinc-800/40 rounded-lg p-4">
            {/* Cover image placeholder */}
            <Skeleton className="w-full aspect-square rounded-lg mb-4" />
            {/* Title */}
            <Skeleton className="h-4 w-3/4 rounded mb-2" />
            {/* Description */}
            <Skeleton className="h-3 w-full rounded mb-1" />
            <Skeleton className="h-3 w-2/3 rounded" />
        </div>
    );
};

export default PlaylistCardSkeleton;
