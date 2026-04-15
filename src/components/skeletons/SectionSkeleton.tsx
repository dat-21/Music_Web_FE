import Skeleton from '../ui/skeleton/Skeleton';
import PlaylistCardSkeleton from './PlaylistCardSkeleton';

/** Skeleton for an entire horizontal scroll section (Jump Back In / Made For You) */
interface SectionSkeletonProps {
    showHeader?: boolean;
}

const SectionSkeleton = ({ showHeader = true }: SectionSkeletonProps) => {
    return (
        <div>
            {/* Section header */}
            {showHeader && (
                <div className="flex items-center justify-between mb-4">
                    <Skeleton className="h-7 w-40 rounded" />
                    <Skeleton className="h-5 w-16 rounded" />
                </div>
            )}
            {/* Cards row */}
            <div className="flex gap-4 overflow-hidden">
                {Array.from({ length: 5 }).map((_, i) => (
                    <div
                        key={i}
                        className="w-[180px] shrink-0"
                        style={{ animationDelay: `${i * 80}ms` }}
                    >
                        <PlaylistCardSkeleton />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default SectionSkeleton;
