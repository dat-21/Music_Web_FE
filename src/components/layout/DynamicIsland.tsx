import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FaPlay, FaPause, FaForward, FaBackward,
  FaSearch, FaUser, FaHome, FaCompactDisc
} from 'react-icons/fa';
import { usePlayerStore } from '@/store';
import { useNavigate } from 'react-router-dom';

interface DynamicIslandProps {
  onOpenPlayer: () => void;
}

export const DynamicIsland: React.FC<DynamicIslandProps> = ({ onOpenPlayer }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const navigate = useNavigate();

  const currentSong = usePlayerStore(s => s.currentSong);
  const isPlaying = usePlayerStore(s => s.isPlaying);
  const togglePlay = usePlayerStore(s => s.togglePlay);

  const active = isHovered || isExpanded;

  const NavLink: React.FC<{ icon: React.ReactNode; label: string; path: string }> = ({ icon, label, path }) => (
    <button
      onClick={(e) => { e.stopPropagation(); navigate(path); }}
      className="flex flex-col items-center gap-1 group transition-all duration-200"
    >
      <span className="text-[15px] text-white/40 group-hover:text-[var(--color-accent-neon)] transition-colors group-hover:drop-shadow-[0_0_8px_rgba(0,229,255,0.6)]">{icon}</span>
      <span className="text-[8px] font-bold tracking-[0.2em] uppercase text-transparent group-hover:text-white/50 transition-all">{label}</span>
    </button>
  );

  return (
    <div className="fixed top-5 left-1/2 -translate-x-1/2 z-50">
      <motion.div
        layout
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={() => setIsExpanded(v => !v)}
        className="relative cursor-pointer"
        animate={{
          width: isExpanded ? 400 : (active && currentSong ? 260 : currentSong ? 200 : 150),
          height: isExpanded ? 156 : 48,
        }}
        transition={{ type: 'spring', damping: 26, stiffness: 300 }}
        style={{
          background: 'rgba(5,7,15,0.92)',
          backdropFilter: 'blur(40px)',
          WebkitBackdropFilter: 'blur(40px)',
          borderRadius: isExpanded ? 28 : 9999,
          border: '1px solid rgba(255,255,255,0.08)',
          boxShadow: '0 10px 50px rgba(0,0,0,0.9), inset 0 1px 0 rgba(255,255,255,0.06)',
          overflow: 'hidden',
        }}
      >
        <AnimatePresence mode="popLayout">
          {/* ── Collapsed pill ── */}
          {!isExpanded && (
            <motion.div
              key="pill"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center justify-center gap-3 w-full h-full px-4"
            >
              {currentSong ? (
                <>
                  <div
                    className="w-7 h-7 rounded-full overflow-hidden shrink-0 ring-1 ring-white/10"
                    style={{ animation: isPlaying ? 'orbit-spin 8s linear infinite' : 'none' }}
                  >
                    <img
                      src={currentSong.coverUrl || '/default-cover.png'}
                      className="w-full h-full object-cover scale-125"
                      alt=""
                    />
                  </div>
                  <span className="text-white/90 text-xs font-semibold truncate max-w-[100px]">{currentSong.title}</span>
                  {isPlaying && (
                    <div className="flex gap-[2px] items-end h-3 shrink-0">
                      <div className="w-[2px] rounded-full bg-[var(--color-accent-neon)] animate-eq" style={{ height: '55%' }} />
                      <div className="w-[2px] rounded-full bg-[var(--color-accent-neon)] animate-eq-2" style={{ height: '100%' }} />
                      <div className="w-[2px] rounded-full bg-[var(--color-accent-neon)] animate-eq-3" style={{ height: '70%' }} />
                    </div>
                  )}
                </>
              ) : (
                <span className="text-[10px] font-bold tracking-[0.3em] uppercase text-white/30">Universe</span>
              )}
            </motion.div>
          )}

          {/* ── Expanded panel ── */}
          {isExpanded && (
            <motion.div
              key="panel"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col h-full px-5 py-4 gap-3"
            >
              {/* Top row */}
              <div className="flex items-center gap-4">
                {currentSong ? (
                  <>
                    <div
                      className="w-16 h-16 rounded-2xl overflow-hidden shrink-0 shadow-glow-sm cursor-pointer hover:scale-105 transition-transform ring-1 ring-white/10"
                      onClick={(e) => { e.stopPropagation(); onOpenPlayer(); }}
                    >
                      <img src={currentSong.coverUrl || '/default-cover.png'} className="w-full h-full object-cover" alt="" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white font-bold text-sm truncate">{currentSong.title}</p>
                      <p className="text-white/50 text-xs truncate mt-0.5">{currentSong.artist}</p>
                      <div className="mt-2 h-[3px] bg-white/8 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full"
                          style={{
                            width: `${(usePlayerStore.getState().currentTime / (usePlayerStore.getState().duration || 1)) * 100}%`,
                            background: 'var(--color-accent-neon)',
                            boxShadow: '0 0 8px rgba(0,229,255,0.5)',
                          }}
                        />
                      </div>
                    </div>
                  </>
                ) : (
                  <p className="text-white/30 text-sm flex-1">No song playing</p>
                )}
              </div>

              {/* Bottom row */}
              <div className="flex items-center justify-between">
                <div className="flex gap-5" onClick={e => e.stopPropagation()}>
                  <NavLink icon={<FaHome />} label="Home" path="/" />
                  <NavLink icon={<FaSearch />} label="Search" path="/search" />
                  <NavLink icon={<FaCompactDisc />} label="Library" path="/library" />
                  <NavLink icon={<FaUser />} label="Profile" path="/profile" />
                </div>

                <div className="flex items-center gap-4" onClick={e => e.stopPropagation()}>
                  <button className="text-white/30 hover:text-white/80 transition-colors hover:scale-110">
                    <FaBackward size={13} />
                  </button>
                  <button
                    onClick={togglePlay}
                    className="w-10 h-10 flex items-center justify-center rounded-full text-[var(--color-bg-primary)] hover:scale-110 active:scale-95 transition-transform"
                    style={{
                      background: 'var(--color-accent-neon)',
                      boxShadow: '0 0 24px rgba(0,229,255,0.4)',
                    }}
                  >
                    {isPlaying ? <FaPause size={14} /> : <FaPlay size={14} className="ml-0.5" />}
                  </button>
                  <button className="text-white/30 hover:text-white/80 transition-colors hover:scale-110">
                    <FaForward size={13} />
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};
