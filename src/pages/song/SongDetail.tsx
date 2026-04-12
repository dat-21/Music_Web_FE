import { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getSongByIdApi } from '../../api/song.api';
import type { Song } from '../../types';
import { usePlayerStore } from '../../store';
import { PlayIcon, PauseIcon, ArrowLeftIcon, ClockIcon, MusicalNoteIcon } from '@heroicons/react/24/solid';
import { HeartIcon, ShareIcon, EllipsisHorizontalIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid';
import { PageLoader } from '@/components/ui/page-loader/page-loader';

const SongDetail = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [song, setSong] = useState<Song | null>(null);
    const [loading, setLoading] = useState(true);
    const [isLiked, setIsLiked] = useState(false);
    const [imageLoaded, setImageLoaded] = useState(false);

    const currentSong = usePlayerStore((state) => state.currentSong);
    const isPlaying = usePlayerStore((state) => state.isPlaying);
    const setCurrentSong = usePlayerStore((state) => state.setCurrentSong);
    const togglePlay = usePlayerStore((state) => state.togglePlay);

    useEffect(() => {
        if (!id) return;

        const fetchSongDetail = async () => {
            try {
                setLoading(true);
                setImageLoaded(false);
                const res = await getSongByIdApi(id);
                setSong(res.data.data ?? null);
            } catch (error) {
                console.error('Error fetching song detail:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchSongDetail();
    }, [id]);

    const handlePlayPause = useCallback(() => {
        if (!song) return;
        if (currentSong?._id === song._id) {
            togglePlay();
        } else {
            setCurrentSong(song);
        }
    }, [song, currentSong, togglePlay, setCurrentSong]);

    const isCurrentSong = currentSong?._id === song?._id;
    const isSongPlaying = isCurrentSong && isPlaying;

    const formatDuration = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    // Loading skeleton
    if (loading) {
        return (
            <PageLoader fullscreen={false} className="min-h-screen" message="Đang tải chi tiết bài hát..." />
        );
    }

    if (!song) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-zinc-950 gap-4">
                <MusicalNoteIcon className="w-16 h-16 text-gray-600" />
                <p className="text-gray-400 text-lg">Song not found</p>
                <button
                    onClick={() => navigate(-1)}
                    className="mt-2 px-6 py-2 rounded-full bg-white text-black font-semibold hover:scale-105 transition-transform"
                >
                    Go Back
                </button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-zinc-950 overflow-y-auto no-scrollbar pb-32">
            {/* ===== HERO HEADER with gradient ===== */}
            <div className="relative bg-linear-to-b from-spotify-blue/50 via-spotify-blue/20 to-zinc-950 pb-8">
                {/* Back button */}
                <button
                    onClick={() => navigate(-1)}
                    className="absolute top-6 left-6 bg-black/40 hover:bg-black/60 backdrop-blur-sm rounded-full p-2.5 transition-all duration-200 z-10 hover:scale-110 active:scale-95"
                >
                    <ArrowLeftIcon className="w-5 h-5 text-white" />
                </button>

                <div className="px-6 pt-20 flex flex-col md:flex-row items-center md:items-end gap-8">
                    {/* Album Cover with shadow & animation */}
                    <div className="relative group shrink-0">
                        {song.coverUrl ? (
                            <img
                                src={song.coverUrl}
                                alt={song.title}
                                onLoad={() => setImageLoaded(true)}
                                className={`w-56 h-56 md:w-64 md:h-64 rounded-lg shadow-2xl shadow-black/50 object-cover transition-all duration-700 ${imageLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
                                    }`}
                            />
                        ) : (
                            <div className="w-56 h-56 md:w-64 md:h-64 bg-linear-to-br from-spotify-blue to-blue-900 rounded-lg shadow-2xl shadow-black/50 flex items-center justify-center">
                                <MusicalNoteIcon className="w-20 h-20 text-white/60" />
                            </div>
                        )}

                        {/* Play overlay on hover */}
                        <button
                            onClick={handlePlayPause}
                            className="absolute inset-0 bg-black/0 group-hover:bg-black/30 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 cursor-pointer"
                        >
                            <div className="bg-spotify-green rounded-full p-4 shadow-xl transform scale-90 group-hover:scale-100 transition-transform duration-300">
                                {isSongPlaying ? (
                                    <PauseIcon className="w-8 h-8 text-black" />
                                ) : (
                                    <PlayIcon className="w-8 h-8 text-black" />
                                )}
                            </div>
                        </button>
                    </div>

                    {/* Song Info */}
                    <div className="flex-1 text-center md:text-left md:pb-2 animate-[fadeInUp_0.5s_ease-out]">
                        <p className="text-xs font-bold uppercase tracking-widest text-white/70 mb-2">Song</p>
                        <h1 className="text-3xl md:text-5xl lg:text-6xl font-extrabold text-white mb-4 line-clamp-2 leading-tight">
                            {song.title}
                        </h1>
                        <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 text-sm text-gray-300">
                            <span className="font-semibold text-white hover:underline cursor-pointer">{song.artist}</span>
                            {song.album && (
                                <>
                                    <span className="text-gray-500">•</span>
                                    <span className="text-gray-400">{song.album}</span>
                                </>
                            )}
                            {song.duration && (
                                <>
                                    <span className="text-gray-500">•</span>
                                    <span className="text-gray-400 flex items-center gap-1">
                                        <ClockIcon className="w-3.5 h-3.5" />
                                        {formatDuration(song.duration)}
                                    </span>
                                </>
                            )}
                        </div>

                        {/* Stats row */}
                        {(typeof song.plays === 'number' || typeof song.likes === 'number') && (
                            <div className="flex items-center justify-center md:justify-start gap-4 mt-3 text-sm text-gray-400">
                                {typeof song.plays === 'number' && (
                                    <span>{song.plays.toLocaleString()} plays</span>
                                )}
                                {typeof song.likes === 'number' && (
                                    <span>{song.likes.toLocaleString()} likes</span>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* ===== ACTION BAR ===== */}
            <div className="px-6 py-5 flex items-center gap-5">
                {/* Main Play Button */}
                <button
                    onClick={handlePlayPause}
                    className="bg-spotify-green hover:bg-green-400 text-black rounded-full p-4 hover:scale-105 active:scale-95 transition-all duration-200 shadow-lg shadow-green-500/20"
                >
                    {isSongPlaying ? (
                        <PauseIcon className="w-7 h-7" />
                    ) : (
                        <PlayIcon className="w-7 h-7" />
                    )}
                </button>

                {/* Like Button */}
                <button
                    onClick={() => setIsLiked(!isLiked)}
                    className={`transition-all duration-200 hover:scale-110 active:scale-90 ${isLiked ? 'text-spotify-green' : 'text-gray-400 hover:text-white'
                        }`}
                >
                    {isLiked ? (
                        <HeartSolidIcon className="w-8 h-8 animate-[heartBeat_0.3s_ease-in-out]" />
                    ) : (
                        <HeartIcon className="w-8 h-8" />
                    )}
                </button>

                {/* Share */}
                <button className="text-gray-400 hover:text-white transition-colors duration-200 hover:scale-110 active:scale-90">
                    <ShareIcon className="w-6 h-6" />
                </button>

                {/* More */}
                <button className="text-gray-400 hover:text-white transition-colors duration-200 hover:scale-110 active:scale-90">
                    <EllipsisHorizontalIcon className="w-6 h-6" />
                </button>

                {/* Playing indicator */}
                {isSongPlaying && (
                    <div className="ml-auto flex items-center gap-2">
                        <span className="text-spotify-green text-sm font-medium">Now Playing</span>
                        <div className="flex gap-[3px] items-end h-4">
                            <div className="w-[3px] rounded-full bg-spotify-green animate-[equalizer_0.8s_ease-in-out_infinite]" style={{ height: '60%' }} />
                            <div className="w-[3px] rounded-full bg-spotify-green animate-[equalizer_0.8s_ease-in-out_infinite_0.2s]" style={{ height: '100%' }} />
                            <div className="w-[3px] rounded-full bg-spotify-green animate-[equalizer_0.8s_ease-in-out_infinite_0.4s]" style={{ height: '40%' }} />
                            <div className="w-[3px] rounded-full bg-spotify-green animate-[equalizer_0.8s_ease-in-out_infinite_0.6s]" style={{ height: '80%' }} />
                        </div>
                    </div>
                )}
            </div>

            {/* ===== SONG DETAILS ===== */}
            <div className="px-6 py-4">
                <div className="max-w-4xl space-y-8">

                    {/* Genres Tags */}
                    {song.genres && song.genres.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                            {song.genres.map((genre, index) => (
                                <span
                                    key={index}
                                    className="px-4 py-1.5 bg-gray-800/60 hover:bg-gray-700/60 text-gray-300 rounded-full text-sm font-medium transition-colors duration-200 cursor-pointer border border-gray-700/50"
                                >
                                    {genre}
                                </span>
                            ))}
                        </div>
                    )}

                    {/* Info Cards Grid */}
                    <div>
                        <h2 className="text-xl font-bold text-white mb-4">About this song</h2>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                            {/* Artist Card */}
                            <div className="bg-gray-800/40 hover:bg-gray-800/60 rounded-xl p-4 transition-all duration-200 group cursor-pointer border border-white/5 hover:border-white/10">
                                <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Artist</p>
                                <p className="text-white font-semibold text-sm truncate group-hover:text-spotify-green transition-colors">
                                    {song.artist}
                                </p>
                            </div>

                            {/* Album Card */}
                            {song.album && (
                                <div className="bg-gray-800/40 hover:bg-gray-800/60 rounded-xl p-4 transition-all duration-200 border border-white/5 hover:border-white/10">
                                    <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Album</p>
                                    <p className="text-white font-semibold text-sm truncate">{song.album}</p>
                                </div>
                            )}

                            {/* Duration Card */}
                            {song.duration && (
                                <div className="bg-gray-800/40 hover:bg-gray-800/60 rounded-xl p-4 transition-all duration-200 border border-white/5 hover:border-white/10">
                                    <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Duration</p>
                                    <p className="text-white font-semibold text-sm">{formatDuration(song.duration)}</p>
                                </div>
                            )}

                            {/* Plays Card */}
                            {typeof song.plays === 'number' && (
                                <div className="bg-gray-800/40 hover:bg-gray-800/60 rounded-xl p-4 transition-all duration-200 border border-white/5 hover:border-white/10">
                                    <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Plays</p>
                                    <p className="text-white font-semibold text-sm">{song.plays.toLocaleString()}</p>
                                </div>
                            )}

                            {/* Likes Card */}
                            {typeof song.likes === 'number' && (
                                <div className="bg-gray-800/40 hover:bg-gray-800/60 rounded-xl p-4 transition-all duration-200 border border-white/5 hover:border-white/10">
                                    <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Likes</p>
                                    <p className="text-white font-semibold text-sm">{song.likes.toLocaleString()}</p>
                                </div>
                            )}

                            {/* File Size Card */}
                            {song.size && (
                                <div className="bg-gray-800/40 hover:bg-gray-800/60 rounded-xl p-4 transition-all duration-200 border border-white/5 hover:border-white/10">
                                    <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">File Size</p>
                                    <p className="text-white font-semibold text-sm">
                                        {(song.size / (1024 * 1024)).toFixed(2)} MB
                                    </p>
                                </div>
                            )}

                            {/* Upload Date Card */}
                            {song.createdAt && (
                                <div className="bg-gray-800/40 hover:bg-gray-800/60 rounded-xl p-4 transition-all duration-200 border border-white/5 hover:border-white/10">
                                    <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Uploaded</p>
                                    <p className="text-white font-semibold text-sm">
                                        {new Date(song.createdAt).toLocaleDateString('vi-VN', {
                                            year: 'numeric',
                                            month: 'short',
                                            day: 'numeric'
                                        })}
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Lyrics Section */}
                    <div>
                        <h2 className="text-xl font-bold text-white mb-4">Lyrics</h2>
                        <div className="bg-linear-to-br from-gray-800/40 to-gray-900/40 rounded-xl p-6 border border-white/5">
                            <p className="text-gray-500 italic text-sm">Lyrics not available for this song.</p>
                        </div>
                    </div>

                    {/* Song ID - subtle footer */}
                    {song._id && (
                        <div className="pt-4 border-t border-gray-800/60">
                            <p className="text-xs text-gray-600 font-mono">ID: {song._id}</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SongDetail;
