import { useEffect, useRef, useCallback } from 'react';
import { usePlayerStore, useAuthStore } from '../../store';
import { useListenHistory } from '../../hooks/useListenHistory';
import { API_ENDPOINTS } from '../../../../shared/contracts';
import {
    PlayIcon,
    PauseIcon,
    ForwardIcon,
    BackwardIcon,
    SpeakerWaveIcon,
    SpeakerXMarkIcon
} from '@heroicons/react/24/solid';

const Player = () => {
    const rawBaseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
    const normalizedBaseUrl = rawBaseUrl.replace(/\/+$/, '').replace(/\/api$/, '');
    const historyPositionUrl = `${normalizedBaseUrl}${API_ENDPOINTS.history.position}`;

    const {
        currentSong,
        isPlaying,
        volume,
        currentTime,
        duration,
        // play,
        pause,
        togglePlay,
        setVolume,
        setCurrentTime,
        setDuration
    } = usePlayerStore();

    const { isAuthenticated } = useAuthStore();

    const {
        fetchSavedPosition,
        startPeriodicSync,
        stopPeriodicSync,
        saveImmediately,
    } = useListenHistory({
        syncInterval: 10000, // Sync mỗi 10 giây
        debounceTime: 1000,  // Debounce 1 giây
    });

    const audioRef = useRef<HTMLAudioElement>(null);
    const isRestoredRef = useRef(false); // Track nếu đã restore position
    const currentSongIdRef = useRef<string | null>(null); // Track song hiện tại

    // Hàm lấy position hiện tại cho periodic sync
    const getCurrentPosition = useCallback(() => {
        return audioRef.current?.currentTime || 0;
    }, []);

    // Load bài hát mới + restore position từ backend
    useEffect(() => {
        if (!audioRef.current || !currentSong) return;

        const audio = audioRef.current;
        const songId = currentSong._id;

        // Nếu là bài mới
        if (currentSongIdRef.current !== songId) {
            // Lưu vị trí bài cũ trước khi đổi bài (nếu có)
            if (currentSongIdRef.current && isAuthenticated && audioRef.current.currentTime > 0) {
                saveImmediately(currentSongIdRef.current, audioRef.current.currentTime);
            }

            // Reset flag và cập nhật song id
            isRestoredRef.current = false;
            currentSongIdRef.current = songId;

            // Load source mới
            audio.src = currentSong.fileUrl;

            // Fetch vị trí đã lưu từ backend
            if (isAuthenticated) {
                fetchSavedPosition(songId).then((savedPosition) => {
                    if (savedPosition > 0 && audio.readyState >= 1) {
                        audio.currentTime = savedPosition;
                        setCurrentTime(savedPosition);
                        isRestoredRef.current = true;
                    }
                });
            }
        }

        if (isPlaying) {
            audio.play().catch(err => console.error('Error playing audio:', err));
        }
    }, [currentSong, isPlaying, isAuthenticated, fetchSavedPosition, saveImmediately, setCurrentTime]);

    // Bắt đầu/dừng periodic sync khi play/pause
    useEffect(() => {
        if (!audioRef.current || !currentSong) return;

        const audio = audioRef.current;

        if (isPlaying) {
            audio.play().catch(err => console.error('Error playing audio:', err));

            // Bắt đầu sync định kỳ khi đang phát
            if (isAuthenticated) {
                startPeriodicSync(currentSong._id, getCurrentPosition);
            }
        } else {
            audio.pause();

            // Dừng sync và lưu vị trí hiện tại khi pause
            stopPeriodicSync();
            if (isAuthenticated && currentSong && audio.currentTime > 0) {
                saveImmediately(currentSong._id, audio.currentTime);
            }
        }
    }, [isPlaying, currentSong, isAuthenticated, startPeriodicSync, stopPeriodicSync, saveImmediately, getCurrentPosition]);

    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.volume = volume;
        }
    }, [volume]);

    // Lưu vị trí khi user rời trang (beforeunload)
    useEffect(() => {
        const handleBeforeUnload = () => {
            if (isAuthenticated && currentSong && audioRef.current && audioRef.current.currentTime > 0) {
                // Dùng navigator.sendBeacon để đảm bảo request được gửi
                const data = JSON.stringify({
                    songId: currentSong._id,
                    position: Math.floor(audioRef.current.currentTime),
                });
                navigator.sendBeacon(
                    historyPositionUrl,
                    new Blob([data], { type: 'application/json' })
                );
            }
        };

        window.addEventListener('beforeunload', handleBeforeUnload);
        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
            // Cleanup: lưu vị trí khi component unmount
            if (isAuthenticated && currentSong && audioRef.current && audioRef.current.currentTime > 0) {
                saveImmediately(currentSong._id, audioRef.current.currentTime);
            }
            stopPeriodicSync();
        };
    }, [isAuthenticated, currentSong, historyPositionUrl, saveImmediately, stopPeriodicSync]);

    // Audio event handlers
    const handleTimeUpdate = () => {
        if (audioRef.current) {
            setCurrentTime(audioRef.current.currentTime);
        }
    };

    const handleLoadedMetadata = () => {
        if (audioRef.current) {
            setDuration(audioRef.current.duration);

            // Restore vị trí đã lưu từ backend (chỉ làm 1 lần)
            if (!isRestoredRef.current && isAuthenticated && currentSong) {
                fetchSavedPosition(currentSong._id).then((savedPosition) => {
                    if (savedPosition > 0 && audioRef.current) {
                        audioRef.current.currentTime = savedPosition;
                        setCurrentTime(savedPosition);
                        isRestoredRef.current = true;
                    }
                });
            } else if (!isRestoredRef.current && currentTime > 0) {
                // Fallback: restore từ localStorage nếu không có backend data
                audioRef.current.currentTime = currentTime;
                isRestoredRef.current = true;
            }
        }
    };

    const handleEnded = () => {
        pause();
        setCurrentTime(0);
    };

    const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
        const time = parseFloat(e.target.value);
        setCurrentTime(time);
        if (audioRef.current) {
            audioRef.current.currentTime = time;
        }
    };

    const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newVolume = parseFloat(e.target.value);
        setVolume(newVolume);
    };

    const formatTime = (time: number) => {
        if (isNaN(time)) return '0:00';
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    };

    if (!currentSong) return null;

    return (
        <div className="fixed bottom-0 left-0 right-0 bg-black px-4 py-3 z-50">
            <audio
                ref={audioRef}
                onTimeUpdate={handleTimeUpdate}
                onLoadedMetadata={handleLoadedMetadata}
                onEnded={handleEnded}
            />

            <div className="flex items-center justify-between gap-4">
                {/* Song Info */}
                <div className="flex items-center gap-3 w-1/4 min-w-0">
                    {currentSong.coverUrl ? (
                        <img
                            src={currentSong.coverUrl}
                            alt={currentSong.title}
                            className="w-14 h-14 rounded object-cover flex-shrink-0"
                        />
                    ) : (
                        <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-purple-500 rounded flex items-center justify-center flex-shrink-0">
                            <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M18 3a1 1 0 00-1.196-.98l-10 2A1 1 0 006 5v9.114A4.369 4.369 0 005 14c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V7.82l8-1.6v5.894A4.37 4.37 0 0015 12c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V3z" />
                            </svg>
                        </div>
                    )}
                    <div className="min-w-0 flex-1">
                        <p className="text-white text-sm font-semibold truncate">{currentSong.title}</p>
                        <p className="text-gray-400 text-xs truncate">{currentSong.artist}</p>
                    </div>
                </div>

                {/* Player Controls */}
                <div className="flex flex-col items-center gap-2 flex-1 max-w-2xl">
                    <div className="flex items-center gap-4">
                        <button className="text-gray-400 hover:text-white transition">
                            <BackwardIcon className="w-5 h-5" />
                        </button>

                        <button
                            onClick={togglePlay}
                            className="bg-white text-black rounded-full p-2 hover:scale-105 transition"
                        >
                            {isPlaying ? (
                                <PauseIcon className="w-5 h-5" />
                            ) : (
                                <PlayIcon className="w-5 h-5" />
                            )}
                        </button>

                        <button className="text-gray-400 hover:text-white transition">
                            <ForwardIcon className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Progress Bar */}
                    <div className="flex items-center gap-2 w-full">
                        <span className="text-xs text-gray-400 w-10 text-right">
                            {formatTime(currentTime)}
                        </span>
                        <input
                            type="range"
                            min="0"
                            max={duration || 0}
                            value={currentTime}
                            onChange={handleSeek}
                            className="flex-1 h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer slider"
                        />
                        <span className="text-xs text-gray-400 w-10">
                            {formatTime(duration)}
                        </span>
                    </div>
                </div>

                {/* Volume Control */}
                <div className="flex items-center gap-2 w-1/4 justify-end">
                    <button
                        onClick={() => setVolume(volume === 0 ? 1 : 0)}
                        className="text-gray-400 hover:text-white transition"
                    >
                        {volume === 0 ? (
                            <SpeakerXMarkIcon className="w-5 h-5" />
                        ) : (
                            <SpeakerWaveIcon className="w-5 h-5" />
                        )}
                    </button>
                    <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.01"
                        value={volume}
                        onChange={handleVolumeChange}
                        className="w-24 h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer slider"
                    />
                </div>
            </div>

            <style>{`
                .slider::-webkit-slider-thumb {
                    appearance: none;
                    width: 12px;
                    height: 12px;
                    background: white;
                    border-radius: 50%;
                    cursor: pointer;
                }
                .slider::-moz-range-thumb {
                    width: 12px;
                    height: 12px;
                    background: white;
                    border-radius: 50%;
                    cursor: pointer;
                    border: none;
                }
                .slider:hover::-webkit-slider-thumb {
                    background: #1db954;
                }
                .slider:hover::-moz-range-thumb {
                    background: #1db954;
                }
            `}</style>
        </div>
    );
};

export default Player;
