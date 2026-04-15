import { CircleChevronLeft, CircleChevronRight } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import PlaylistCard from "../layouts/PlaylistCard";
import { useAuthStore } from "../../store";
import { Button } from "../ui/button";

interface MadeForUserProps {
    showHeader?: boolean;
}

const MadeForUser = ({ showHeader = true }: MadeForUserProps) => {
    const madeForRef = useRef<HTMLDivElement>(null);
    const [showMadeForLeft, setShowMadeForLeft] = useState(false);
    const [showMadeForRight, setShowMadeForRight] = useState(true);
    const { user, isAuthenticated } = useAuthStore();

    const dailyMixes = [
        { id: 1, title: 'Daily Mix 1', description: 'The Marias, Joji, Cigarettes After Sex and more', badge: 'MIXED FOR YOU' },
        { id: 2, title: 'Daily Mix 2', description: 'Luke Chiang, Hotel Ugly, sagun and more', badge: 'MIXED FOR YOU' },
        { id: 3, title: 'Daily Mix 3', description: 'Olivia Dean, HY₿S, Paul Fontohop and more', badge: 'MIXED FOR YOU' },
        { id: 4, title: 'Daily Mix 4', description: 'Indie, Alternative, Chill and more', badge: 'MIXED FOR YOU' },
        { id: 5, title: 'Daily Mix 5', description: 'Lo-fi, Beats, Study music and more', badge: 'MIXED FOR YOU' },
        { id: 6, title: 'Daily Mix 6', description: 'Pop, Dance, Electronic and more', badge: 'MIXED FOR YOU' },
        { id: 7, title: 'Discover Weekly', description: 'Your weekly mixtape of fresh music', badge: 'FOR YOU' }
    ];

    const capitalizeFirstLetter = (text: string) =>
        text ? text.charAt(0).toUpperCase() + text.slice(1) : "";

    // Hàm kiểm tra vị trí scroll
    const checkScrollPosition = (
        ref: React.RefObject<HTMLDivElement | null>,
        setShowLeft: (show: boolean) => void,
        setShowRight: (show: boolean) => void
    ) => {
        if (!ref.current) return;

        const { scrollLeft, scrollWidth, clientWidth } = ref.current;

        // Hiện nút trái nếu không ở đầu
        setShowLeft(scrollLeft > 10);

        // Hiện nút phải nếu chưa scroll hết
        setShowRight(scrollLeft < scrollWidth - clientWidth - 10);
    };

    // Hàm scroll có cập nhật state
    const scroll = (
        ref: React.RefObject<HTMLDivElement | null>,
        dir: 'left' | 'right',
        setShowLeft: (show: boolean) => void,
        setShowRight: (show: boolean) => void
    ) => {
        if (!ref.current) return;

        ref.current.scrollBy({
            left: dir === 'left' ? -600 : 600,
            behavior: 'smooth',
        });

        // Đợi animation scroll xong rồi check lại
        setTimeout(() => checkScrollPosition(ref, setShowLeft, setShowRight), 300);
    };

    // useEffect để kiểm tra ban đầu và lắng nghe scroll
    useEffect(() => {
        const madeForElement = madeForRef.current;
        if (!madeForElement) return;

        // Lắng nghe sự kiện scroll
        const handleMadeForScroll = () => checkScrollPosition(madeForRef, setShowMadeForLeft, setShowMadeForRight);

        madeForElement.addEventListener('scroll', handleMadeForScroll);

        // Kiểm tra ban đầu sau khi mount
        setTimeout(() => checkScrollPosition(madeForRef, setShowMadeForLeft, setShowMadeForRight), 100);

        return () => {
            madeForElement.removeEventListener('scroll', handleMadeForScroll);
        };
    }, []); // Empty deps - chỉ chạy 1 lần khi mount

    return (
        <div>

            {showHeader && (
                <>
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-white text-2xl font-bold">Made For</h2>
                        <Button
                            variant="text"
                            size="text"
                        >
                            Show all
                        </Button>
                    </div>
                    <p className="text-white mt-4 mb-2">
                        {isAuthenticated ? capitalizeFirstLetter(user?.username || "") : "Guest"}
                    </p>
                </>
            )}

            <div className="relative group/scroll">
                {/* Nút trái - chỉ hiện khi showMadeForLeft = true */}
                {showMadeForLeft && (
                    <Button
                        variant="scrollNav"
                        onClick={() => scroll(madeForRef, 'left', setShowMadeForLeft, setShowMadeForRight)}
                        className="left-0 opacity-0 group-hover/scroll:opacity-100"
                    >
                        <CircleChevronLeft size={24} />
                    </Button>
                )}

                {/* Nút phải - chỉ hiện khi showMadeForRight = true */}
                {showMadeForRight && (
                    <Button
                        variant="scrollNav"
                        onClick={() => scroll(madeForRef, 'right', setShowMadeForLeft, setShowMadeForRight)}
                        className="right-0 opacity-0 group-hover/scroll:opacity-100"
                    >
                        <CircleChevronRight size={24} />
                    </Button>
                )}

                <div
                    ref={madeForRef}
                    className="flex gap-4 overflow-x-scroll scroll-smooth no-scrollbar"
                >
                    {dailyMixes.map((mix) => (
                        <div key={mix.id} className="w-[180px] shrink-0">
                            <PlaylistCard
                                title={mix.title}
                                description={mix.description}
                                badge={mix.badge}
                                gradient="bg-gradient-to-br from-blue-500 to-black-600"
                            />
                        </div>
                    ))}
                </div>
            </div>



        </div>
    )
}

export default MadeForUser;