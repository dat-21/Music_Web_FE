import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllSongsApi } from '../api/song.api';
import type { Song } from '../types';
import MadeForUser from '../components/homepage/MadeForUser';
import JumpBackIn from '../components/homepage/JumpBackIn';
import { usePlayerStore } from '../store';
import { PlayIcon, PauseIcon } from '@heroicons/react/24/solid';
import { Button } from '../components/ui/button';




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

    // Tính toán số hàng dựa trên số lượng songs (4 cột trên lg, 2 cột trên mobile)
    const songsToShow = songs.slice(0, 8); // Giới hạn 8 songs cho phần featured
    // const rowCount = Math.ceil(songsToShow.length / 4); // Số hàng trên desktop

    // // Gradient height động: mỗi hàng ~88px (card 80px + gap), thêm padding
    // const getGradientHeight = () => {
    //     if (songsToShow.length === 0) return 'auto';
    //     if (songsToShow.length <= 4) return 'auto'; // 1 hàng
    //     return 'auto'; // 2 hàng
    // };

    return (
        <>
            {/* Main Scrollable Content */}
            <div className="flex-1 overflow-y-auto bg-zinc-950 no-scrollbar">
                {/* Navigation Tabs Section with Gradient - Spotify style */}
                <div
                    className={`bg-gradient-to-b from-spotify-blue/50 via-spotify-blue/20 to-zinc-950 pt-4 ${songsToShow.length <= 4 ? 'pb-4 via-60%' : 'pb-6 via-50%'
                        }`}
                >
                    <div className="px-4 md:px-6 pb-2">
                        <div className="flex gap-2">
                            <Button variant="pillActive" size="pill">
                                All
                            </Button>
                            <Button variant="pill" size="pill">
                                Music
                            </Button>
                            <Button variant="pill" size="pill">
                                Podcasts
                            </Button>
                        </div>
                    </div>

                    {/* Featured Playlists Grid */}
                    <div className="px-4 md:px-6 pt-3">
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 md:gap-3">

                            {songsToShow.map((song) => {
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
                                                <div className="w-20  h-20 bg-gradient-to-br from-blue-500 to-black-500 flex items-center justify-center">
                                                    <svg className="w-10 h-10 text-white/80" fill="currentColor" viewBox="0 0 20 20">
                                                        <path d="M18 3a1 1 0 00-1.196-.98l-10 2A1 1 0 006 5v9.114A4.369 4.369 0 005 14c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V7.82l8-1.6v5.894A4.37 4.37 0 0015 12c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V3z" />
                                                    </svg>
                                                </div>
                                            )}

                                            {/* Play/Pause Button Overlay */}
                                            <Button
                                                variant="iconOverlay"
                                                size="icon"
                                                onClick={(e) => handlePlayPause(e, song)}
                                                className="w-full h-full"
                                            >
                                                {isSongPlaying ? (
                                                    <PauseIcon className="w-8 h-8 text-white drop-shadow-lg" />
                                                ) : (
                                                    <PlayIcon className="w-8 h-8 text-white drop-shadow-lg" />
                                                )}
                                            </Button>
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