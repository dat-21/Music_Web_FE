import { useEffect, useRef, useCallback } from 'react';
import { usePlayerStore, useAuthStore } from '../../store';
import { useListenHistory } from '../../hooks/useListenHistory';
import { API_ENDPOINTS } from '../../../../shared/contracts';

const Player = () => {
    const rawBaseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
    const normalizedBaseUrl = rawBaseUrl.replace(/\/+$/, '').replace(/\/api$/, '');
    const historyPositionUrl = `${normalizedBaseUrl}${API_ENDPOINTS.history.position}`;

    const {
        currentSong,
        isPlaying,
        volume,
        currentTime,
        // play,
        pause,
        seekPosition,
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
    
    // Xử lý tua bài hát (seek)
    useEffect(() => {
        if (seekPosition !== null && audioRef.current) {
            audioRef.current.currentTime = seekPosition;
            setCurrentTime(seekPosition);
            usePlayerStore.setState({ seekPosition: null }); // Clear sau khi seek
        }
    }, [seekPosition, setCurrentTime]);

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



    if (!currentSong) return null;

    return (
        <audio
            ref={audioRef}
            onTimeUpdate={handleTimeUpdate}
            onLoadedMetadata={handleLoadedMetadata}
            onEnded={handleEnded}
            className="hidden"
        />
    );
};

export default Player;
