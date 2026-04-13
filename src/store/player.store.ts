import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Song } from '../types';

interface PlayerState {
    currentSong: Song | null;
    isPlaying: boolean;
    volume: number;
    currentTime: number; 
    duration: number;
    seekPosition: number | null;
    
    // Actions
    setCurrentSong: (song: Song) => void;
    play: () => void;
    pause: () => void;
    togglePlay: () => void;
    setVolume: (volume: number) => void;
    setCurrentTime: (time: number) => void;
    setDuration: (duration: number) => void;
    seek: (time: number) => void;
    reset: () => void;
}

export const usePlayerStore = create<PlayerState>()(
    persist(
        (set) => ({
            currentSong: null,
            isPlaying: false,
            volume: 1,
            currentTime: 0,
            duration: 0,
            seekPosition: null,

            setCurrentSong: (song) => set({ currentSong: song, isPlaying: true, currentTime: 0 }),
            play: () => set({ isPlaying: true }),
            pause: () => set({ isPlaying: false }),
            togglePlay: () => set((state) => ({ isPlaying: !state.isPlaying })),
            setVolume: (volume) => set({ volume }),
            setCurrentTime: (time) => set({ currentTime: time }),
            setDuration: (duration) => set({ duration }),
            seek: (time) => set({ seekPosition: time }),
            reset: () => set({ currentSong: null, isPlaying: false, currentTime: 0, duration: 0, seekPosition: null }),
        }),
        {
            name: 'music-player-storage', // localStorage key
            partialize: (state) => ({
                currentSong: state.currentSong,
                currentTime: state.currentTime,
                volume: state.volume,

            }),
        }
    )
);
