import Skeleton from '../ui/skeleton/Skeleton';

/** Skeleton card matching normalized 160x160 song card on Homepage */
const SongCardSkeleton = () => {
    return (
        <div className="glass-card p-3 animate-fade-in">
            <Skeleton className="w-40 h-40 mx-auto rounded-xl" />
            <div className="mt-3 space-y-2">
                <Skeleton className="h-4 w-full rounded" />
                <Skeleton className="h-4 w-[75%] rounded" />
                <Skeleton className="h-3 w-[55%] rounded" />
            </div>
        </div>
    );
};

export default SongCardSkeleton;
