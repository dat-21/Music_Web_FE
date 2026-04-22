import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Play, Pause, SkipBack, SkipForward, Volume2, Maximize2, Share2, Heart } from 'lucide-react';
import { Visualizer } from './Visualizer';
import type { Song } from '@/types';

interface FullPlayerProps {
  isOpen: boolean;
  onClose: () => void;
  currentSong: Song;
  isPlaying: boolean;
  togglePlay: () => void;
  currentTime: number;
  duration: number;
  onSeek: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const FullPlayer: React.FC<FullPlayerProps> = ({
  isOpen, onClose, currentSong, isPlaying, togglePlay, currentTime, duration, onSeek
}) => {

  const formatTime = (time: number) => {
    if (isNaN(time)) return '0:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ y: '100%' }}
          animate={{ y: 0 }}
          exit={{ y: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="fixed inset-0 z-50 flex flex-col bg-zinc-950 text-white overflow-hidden"
        >
          {/* Dynamic Background Blur */}
          <div className="absolute inset-0 z-0">
            <div className="absolute inset-0 bg-black/50 z-10" />
            <img src={currentSong.coverUrl || '/default-cover.png'} className="w-full h-full object-cover blur-[80px] opacity-40 scale-110" alt="bg" />
            <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/80 to-transparent z-20" />
            <div className="absolute inset-0 bg-gradient-to-b from-zinc-950/50 via-transparent to-transparent z-20" />
          </div>

          {/* Top Bar */}
          <div className="relative z-30 flex items-center justify-between p-6">
            <button onClick={onClose} className="p-3 bg-white/5 hover:bg-white/10 border border-white/10 backdrop-blur-md rounded-full transition-all hover:scale-105 active:scale-95">
              <ChevronDown size={24} />
            </button>
            <div className="flex flex-col items-center">
              <span className="text-[10px] font-bold tracking-[0.2em] text-cyan-400 uppercase mb-1">Now Playing from Playlist</span>
              <span className="text-sm font-medium text-zinc-200">Daily Discoveries</span>
            </div>
            <button className="p-3 bg-white/5 hover:bg-white/10 border border-white/10 backdrop-blur-md rounded-full transition-all hover:scale-105 active:scale-95">
              <Maximize2 size={20} />
            </button>
          </div>

          {/* Center Content: Artwork & Info */}
          <div className="relative z-30 flex-1 flex flex-col items-center justify-center p-6 gap-10">
            <motion.div
              className="relative w-64 h-64 md:w-96 md:h-96 rounded-3xl shadow-2xl overflow-hidden shadow-black/80 ring-1 ring-white/10"
              animate={{ scale: isPlaying ? 1.02 : 1 }}
              transition={{ type: 'spring', damping: 20 }}
            >
              <img src={currentSong.coverUrl || '/default-cover.png'} className="w-full h-full object-cover transition-transform duration-10000 hover:scale-110" alt="cover" />
              <div className="absolute inset-0 shadow-[inset_0_0_50px_rgba(0,0,0,0.6)] pointer-events-none" />
            </motion.div>

            <div className="w-full max-w-lg flex flex-col items-center">
              <div className="flex items-center justify-between w-full mb-6">
                <button className="text-zinc-400 hover:text-white transition-colors"><Share2 size={24} /></button>
                <div className="flex flex-col items-center mx-4">
                  <h2 className="text-2xl md:text-4xl font-bold text-center mb-2 drop-shadow-xl bg-clip-text text-transparent bg-gradient-to-r from-white to-zinc-400">{currentSong.title}</h2>
                  <p className="text-lg md:text-xl text-zinc-300 text-center drop-shadow-md">{currentSong.artist}</p>
                </div>
                <button className="text-zinc-400 hover:text-red-500 transition-colors"><Heart size={24} /></button>
              </div>

              <div className="w-full max-w-sm mb-4">
                <Visualizer isPlaying={isPlaying} barCount={40} color="bg-emerald-400" />
              </div>
            </div>
          </div>

          {/* Controls Bottom */}
          <div className="relative z-30 p-6 md:p-10 w-full max-w-4xl mx-auto flex flex-col gap-6 bg-zinc-900/40 backdrop-blur-2xl rounded-t-[3rem] border-t border-white/5">
            {/* Progress */}
            <div className="flex items-center gap-4 text-xs font-semibold text-zinc-400">
              <span className="w-10 text-right">{formatTime(currentTime)}</span>
              <div className="relative flex-1 h-3 flex items-center group">
                <input
                  type="range"
                  min="0"
                  max={duration || 100}
                  value={currentTime}
                  onChange={onSeek}
                  className="absolute w-full h-1.5 bg-zinc-700/50 rounded-full appearance-none cursor-pointer z-20 opacity-0 group-hover:opacity-100 transition-opacity"
                />
                <div className="absolute left-0 h-1.5 bg-zinc-700/50 w-full rounded-full z-0 overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-emerald-400 to-cyan-500" style={{ width: `${(currentTime / (duration || 1)) * 100}%` }} />
                </div>
              </div>
              <span className="w-10 text-left">{formatTime(duration)}</span>
            </div>

            {/* Buttons */}
            <div className="flex items-center justify-center gap-8 md:gap-12 mt-2">
              <button className="text-zinc-400 hover:text-white transition-colors p-2"><Volume2 size={24} /></button>
              <button className="text-zinc-300 hover:text-white transition-transform hover:scale-110 active:scale-95"><SkipBack size={36} fill="currentColor" /></button>
              <button onClick={togglePlay} className="w-20 h-20 md:w-24 md:h-24 flex items-center justify-center bg-white text-black rounded-full hover:scale-105 active:scale-95 transition-all shadow-[0_0_40px_rgba(255,255,255,0.2)]">
                {isPlaying ? <Pause size={36} fill="currentColor" /> : <Play size={36} fill="currentColor" className="ml-2" />}
              </button>
              <button className="text-zinc-300 hover:text-white transition-transform hover:scale-110 active:scale-95"><SkipForward size={36} fill="currentColor" /></button>
              <div className="w-10" /> {/* Balancer */}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
