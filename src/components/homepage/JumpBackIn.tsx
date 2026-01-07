import { CircleChevronLeft, CircleChevronRight } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import PlaylistCard from "../layouts/PlaylistCard";

const JumpBackIn = () => {
    const [showJumpBackLeft, setShowJumpBackLeft] = useState(false);
    const [showJumpBackRight, setShowJumpBackRight] = useState(true);
    // Dữ liệu mẫu cho Jump Back In section
    const jumpBackIn = [
        { id: 1, title: "Shouldn't Be", description: 'Luke Chiang', gradient: 'bg-gradient-to-br from-blue-500 to-purple-600' },
        { id: 2, title: 'Dreams From Bunker Hill', description: 'Cigarettes After Sex', gradient: 'bg-gradient-to-br from-pink-500 to-red-600' },
        { id: 3, title: 'PIXELATED KISSES', description: 'Joji', gradient: 'bg-gradient-to-br from-green-500 to-teal-600' },
        { id: 4, title: 'Love You Anyway', description: 'The Marias', gradient: 'bg-gradient-to-br from-orange-500 to-pink-600' },
        { id: 5, title: 'Hotel Ugly Mix', description: 'Playlist • Đạt', gradient: 'bg-gradient-to-br from-indigo-500 to-purple-600' }
    ];
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

    const jumpBackRef = useRef<HTMLDivElement>(null);

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
        const jumpBackElement = jumpBackRef.current;

        // Kiểm tra ban đầu
        checkScrollPosition(jumpBackRef, setShowJumpBackLeft, setShowJumpBackRight);

        // Lắng nghe sự kiện scroll
        const handleJumpBackScroll = () => checkScrollPosition(jumpBackRef, setShowJumpBackLeft, setShowJumpBackRight);

        jumpBackElement?.addEventListener('scroll', handleJumpBackScroll);

        return () => {
            jumpBackElement?.removeEventListener('scroll', handleJumpBackScroll);
        };
    }, [jumpBackIn]); // Re-check khi data thay đổi

    return (
        <div>
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-white text-2xl font-bold">Jump back in</h2>
                <button className="text-gray-400 hover:text-white text-sm font-semibold">
                    Show all
                </button>
            </div>
            <div className="relative group">
                {/* Nút trái */}
                {showJumpBackLeft && (<button
                    onClick={() => scroll(jumpBackRef, 'left', setShowJumpBackLeft, setShowJumpBackRight)}
                    className="absolute left-0 top-1/2 -translate-y-1/2 z-10
                                     bg-black/80 hover:bg-black text-white
                                     w-12 h-12 rounded-full flex items-center justify-center
                                     opacity-0 group-hover:opacity-100 transition-opacity shadow-xl"
                >
                    <CircleChevronLeft size={24} />
                </button>
                )}

                {/* Nút phải */}
                {showJumpBackRight && (<button
                    onClick={() => scroll(jumpBackRef, 'right', setShowJumpBackLeft, setShowJumpBackRight)}
                    className="absolute right-0 top-1/2 -translate-y-1/2 z-10
                                     bg-black/80 hover:bg-black text-white
                                     w-12 h-12 rounded-full flex items-center justify-center
                                     opacity-0 group-hover:opacity-100 transition-opacity shadow-xl"
                >
                    <CircleChevronRight size={24} />
                </button>)}

                <div
                    ref={jumpBackRef}
                    className="flex gap-4 overflow-x-scroll scroll-smooth no-scrollbar"
                >
                    {jumpBackIn.map((item) => (
                        <div key={item.id} className="w-[180px] flex-shrink-0">
                            <PlaylistCard
                                title={item.title}
                                description={item.description}
                                gradient={item.gradient}
                            />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default JumpBackIn;