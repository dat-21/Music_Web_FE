import { useEffect, useRef } from 'react';
import { usePlayerStore } from '../../store';
import {
    PlayIcon,
    PauseIcon,
    ForwardIcon,
    BackwardIcon,
    SpeakerWaveIcon,
    SpeakerXMarkIcon
} from '@heroicons/react/24/solid';

const Player = () => {
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

    const audioRef = useRef<HTMLAudioElement>(null);
    const isRestoredRef = useRef(false); // Track nếu đã restore position

    // Sync audio element with store
    useEffect(() => {
        if (!audioRef.current || !currentSong) return;

        const audio = audioRef.current;
        audio.src = currentSong.fileUrl;

        // Khi load bài hát mới, reset flag
        isRestoredRef.current = false;

        if (isPlaying) {
            audio.play().catch(err => console.error('Error playing audio:', err));
        }
    }, [currentSong, isPlaying]);

    useEffect(() => {
        if (!audioRef.current) return;

        const audio = audioRef.current;

        if (isPlaying) {
            audio.play().catch(err => console.error('Error playing audio:', err));
        } else {
            audio.pause();
        }
    }, [isPlaying]);

    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.volume = volume;
        }
    }, [volume]);

    // Audio event handlers
    const handleTimeUpdate = () => {
        if (audioRef.current) {
            setCurrentTime(audioRef.current.currentTime);
        }
    };

    const handleLoadedMetadata = () => {
        if (audioRef.current) {
            setDuration(audioRef.current.duration);

            // Restore vị trí đã lưu khi refresh (chỉ làm 1 lần)
            if (!isRestoredRef.current && currentTime > 0) {
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
