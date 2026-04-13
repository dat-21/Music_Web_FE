import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MOCK_MOODS } from '@/lib/mockData';
import { FaPlay } from 'react-icons/fa';

export const MoodWheel = () => {
  const [activeMood, setActiveMood] = useState(MOCK_MOODS[0]);
  const [hoveredMood, setHoveredMood] = useState<string | null>(null);

  const activeIndex = MOCK_MOODS.findIndex(m => m.id === activeMood.id);

  return (
    <div className="relative w-full max-w-2xl mx-auto h-[480px] flex items-center justify-center overflow-visible">

      {/* ── Radial glow behind wheel — gives depth ── */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div
          className="w-[500px] h-[500px] rounded-full animate-pulse-glow"
          style={{ background: 'radial-gradient(circle, rgba(0,229,255,0.10) 0%, rgba(179,136,255,0.06) 40%, transparent 70%)' }}
        />
      </div>

      {/* ── Core hub ── */}
      <motion.div
        className="absolute z-30 w-52 h-52 rounded-full flex flex-col items-center justify-center overflow-hidden"
        style={{
          background: 'radial-gradient(circle at 30% 30%, rgba(15,18,35,1) 0%, rgba(5,7,15,1) 100%)',
          border: '1px solid rgba(255,255,255,0.06)',
          boxShadow: '0 0 60px rgba(0,0,0,0.8), 0 0 120px rgba(0,229,255,0.06), inset 0 0 40px rgba(0,0,0,0.5)',
        }}
        initial={{ scale: 0.85 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', damping: 20 }}
      >
        {/* inner radial highlight */}
        <div className="absolute inset-0 rounded-full pointer-events-none"
             style={{ background: 'radial-gradient(ellipse at 40% 30%, rgba(0,229,255,0.06) 0%, transparent 60%)' }} />

        <AnimatePresence mode="popLayout">
          <motion.div
            key={activeMood.id}
            initial={{ y: 16, opacity: 0, filter: 'blur(6px)' }}
            animate={{ y: 0, opacity: 1, filter: 'blur(0px)' }}
            exit={{ y: -16, opacity: 0, filter: 'blur(6px)' }}
            className="flex flex-col items-center gap-2.5 z-10"
          >
            <activeMood.icon size={36} style={{ color: '#00e5ff', filter: 'drop-shadow(0 0 16px rgba(0,229,255,0.6))' }} />
            <h3 className="text-base font-black tracking-[0.12em] text-white uppercase text-center">
              {activeMood.name}
            </h3>
          </motion.div>
        </AnimatePresence>

        {/* Play button */}
        <button
          className="absolute bottom-4 z-20 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95"
          style={{
            background: 'rgba(0,229,255,0.12)',
            border: '1px solid rgba(0,229,255,0.25)',
            color: '#00e5ff',
            boxShadow: '0 0 16px rgba(0,229,255,0.15)',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.background = 'linear-gradient(135deg, #00e5ff, #2979ff)';
            e.currentTarget.style.color = '#05070f';
            e.currentTarget.style.boxShadow = '0 0 30px rgba(0,229,255,0.5)';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.background = 'rgba(0,229,255,0.12)';
            e.currentTarget.style.color = '#00e5ff';
            e.currentTarget.style.boxShadow = '0 0 16px rgba(0,229,255,0.15)';
          }}
        >
          <FaPlay size={12} className="ml-0.5" />
        </button>
      </motion.div>

      {/* ── Orbiting mood nodes ── */}
      <motion.div
        className="absolute inset-0 flex items-center justify-center pointer-events-none"
        animate={{ rotate: -(activeIndex * (360 / MOCK_MOODS.length)) }}
        transition={{ type: 'spring', damping: 24, stiffness: 110 }}
      >
        {MOCK_MOODS.map((mood, index) => {
          const radius = 200;
          const angle = (index / MOCK_MOODS.length) * Math.PI * 2 - Math.PI / 2;
          const x = Math.cos(angle) * radius;
          const y = Math.sin(angle) * radius;
          const isHovered = hoveredMood === mood.id;
          const isActive = activeMood.id === mood.id;

          return (
            <motion.div key={mood.id} className="absolute" style={{ x, y }}>
              <div className="pointer-events-auto" style={{ transform: `rotate(${activeIndex * (360 / MOCK_MOODS.length)}deg)` }}>
                <button
                  onClick={() => setActiveMood(mood)}
                  onMouseEnter={() => setHoveredMood(mood.id)}
                  onMouseLeave={() => setHoveredMood(null)}
                  className={`relative w-16 h-16 rounded-full flex items-center justify-center transition-all duration-400
                    ${isActive ? 'scale-0 opacity-0 pointer-events-none' : 'hover:scale-[1.3] cursor-pointer'}
                  `}
                  style={{
                    background: isHovered ? 'rgba(255,255,255,0.10)' : 'rgba(255,255,255,0.04)',
                    border: `1px solid ${isHovered ? 'rgba(0,229,255,0.35)' : 'rgba(255,255,255,0.06)'}`,
                    backdropFilter: 'blur(12px)',
                    boxShadow: isHovered ? '0 0 30px rgba(0,229,255,0.18), inset 0 0 12px rgba(0,229,255,0.05)' : '0 4px 16px rgba(0,0,0,0.4)',
                    transition: 'all 0.4s ease',
                  }}
                >
                  <mood.icon
                    size={22}
                    style={{
                      color: isHovered ? '#00e5ff' : 'rgba(255,255,255,0.30)',
                      filter: isHovered ? 'drop-shadow(0 0 8px rgba(0,229,255,0.6))' : 'none',
                      transition: 'all 0.3s ease',
                    }}
                  />
                </button>
              </div>
            </motion.div>
          );
        })}
      </motion.div>

      {/* ── Orbit rings ── */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-[400px] h-[400px] rounded-full" style={{ border: '1px solid rgba(255,255,255,0.04)' }} />
        <div className="absolute w-[500px] h-[500px] rounded-full" style={{ border: '1px solid rgba(255,255,255,0.02)' }} />
      </div>
    </div>
  );
};
