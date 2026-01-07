import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getSongByIdApi } from '../api/song.api';
import type { Song } from '../types';
import { usePlayerStore } from '../store';
import { PlayIcon, PauseIcon, ArrowLeftIcon } from '@heroicons/react/24/solid';
import { HeartIcon } from '@heroicons/react/24/outline';

const SongDetail = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [song, setSong] = useState<Song | null>(null);
    const [loading, setLoading] = useState(true);

    const { currentSong, isPlaying, setCurrentSong, togglePlay } = usePlayerStore();

    useEffect(() => {
        if (id) {
            fetchSongDetail(id);
        }
    }, [id]);

    const fetchSongDetail = async (songId: string) => {
        try {
            setLoading(true);
            const res = await getSongByIdApi(songId);
            setSong(res.data || res.data.song);
        } catch (error) {
            console.error('Error fetching song detail:', error);
        } finally {
            setLoading(false);
        }
    };

    const handlePlayPause = () => {
        if (!song) return;

        if (currentSong?._id === song._id) {
            togglePlay();
        } else {
            setCurrentSong(song);
        }
    };

    const isCurrentSong = currentSong?._id === song?._id;

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-zinc-950">
                <div className="text-white text-xl">Loading...</div>
            </div>
        );
    }

    if (!song) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-zinc-950">
                <div className="text-white text-xl">Song not found</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-zinc-950 pb-32">
            {/* Header with gradient background */}
            <div className="relative bg-gradient-to-b from-blue-600 via-blue-800 to-zinc-950 pb-8">
                {/* Back button */}
                <button
                    onClick={() => navigate(-1)}
                    className="absolute top-6 left-6 bg-black/40 hover:bg-black/60 rounded-full p-2 transition z-10"
                >
                    <ArrowLeftIcon className="w-6 h-6 text-white" />
                </button>

                <div className="px-6 pt-20 flex items-end gap-6">
                    {/* Album Cover */}
                    {song.coverUrl ? (
                        <img
                            src={song.coverUrl}
                            alt={song.title}
                            className="w-60 h-60 rounded-lg shadow-2xl object-cover"
                        />
                    ) : (
                        <div className="w-60 h-60 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg shadow-2xl flex items-center justify-center">
                            <svg className="w-24 h-24 text-white/80" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M18 3a1 1 0 00-1.196-.98l-10 2A1 1 0 006 5v9.114A4.369 4.369 0 005 14c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V7.82l8-1.6v5.894A4.37 4.37 0 0015 12c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V3z" />
                            </svg>
                        </div>
                    )}

                    {/* Song Info */}
                    <div className="flex-1 pb-4">
                        <p className="text-sm font-semibold text-white mb-2">Song</p>
                        <h1 className="text-7xl font-bold text-white mb-6 line-clamp-2">
                            {song.title}
                        </h1>
                        <div className="flex items-center gap-2 text-sm text-white">
                            <span className="font-semibold">{song.artist}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Actions */}
            <div className="px-6 py-6 flex items-center gap-6 bg-zinc-950/40 backdrop-blur-md">
                <button
                    onClick={handlePlayPause}
                    className="bg-green-500 hover:bg-green-400 text-black rounded-full p-4 hover:scale-105 transition shadow-lg"
                >
                    {isCurrentSong && isPlaying ? (
                        <PauseIcon className="w-7 h-7" />
                    ) : (
                        <PlayIcon className="w-7 h-7" />
                    )}
                </button>

                <button className="text-gray-400 hover:text-white transition">
                    <HeartIcon className="w-8 h-8" />
                </button>
            </div>

            {/* Song Details Section */}
            <div className="px-6 py-8">
                <div className="max-w-4xl">
                    <h2 className="text-2xl font-bold text-white mb-6">About this song</h2>

                    <div className="bg-gray-800/40 rounded-lg p-6 space-y-4">
                        <div className="flex justify-between items-center border-b border-gray-700 pb-3">
                            <span className="text-gray-400">Title</span>
                            <span className="text-white font-semibold">{song.title}</span>
                        </div>

                        <div className="flex justify-between items-center border-b border-gray-700 pb-3">
                            <span className="text-gray-400">Artist</span>
                            <span className="text-white font-semibold">{song.artist}</span>
                        </div>

                        {song._id && (
                            <div className="flex justify-between items-center">
                                <span className="text-gray-400">Song ID</span>
                                <span className="text-white font-mono text-sm">{song._id}</span>
                            </div>
                        )}
                    </div>

                    {/* Lyrics or additional info could go here */}
                    <div className="mt-8">
                        <h3 className="text-xl font-bold text-white mb-4">Lyrics</h3>
                        <p className="text-gray-400 italic">Lyrics not available for this song.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SongDetail;
