import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllSongsApi } from '../api/song.api';
import type { Song } from '../types';
import MadeForUser from '../components/homepage/MadeForUser';
import JumpBackIn from '../components/homepage/JumpBackIn';
import { usePlayerStore } from '../store';
import { PlayIcon, PauseIcon } from '@heroicons/react/24/solid';




const Homepage = () => {
    const [songs, setSongs] = useState<Song[]>([]);
    const navigate = useNavigate();

    // Subscribe chỉ những state cần thiết, không subscribe currentTime/volume/duration
    const currentSong = usePlayerStore((state) => state.currentSong);
    const isPlaying = usePlayerStore((state) => state.isPlaying);
    const setCurrentSong = usePlayerStore((state) => state.setCurrentSong);
    const togglePlay = usePlayerStore((state) => state.togglePlay);


    useEffect(() => {
        const fetchSongs = async () => {
            try {
                const res = await getAllSongsApi();
                setSongs(res.data.songs || []);
            } catch (error) {
                console.error("Lỗi khi fetch danh sách bài hát", error);
            }
        };

        fetchSongs();
    }, []);

    const handlePlayPause = useCallback((e: React.MouseEvent, song: Song) => {
        e.stopPropagation();

        if (currentSong?._id === song._id) {
            togglePlay();
        } else {
            setCurrentSong(song);
        }
    }, [currentSong, togglePlay, setCurrentSong]);

    const handleSongClick = useCallback((songId: string) => {
        navigate(`/song/${songId}`);
    }, [navigate]);

    // Xoá console.log này để tránh log mỗi lần re-render
    // console.log(songs);

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

                            {songs.map((song) => {
                                const isCurrentSong = currentSong?._id === song._id;
                                const isSongPlaying = isCurrentSong && isPlaying;

                                return (
                                    <div
                                        key={song._id}
                                        onClick={() => handleSongClick(song._id)}
                                        className="bg-gray-800/40 hover:bg-gray-800/60 rounded flex items-center gap-4 overflow-hidden group cursor-pointer transition-colors relative"
                                    >
                                        <div className="relative flex-shrink-0">
                                            {song.coverUrl ? (
                                                <img
                                                    src={song.coverUrl}
                                                    alt={song.title}
                                                    className="w-20 h-20 object-cover"
                                                />
                                            ) : (
                                                <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-black-500 flex items-center justify-center">
                                                    <svg className="w-10 h-10 text-white/80" fill="currentColor" viewBox="0 0 20 20">
                                                        <path d="M18 3a1 1 0 00-1.196-.98l-10 2A1 1 0 006 5v9.114A4.369 4.369 0 005 14c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V7.82l8-1.6v5.894A4.37 4.37 0 0015 12c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V3z" />
                                                    </svg>
                                                </div>
                                            )}

                                            {/* Play/Pause Button Overlay */}
                                            <button
                                                onClick={(e) => handlePlayPause(e, song)}
                                                className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                            >
                                                {isSongPlaying ? (
                                                    <PauseIcon className="w-8 h-8 text-white drop-shadow-lg" />
                                                ) : (
                                                    <PlayIcon className="w-8 h-8 text-white drop-shadow-lg" />
                                                )}
                                            </button>
                                        </div>

                                        <p className="text-white font-semibold text-sm truncate pr-4">
                                            {song.title}
                                        </p>

                                        {/* Playing indicator */}
                                        {isSongPlaying && (
                                            <div className="absolute right-2 top-1/2 -translate-y-1/2">
                                                <div className="flex gap-0.5 items-end h-4">
                                                    <div className="w-0.5 bg-green-500 animate-pulse" style={{ height: '60%' }}></div>
                                                    <div className="w-0.5 bg-green-500 animate-pulse" style={{ height: '100%', animationDelay: '0.2s' }}></div>
                                                    <div className="w-0.5 bg-green-500 animate-pulse" style={{ height: '80%', animationDelay: '0.4s' }}></div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}

                        </div>

                    </div>
                </div>


                {/* Made For Section */}
                <div className="px-6 py-6">
                    <MadeForUser />
                </div>

                {/* Jump Back In Section */}
                <div className="px-6 py-6">
                    <JumpBackIn />
                </div>

            </div>
        </>
    );
}
export default Homepage;