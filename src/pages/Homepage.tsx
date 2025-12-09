import Player from '../components/homepage/Player';
import { useEffect, useState } from 'react';
import { getAllSongsApi } from '../api/song.api';
import type { Song } from '../types/song.types';




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
    // Mock data cho playlists
    // const featuredPlaylists = [
    //     { id: 1, title: 'V-Sound Ngay Lúc Này', description: '', gradient: 'bg-gradient-to-br from-purple-600 to-pink-600' },
    //     { id: 2, title: 'Legends Never Die', description: '', gradient: 'bg-gradient-to-br from-blue-600 to-cyan-600' },
    //     { id: 3, title: 'Ráp rừng', description: '', gradient: 'bg-gradient-to-br from-green-600 to-teal-600' },
    //     { id: 4, title: 'VSTRA', description: '', gradient: 'bg-gradient-to-br from-red-600 to-orange-600' },
    //     { id: 5, title: 'Hot Hits Vietnam', description: '', gradient: 'bg-gradient-to-br from-yellow-600 to-orange-600' },
    //     { id: 6, title: 'Tự Sự Radio', description: '', gradient: 'bg-gradient-to-br from-indigo-600 to-purple-600' },
    //     { id: 7, title: 'Đời Liêu Quý', description: '', gradient: 'bg-gradient-to-br from-pink-600 to-red-600' },
    //     { id: 8, title: 'V', description: '', gradient: 'bg-gradient-to-br from-blue-500 to-pink-500' },
    // ];

    // const dailyMixes = [
    //     { id: 1, title: 'DISCOVER WEEKLY', description: 'Your shortcut to hidden gems, deep cuts, and...', badge: '' },
    //     { id: 2, title: 'Daily Mix 01', description: 'EM XINH "SAY HI", Shiki, RAP VIỆT and more', badge: '' },
    //     { id: 3, title: 'Daily Mix 02', description: 'Maroon 5, Bruno Mars, Lana Del Rey and more', badge: '02' },
    //     { id: 4, title: 'Daily Mix 03', description: 'RAP VIỆT, Wrendie, The Wind and more', badge: '03' },
    //     { id: 5, title: 'Daily Mix 04', description: 'Thịnh Suy, Vũ., PAR SG and more', badge: '04' },
    //     { id: 6, title: 'Daily Mix 05', description: 'Sơn Tùng M-TP, EM XINH "SAY HI", Noo Phước...', badge: '05' },
    //     { id: 7, title: 'Daily Mix 06', description: 'Coldplay, Jason Mraz, Harry Styles and more', badge: '06' },
    // ];

    // const jumpBackIn = [
    //     { id: 1, title: 'Anh Đã Không Biết Cách Yêu Em', description: 'Quang Đăng Trần', gradient: 'bg-gradient-to-br from-blue-400 to-blue-600' },
    //     { id: 2, title: 'Những ai người xưng quanh bạn đáng nghĩ...', description: '', gradient: 'bg-gradient-to-br from-orange-400 to-pink-600' },
    //     { id: 3, title: 'Đóa Hồng Nhạc Việt', description: 'Một nửa mềm mại của nhạc Việt. Ảnh bìa...', gradient: 'bg-gradient-to-br from-gray-800 to-black' },
    //     { id: 4, title: 'FRESH FINDS', description: 'Những 💎 từ những cái tên có thể bạn chưa biết...', badge: 'VIETNAM', gradient: 'bg-gradient-to-br from-pink-500 to-red-600' },
    //     { id: 5, title: 'Release Radar', description: 'Catch all the latest music from artists you follow...', gradient: 'bg-gradient-to-br from-gray-700 to-gray-900' },
    // ];
    console.log(songs);
    return (
        <>
            {/* Main Scrollable Content */}
            <div className="flex-1 overflow-y-auto pb-24 bg-gradient-to-b from-gray-800 via-gray-900 to-black">
                {/* Navigation Tabs Section with Gradient */}
                <div className="bg-gradient-to-b from-gray-700/60 via-gray-800/40 to-transparent pt-4">
                    <div className="px-6 pb-4">
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
                </div>

                {/* Featured Playlists Grid */}
                <div className="px-6 py-6">
                    <div className="grid grid-cols-4 gap-4">

                        {songs.map((song) => (
                            <div
                                key={song._id}
                                className="bg-gray-800/40 hover:bg-gray-800/60 rounded flex items-center gap-4 overflow-hidden group cursor-pointer transition-colors"
                            >
                                {song.coverUrl ? (
                                    <img
                                        src={song.coverUrl}
                                        alt={song.title}
                                        className="w-20 h-20 object-cover flex-shrink-0"
                                    />
                                ) : (
                                    <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center flex-shrink-0">
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


                {/* Made For Section */}
                {/* <div className="px-6 py-6">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-white text-2xl font-bold">Made For</h2>
                            <button className="text-gray-400 hover:text-white text-sm font-semibold">
                                Show all
                            </button>
                        </div>
                        <p className="text-white text-sm mb-1">Đạt</p>
                        <div className="grid grid-cols-7 gap-4">
                            {dailyMixes.map((mix) => (
                                <PlaylistCard
                                    key={mix.id}
                                    title={mix.title}
                                    description={mix.description}
                                    badge={mix.badge}
                                    gradient="bg-gradient-to-br from-pink-500 to-purple-600"
                                />
                            ))}
                        </div>
                    </div> */}

                {/* Jump Back In Section */}
                {/* <div className="px-6 py-6">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-white text-2xl font-bold">Jump back in</h2>
                            <button className="text-gray-400 hover:text-white text-sm font-semibold">
                                Show all
                            </button>
                        </div>
                        <div className="grid grid-cols-5 gap-4">
                            {jumpBackIn.map((item) => (
                                <PlaylistCard
                                    key={item.id}
                                    title={item.title}
                                    description={item.description}
                                    badge={item.badge}
                                    gradient={item.gradient}
                                />
                            ))}
                        </div>
                    </div> */}
            </div>

            {/* Player Bar */}
            <Player />
        </>
    );
};

export default Homepage;