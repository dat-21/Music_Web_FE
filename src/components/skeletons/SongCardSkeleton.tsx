import Skeleton from '../ui/skeleton/Skeleton';

/** Skeleton card matching the featured song row on the homepage top grid */
const SongCardSkeleton = () => {
    return (
        <div className="bg-zinc-800/40 rounded flex items-center gap-4 overflow-hidden animate-fade-in">
            {/* Cover placeholder */}
            <Skeleton className="w-20 h-20 shrink-0 rounded-none" />
            {/* Title placeholder */}
            <Skeleton className="h-4 w-24 rounded" />
        </div>
    );
};

export default SongCardSkeleton;
