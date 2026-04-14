import React from 'react';
import { motion } from 'framer-motion';
import { FaPlay, FaPause, FaForward, FaBackward, FaChevronUp } from 'react-icons/fa';
import type { Song } from '@/types';

interface MiniPlayerProps {
  currentSong: Song;
  isPlaying: boolean;
  togglePlay: () => void;
  onExpand: () => void;
  progress: number;
}

export const MiniPlayer: React.FC<MiniPlayerProps> = ({
  currentSong, isPlaying, togglePlay, onExpand, progress
}) => (
  <motion.div
    initial={{ y: 120, opacity: 0 }}
    animate={{ y: 0,   opacity: 1 }}
    exit={{    y: 120, opacity: 0 }}
    transition={{ type: 'spring', damping: 26, stiffness: 280 }}
    className="fixed bottom-4 left-4 right-4 md:left-1/2 md:-translate-x-1/2 md:w-[520px] z-40"
  >
    <div
      className="relative overflow-hidden rounded-3xl cursor-pointer group"
      style={{
        background: 'rgba(5,7,15,0.88)',
        backdropFilter: 'blur(40px)',
        WebkitBackdropFilter: 'blur(40px)',
        border: '1px solid rgba(255,255,255,0.08)',
        boxShadow: '0 20px 60px rgba(0,0,0,0.8), inset 0 1px 0 rgba(255,255,255,0.05)',
      }}
      onClick={onExpand}
    >
      {/* Progress bar */}
      <div className="absolute top-0 left-0 right-0 h-[3px]" style={{ background: 'rgba(255,255,255,0.04)' }}>
        <div
          className="h-full rounded-full transition-all duration-200"
          style={{
            width: `${progress}%`,
            background: 'var(--color-accent-neon)',
            boxShadow: '0 0 10px rgba(0,229,255,0.6)',
          }}
        />
      </div>

      <div className="flex items-center gap-4 px-4 py-3">
        {/* Art */}
        <div
          className="w-11 h-11 overflow-hidden shrink-0 ring-1 ring-white/8"
          style={{
            borderRadius: isPlaying ? '50%' : '12px',
            animation: isPlaying ? 'orbit-spin 10s linear infinite' : 'none',
            transition: 'border-radius 0.5s',
          }}
        >
          <img src={(currentSong as any).coverUrl || '/default-cover.png'} className="w-full h-full object-cover scale-110" alt="" />
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <p className="text-white font-semibold text-sm truncate">{currentSong.title}</p>
          <p className="text-white/40 text-xs truncate">{currentSong.artist}</p>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-3.5 shrink-0" onClick={e => e.stopPropagation()}>
          <button className="text-white/30 hover:text-white/80 transition-colors hover:scale-110">
            <FaBackward size={13} />
          </button>
          <button
            onClick={togglePlay}
            className="w-10 h-10 flex items-center justify-center rounded-full hover:scale-110 active:scale-95 transition-transform"
            style={{
              background: 'var(--color-accent-neon)',
              color: 'var(--color-bg-primary)',
              boxShadow: '0 0 24px rgba(0,229,255,0.4)',
            }}
          >
            {isPlaying ? <FaPause size={15} /> : <FaPlay size={15} className="ml-0.5" />}
          </button>
          <button className="text-white/30 hover:text-white/80 transition-colors hover:scale-110">
            <FaForward size={13} />
          </button>
          <button onClick={(e) => { e.stopPropagation(); onExpand(); }} className="text-white/25 hover:text-[var(--color-accent-neon)] transition-colors ml-0.5">
            <FaChevronUp size={15} />
          </button>
        </div>
      </div>
    </div>
  </motion.div>
);
