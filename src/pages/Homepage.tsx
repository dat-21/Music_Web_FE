// import Player from '../components/homepage/Player';
import { useEffect, useState } from 'react';
import { getAllSongsApi } from '../api/song.api';
import type { Song } from '../types/song.types';
import PlaylistCard from '../components/homepage/PlaylistCard';
import { CircleChevronLeft, CircleChevronRight } from 'lucide-react';
import { useRef } from 'react';




const Homepage = () => {
    const [songs, setSongs] = useState<Song[]>([]);

    useEffect(() => {
        fetchSongs();
    }, []);

    const fetchSongs = async () => {
        try {
            const res = await getAllSongsApi();
            setSongs(res.data.songs || []); // tuỳ backend trả về
        } catch (error) {
            console.error("Lỗi khi fetch danh sách bài hát", error);
        }
    };

    // Dữ liệu mẫu cho Made For section
    const dailyMixes = [
        { id: 1, title: 'Daily Mix 1', description: 'The Marias, Joji, Cigarettes After Sex and more', badge: 'MIXED FOR YOU' },
        { id: 2, title: 'Daily Mix 2', description: 'Luke Chiang, Hotel Ugly, sagun and more', badge: 'MIXED FOR YOU' },
        { id: 3, title: 'Daily Mix 3', description: 'Olivia Dean, HY₿S, Paul Fontohop and more', badge: 'MIXED FOR YOU' },
        { id: 4, title: 'Daily Mix 4', description: 'Indie, Alternative, Chill and more', badge: 'MIXED FOR YOU' },
        { id: 5, title: 'Daily Mix 5', description: 'Lo-fi, Beats, Study music and more', badge: 'MIXED FOR YOU' },
        { id: 6, title: 'Daily Mix 6', description: 'Pop, Dance, Electronic and more', badge: 'MIXED FOR YOU' },
        { id: 7, title: 'Discover Weekly', description: 'Your weekly mixtape of fresh music', badge: 'FOR YOU' }
    ];

    // Dữ liệu mẫu cho Jump Back In section
    const jumpBackIn = [
        { id: 1, title: "Shouldn't Be", description: 'Luke Chiang', gradient: 'bg-gradient-to-br from-blue-500 to-purple-600' },
        { id: 2, title: 'Dreams From Bunker Hill', description: 'Cigarettes After Sex', gradient: 'bg-gradient-to-br from-pink-500 to-red-600' },
        { id: 3, title: 'PIXELATED KISSES', description: 'Joji', gradient: 'bg-gradient-to-br from-green-500 to-teal-600' },
        { id: 4, title: 'Love You Anyway', description: 'The Marias', gradient: 'bg-gradient-to-br from-orange-500 to-pink-600' },
        { id: 5, title: 'Hotel Ugly Mix', description: 'Playlist • Đạt', gradient: 'bg-gradient-to-br from-indigo-500 to-purple-600' }
    ];
    const madeForRef = useRef<HTMLDivElement>(null);
    const jumpBackRef = useRef<HTMLDivElement>(null);

    const scroll = (ref: React.RefObject<HTMLDivElement | null>, dir: 'left' | 'right') => {
        if (!ref.current) return;

        ref.current.scrollBy({
            left: dir === 'left' ? -600 : 600,
            behavior: 'smooth',
        });
    };


    console.log(songs);
    return (
        <>
            {/* Main Scrollable Content */}
            <div className="flex-1 overflow-y-auto bg-zinc-950 no-scrollbar">
                {/* Navigation Tabs Section with Gradient */}
                <div className="bg-gradient-to-b from-blue-400 via-blue-600/50 to-transparent pt-4 pb-8">
                    <div className="px-6 pb-2">
                        <div className="flex gap-3">
                            <button className="px-4 py-2 bg-white text-black rounded-full font-semibold text-sm hover:scale-105 transition-transform">
                                All
                            </button>
                            <button className="px-4 py-2 bg-gray-800 text-white rounded-full font-semibold text-sm hover:bg-gray-700 transition-colors">
                                Music
                            </button>
                            <button className="px-4 py-2 bg-gray-800 text-white rounded-full font-semibold text-sm hover:bg-gray-700 transition-colors">
                                Podcasts
                            </button>
                        </div>
                    </div>

                    {/* Featured Playlists Grid */}
                    <div className="px-6 pt-4">
                        <div className="grid grid-cols-4 gap-4 ">

                            {songs.map((song) => (
                                <div
                                    key={song._id}
                                    className="bg-gray-800/40 hover:bg-gray-800/60 rounded flex  items-center gap-4 overflow-hidden group cursor-pointer transition-colors"
                                >
                                    {song.coverUrl ? (
                                        <img
                                            src={song.coverUrl}
                                            alt={song.title}
                                            className="w-20 h-20 object-cover flex-shrink-0"
                                        />
                                    ) : (
                                        <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-black-500 flex items-center justify-center flex-shrink-0">
                                            <svg className="w-10 h-10 text-white/80" fill="currentColor" viewBox="0 0 20 20">
                                                <path d="M18 3a1 1 0 00-1.196-.98l-10 2A1 1 0 006 5v9.114A4.369 4.369 0 005 14c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V7.82l8-1.6v5.894A4.37 4.37 0 0015 12c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V3z" />
                                            </svg>
                                        </div>
                                    )}

                                    <p className="text-white font-semibold text-sm truncate pr-4">
                                        {song.title}
                                    </p>
                                </div>
                            ))}

                        </div>

                    </div>
                </div>


                {/* Made For Section */}
                <div className="px-6 py-6">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-white text-2xl font-bold">Made For You</h2>
                        <button className="text-gray-400 hover:text-white text-sm font-semibold">
                            Show all
                        </button>
                    </div>
                    <p className="text-white text-sm mb-4">Đạt</p>
                    <div className="relative group">
                        {/* Nút trái */}
                        <button
                            onClick={() => scroll(madeForRef, 'left')}
                            className="absolute left-0 top-1/2 -translate-y-1/2 z-10
                                     bg-black/80 hover:bg-black text-white
                                     w-12 h-12 rounded-full flex items-center justify-center
                                     opacity-0 group-hover:opacity-100 transition-opacity shadow-xl"
                        >
                            <CircleChevronLeft size={24} />
                        </button>

                        {/* Nút phải */}
                        <button
                            onClick={() => scroll(madeForRef, 'right')}
                            className="absolute right-0 top-1/2 -translate-y-1/2 z-10
                                     bg-black/80 hover:bg-black text-white
                                     w-12 h-12 rounded-full flex items-center justify-center
                                     opacity-0 group-hover:opacity-100 transition-opacity shadow-xl"
                        >
                            <CircleChevronRight size={24} />
                        </button>

                        <div
                            ref={madeForRef}
                            className="flex gap-4 overflow-x-scroll scroll-smooth no-scrollbar"
                        >
                            {dailyMixes.map((mix) => (
                                <div key={mix.id} className="w-[180px] flex-shrink-0">
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

                {/* Jump Back In Section */}
                <div className="px-6 py-6">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-white text-2xl font-bold">Jump back in</h2>
                        <button className="text-gray-400 hover:text-white text-sm font-semibold">
                            Show all
                        </button>
                    </div>
                    <div className="relative group">
                        {/* Nút trái */}
                        <button
                            onClick={() => scroll(jumpBackRef, 'left')}
                            className="absolute left-0 top-1/2 -translate-y-1/2 z-10
                                     bg-black/80 hover:bg-black text-white
                                     w-12 h-12 rounded-full flex items-center justify-center
                                     opacity-0 group-hover:opacity-100 transition-opacity shadow-xl"
                        >
                            <CircleChevronLeft size={24} />
                        </button>

                        {/* Nút phải */}
                        <button
                            onClick={() => scroll(jumpBackRef, 'right')}
                            className="absolute right-0 top-1/2 -translate-y-1/2 z-10
                                     bg-black/80 hover:bg-black text-white
                                     w-12 h-12 rounded-full flex items-center justify-center
                                     opacity-0 group-hover:opacity-100 transition-opacity shadow-xl"
                        >
                            <CircleChevronRight size={24} />
                        </button>

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

            </div>
        </>
    );
}
export default Homepage;