import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FaPlay, FaPause, FaForward, FaBackward,
  FaHeart, FaPlus, FaTimes, FaVolumeUp, FaRandom, FaRedo
} from 'react-icons/fa';
import type { Song } from '@/types';

interface CircularPlayerProps {
  isOpen: boolean;
  onClose: () => void;
  currentSong: Song;
  isPlaying: boolean;
  togglePlay: () => void;
  currentTime: number;
  duration: number;
  onSeek: (val: number) => void;
}

const formatTime = (s: number) => {
  if (isNaN(s)) return '0:00';
  return `${Math.floor(s / 60)}:${Math.floor(s % 60).toString().padStart(2, '0')}`;
};

export const CircularPlayer: React.FC<CircularPlayerProps> = ({
  isOpen, onClose, currentSong, isPlaying, togglePlay, currentTime, duration, onSeek,
}) => {
  const R = 160;
  const circumference = 2 * Math.PI * R;
  const offset = circumference - ((currentTime / (duration || 1)) * circumference);

  const handleRingClick = (e: React.MouseEvent<SVGSVGElement>) => {
    const svg = e.currentTarget.getBoundingClientRect();
    const cx = svg.left + svg.width / 2;
    const cy = svg.top + svg.height / 2;
    let angle = Math.atan2(e.clientY - cy, e.clientX - cx) + Math.PI / 2;
    if (angle < 0) angle += 2 * Math.PI;
    onSeek((angle / (2 * Math.PI)) * duration);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, scale: 0.96, filter: 'blur(16px)' }}
          animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
          exit={{ opacity: 0, scale: 0.96, filter: 'blur(16px)' }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center text-white overflow-hidden"
          style={{ background: '#05070f' }}
        >
          {/* ── Spatial background ── */}
          <div className="absolute inset-0 pointer-events-none">
            <motion.img
              src={(currentSong as any).coverUrl || '/default-cover.png'}
              alt=""
              className="absolute inset-0 w-full h-full object-cover"
              style={{ filter: 'blur(120px) saturate(1.8) brightness(0.35)', opacity: 0.45, transform: 'scale(1.3)' }}
              animate={{ scale: isPlaying ? [1.3, 1.35, 1.3] : 1.3 }}
              transition={{ repeat: Infinity, duration: 10, ease: 'easeInOut' }}
            />
            {/* Deep vignette */}
            <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at center, transparent 25%, rgba(5,7,15,0.96) 70%)' }} />
            {/* Center glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full"
                 style={{ background: 'radial-gradient(circle, rgba(0,229,255,0.06) 0%, transparent 60%)' }} />
          </div>

          {/* ── Close ── */}
          <button
            onClick={onClose}
            className="absolute top-8 right-8 z-50 w-12 h-12 flex items-center justify-center rounded-full text-white/30 hover:text-white transition-all hover:rotate-90 hover:bg-white/5"
            style={{ border: '1px solid rgba(255,255,255,0.06)' }}
          >
            <FaTimes size={18} />
          </button>

          {/* ── Label ── */}
          <motion.p
            className="label-neon mb-6 z-10"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            Now Playing
          </motion.p>

          {/* ── Orbital system ── */}
          <div className="relative z-10 flex items-center justify-center" style={{ width: 400, height: 400 }}>

            {/* Ring SVG */}
            <svg
              width="400" height="400" viewBox="0 0 400 400"
              className="absolute inset-0 cursor-crosshair z-20"
              onClick={handleRingClick}
              style={{ transform: 'rotate(-90deg)' }}
            >
              {/* Track */}
              <circle cx="200" cy="200" r={R} fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="4" />
              {/* Tick marks */}
              {Array.from({ length: 48 }).map((_, i) => {
                const a = (i / 48) * 2 * Math.PI;
                const x1 = 200 + (R - 5) * Math.cos(a);
                const y1 = 200 + (R - 5) * Math.sin(a);
                const x2 = 200 + R * Math.cos(a);
                const y2 = 200 + R * Math.sin(a);
                return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="rgba(255,255,255,0.05)" strokeWidth="1" />;
              })}
              {/* Progress */}
              <circle cx="200" cy="200" r={R}
                fill="none" stroke="#00e5ff" strokeWidth="5"
                strokeDasharray={circumference} strokeDashoffset={offset} strokeLinecap="round"
                style={{ transition: 'stroke-dashoffset 0.15s linear', filter: 'drop-shadow(0 0 10px rgba(0,229,255,0.5))' }}
              />
              {/* Thumb */}
              <circle
                cx={200 + R * Math.cos((currentTime / (duration || 1)) * 2 * Math.PI)}
                cy={200 + R * Math.sin((currentTime / (duration || 1)) * 2 * Math.PI)}
                r="8" fill="#00e5ff"
                style={{ filter: 'drop-shadow(0 0 10px rgba(0,229,255,0.8))' }}
              />
            </svg>

            {/* ── Album art ── */}
            <motion.div
              className="relative w-[240px] h-[240px] rounded-full overflow-hidden z-10"
              style={{
                boxShadow: '0 0 80px rgba(0,0,0,0.9), 0 0 60px rgba(0,229,255,0.08), inset 0 0 0 5px rgba(0,0,0,0.5)',
              }}
              animate={{ rotate: isPlaying ? [0, 360] : 0, scale: isPlaying ? 1.02 : 1 }}
              transition={{ rotate: { repeat: Infinity, duration: 25, ease: 'linear' }, scale: { type: 'spring', damping: 20 } }}
            >
              <img src={(currentSong as any).coverUrl || '/default-cover.png'} alt={currentSong.title} className="w-full h-full object-cover" />
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-5 h-5 rounded-full" style={{ background: '#05070f', border: '2px solid rgba(255,255,255,0.08)' }} />
              </div>
            </motion.div>

            {/* ── Orbital controls ── */}
            <button onClick={togglePlay}
              className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-4 z-30 w-16 h-16 flex items-center justify-center rounded-full hover:scale-110 active:scale-95 transition-all"
              style={{ background: '#00e5ff', color: '#05070f', boxShadow: '0 0 40px rgba(0,229,255,0.45)' }}
            >
              {isPlaying ? <FaPause size={22} /> : <FaPlay size={22} className="ml-1" />}
            </button>

            <button className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-30 w-12 h-12 flex items-center justify-center rounded-full text-white/30 hover:text-white hover:bg-white/5 hover:scale-110 transition-all" style={{ border: '1px solid rgba(255,255,255,0.06)' }}>
              <FaBackward size={18} />
            </button>
            <button className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-30 w-12 h-12 flex items-center justify-center rounded-full text-white/30 hover:text-white hover:bg-white/5 hover:scale-110 transition-all" style={{ border: '1px solid rgba(255,255,255,0.06)' }}>
              <FaForward size={18} />
            </button>

            <button className="absolute bottom-4 left-10 z-30 w-11 h-11 flex items-center justify-center rounded-full text-white/25 hover:text-[#00e5ff] hover:scale-110 transition-all hover:drop-shadow-[0_0_10px_rgba(0,229,255,0.5)]">
              <FaHeart size={18} />
            </button>
            <button className="absolute bottom-4 right-10 z-30 w-11 h-11 flex items-center justify-center rounded-full text-white/25 hover:text-[#00e5ff] hover:scale-110 transition-all hover:drop-shadow-[0_0_10px_rgba(0,229,255,0.5)]">
              <FaPlus size={18} />
            </button>
          </div>

          {/* ── Song info ── */}
          <motion.div
            className="z-10 flex flex-col items-center gap-2 mt-8 px-8 max-w-md w-full"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h2 className="text-3xl md:text-4xl font-black text-center text-white tracking-tight">
              {currentSong.title}
            </h2>
            <p className="text-sm font-bold tracking-[0.25em] uppercase" style={{ color: '#00e5ff', textShadow: '0 0 12px rgba(0,229,255,0.5)' }}>
              {currentSong.artist}
            </p>

            <div className="flex items-center justify-between w-full mt-5 text-xs text-white/35 font-mono font-semibold">
              <span>{formatTime(currentTime)}</span>
              <div className="flex gap-6">
                <button className="text-white/20 hover:text-[#b388ff] transition-colors"><FaRandom size={13} /></button>
                <button className="text-white/20 hover:text-[#00e5ff] transition-colors"><FaRedo size={13} /></button>
                <button className="text-white/20 hover:text-white/70 transition-colors"><FaVolumeUp size={13} /></button>
              </div>
              <span>{formatTime(duration)}</span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
