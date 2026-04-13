import { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { DynamicIsland } from '@/components/layout/DynamicIsland';
import { CircularPlayer } from '@/components/player/CircularPlayer';
import { MiniPlayer } from '@/components/player/MiniPlayer';
import { usePlayerStore } from '@/store';

const FloatingLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isPlayerOpen, setIsPlayerOpen] = useState(false);

  const currentSong    = usePlayerStore(s => s.currentSong);
  const isPlaying      = usePlayerStore(s => s.isPlaying);
  const togglePlay     = usePlayerStore(s => s.togglePlay);
  const currentTime    = usePlayerStore(s => s.currentTime);
  const duration       = usePlayerStore(s => s.duration);
  const seek           = usePlayerStore(s => s.seek);

  const progress = duration ? (currentTime / duration) * 100 : 0;

  return (
    <div className="relative min-h-screen overflow-hidden selection:bg-universe-primary/30"
         style={{ background: 'linear-gradient(180deg, #05070f 0%, #0a0f1f 50%, #05070f 100%)' }}>

      {/* ── Ambient depth layers (behind everything) ── */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        {/* Top-center cyan glow — gives depth to the "sky" */}
        <div className="absolute top-[-200px] left-1/2 -translate-x-1/2 w-[900px] h-[600px] rounded-full"
             style={{ background: 'radial-gradient(ellipse, rgba(0,229,255,0.07) 0%, transparent 65%)' }} />
        {/* Center violet glow — behind the main content area */}
        <div className="absolute top-[30%] left-[40%] w-[700px] h-[700px] rounded-full"
             style={{ background: 'radial-gradient(circle, rgba(179,136,255,0.05) 0%, transparent 60%)' }} />
        {/* Bottom accent glow */}
        <div className="absolute bottom-[-100px] right-[20%] w-[500px] h-[400px] rounded-full"
             style={{ background: 'radial-gradient(circle, rgba(255,64,129,0.04) 0%, transparent 60%)' }} />
      </div>

      {/* ── Dynamic Island ── */}
      <DynamicIsland onOpenPlayer={() => setIsPlayerOpen(true)} />

      {/* ── Main content ── */}
      <main className="relative z-10 w-full h-screen overflow-y-auto overflow-x-hidden pt-20 pb-32 no-scrollbar scroll-smooth">
        {children}
      </main>

      {/* ── MiniPlayer ── */}
      <AnimatePresence>
        {currentSong && !isPlayerOpen && (
          <MiniPlayer
            currentSong={currentSong}
            isPlaying={isPlaying}
            togglePlay={togglePlay}
            onExpand={() => setIsPlayerOpen(true)}
            progress={progress}
          />
        )}
      </AnimatePresence>

      {/* ── CircularPlayer ── */}
      {currentSong && (
        <CircularPlayer
          isOpen={isPlayerOpen}
          onClose={() => setIsPlayerOpen(false)}
          currentSong={currentSong}
          isPlaying={isPlaying}
          togglePlay={togglePlay}
          currentTime={currentTime}
          duration={duration}
          onSeek={seek}
        />
      )}
    </div>
  );
};

export default FloatingLayout;
