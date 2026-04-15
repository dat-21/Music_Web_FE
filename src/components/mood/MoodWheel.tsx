import { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MOCK_MOODS } from '@/lib/mockData';
import { FaPlay } from 'react-icons/fa';

export const MoodWheel = () => {
  const [activeMood, setActiveMood] = useState(MOCK_MOODS[0]);
  const [hoveredMood, setHoveredMood] = useState<string | null>(null);
  const [isTouchLayout, setIsTouchLayout] = useState(false);

  const activeIndex = MOCK_MOODS.findIndex((mood) => mood.id === activeMood.id);
  const orbitRadius = isTouchLayout ? 108 : 200;
  const coreSize = isTouchLayout ? 152 : 208;
  const glowSize = isTouchLayout ? 320 : 500;
  const ringSize = orbitRadius * 2;
  const ringOuterSize = isTouchLayout ? ringSize + 72 : ringSize + 100;

  useEffect(() => {
    const mediaQuery = window.matchMedia('(max-width: 640px)');

    const updateLayout = () => {
      setIsTouchLayout(mediaQuery.matches);
    };

    updateLayout();

    const onChange = (event: MediaQueryListEvent) => {
      setIsTouchLayout(event.matches);
    };

    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', onChange);
      return () => mediaQuery.removeEventListener('change', onChange);
    }

    mediaQuery.addListener(onChange);
    return () => mediaQuery.removeListener(onChange);
  }, []);

  const wheelHeight = useMemo(() => {
    return isTouchLayout ? 320 : 480;
  }, [isTouchLayout]);

  return (
    <div
      className="relative mx-auto flex w-full max-w-2xl items-center justify-center overflow-visible"
      style={{ minHeight: 280, height: wheelHeight }}
    >
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <div
          className="animate-pulse-glow rounded-full"
          style={{
            width: glowSize,
            height: glowSize,
            background: 'radial-gradient(circle, rgba(0,229,255,0.10) 0%, rgba(179,136,255,0.06) 40%, transparent 70%)',
          }}
        />
      </div>

      <motion.div
        className="pointer-events-none absolute inset-0 flex items-center justify-center"
        animate={{ rotate: -(activeIndex * (360 / MOCK_MOODS.length)) }}
        transition={{ type: 'spring', damping: 24, stiffness: 110 }}
      >
        {MOCK_MOODS.map((mood, index) => {
          const angle = (index / MOCK_MOODS.length) * Math.PI * 2 - Math.PI / 2;
          const x = Math.cos(angle) * orbitRadius;
          const y = Math.sin(angle) * orbitRadius;
          const isHovered = hoveredMood === mood.id;
          const isActive = activeMood.id === mood.id;

          return (
            <motion.div key={mood.id} className="absolute" style={{ x, y }}>
              <div className="pointer-events-auto" style={{ transform: `rotate(${activeIndex * (360 / MOCK_MOODS.length)}deg)` }}>
                <button
                  type="button"
                  onClick={() => setActiveMood(mood)}
                  onPointerEnter={() => setHoveredMood(mood.id)}
                  onPointerLeave={() => setHoveredMood(null)}
                  onPointerDown={() => setHoveredMood(mood.id)}
                  onPointerUp={() => setHoveredMood(null)}
                  onPointerCancel={() => setHoveredMood(null)}
                  className={`relative flex items-center justify-center rounded-full transition-all duration-300 ${
                    isActive ? 'pointer-events-none scale-0 opacity-0' : 'cursor-pointer'
                  }`}
                  style={{
                    width: isTouchLayout ? 54 : 64,
                    height: isTouchLayout ? 54 : 64,
                    background: isHovered ? 'rgba(255,255,255,0.10)' : 'rgba(255,255,255,0.04)',
                    border: `1px solid ${isHovered ? 'rgba(0,229,255,0.35)' : 'rgba(255,255,255,0.06)'}`,
                    backdropFilter: 'blur(12px)',
                    boxShadow: isHovered
                      ? '0 0 20px rgba(0,229,255,0.16), inset 0 0 10px rgba(0,229,255,0.05)'
                      : '0 4px 16px rgba(0,0,0,0.4)',
                    transform: isHovered ? 'scale(1.15)' : 'scale(1)',
                  }}
                >
                  <mood.icon
                    size={isTouchLayout ? 18 : 22}
                    style={{
                      color: isHovered ? 'var(--color-accent-neon)' : 'rgba(255,255,255,0.30)',
                      filter: isHovered ? 'drop-shadow(0 0 8px rgba(0,229,255,0.6))' : 'none',
                      transition: 'all 0.2s ease',
                    }}
                  />
                </button>
              </div>
            </motion.div>
          );
        })}
      </motion.div>

      <motion.div
        className="absolute z-30 flex items-center justify-center overflow-hidden rounded-full"
        style={{
          width: coreSize,
          height: coreSize,
          background: 'radial-gradient(circle at 30% 30%, rgba(15,18,35,1) 0%, rgba(5,7,15,1) 100%)',
          border: '1px solid rgba(255,255,255,0.06)',
          boxShadow: '0 0 40px rgba(0,0,0,0.7), 0 0 80px rgba(0,229,255,0.05), inset 0 0 30px rgba(0,0,0,0.5)',
        }}
        initial={{ scale: 0.85 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', damping: 20 }}
      >
        <div
          className="pointer-events-none absolute inset-0 rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(0,229,255,0.10) 0%, rgba(179,136,255,0.06) 40%, transparent 70%)' }}
        />
        <div
          className="pointer-events-none absolute inset-0 rounded-full"
          style={{ background: 'radial-gradient(ellipse at 40% 30%, rgba(0,229,255,0.06) 0%, transparent 60%)' }}
        />

        <AnimatePresence mode="popLayout">
          <motion.div
            key={activeMood.id}
            initial={{ y: 16, opacity: 0, filter: 'blur(6px)' }}
            animate={{ y: 0, opacity: 1, filter: 'blur(0px)' }}
            exit={{ y: -16, opacity: 0, filter: 'blur(6px)' }}
            className="z-10 flex flex-col items-center gap-2.5"
          >
            <activeMood.icon
              size={isTouchLayout ? 28 : 36}
              style={{ color: 'var(--color-accent-neon)', filter: 'drop-shadow(0 0 12px rgba(0,229,255,0.45))' }}
            />
            <h3 className="text-center text-sm font-black uppercase tracking-[0.12em] text-white sm:text-base">
              {activeMood.name}
            </h3>
          </motion.div>
        </AnimatePresence>

        <button
          type="button"
          className="absolute bottom-4 z-20 flex h-10 w-10 items-center justify-center rounded-full transition-all duration-300 hover:scale-110 active:scale-95"
          style={{
            background: 'rgba(0,229,255,0.12)',
            border: '1px solid rgba(0,229,255,0.25)',
            color: 'var(--color-accent-neon)',
            boxShadow: '0 0 16px rgba(0,229,255,0.15)',
          }}
          onPointerEnter={(event) => {
            event.currentTarget.style.background = 'var(--gradient-accent-neon)';
            event.currentTarget.style.color = 'var(--color-bg-primary)';
            event.currentTarget.style.boxShadow = '0 0 20px rgba(0,229,255,0.35)';
          }}
          onPointerLeave={(event) => {
            event.currentTarget.style.background = 'rgba(0,229,255,0.12)';
            event.currentTarget.style.color = 'var(--color-accent-neon)';
            event.currentTarget.style.boxShadow = '0 0 16px rgba(0,229,255,0.15)';
          }}
        >
          <FaPlay size={12} className="ml-0.5" />
        </button>
      </motion.div>

      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <div className="rounded-full" style={{ width: ringSize, height: ringSize, border: '1px solid rgba(255,255,255,0.04)' }} />
        <div className="absolute rounded-full" style={{ width: ringOuterSize, height: ringOuterSize, border: '1px solid rgba(255,255,255,0.02)' }} />
      </div>
    </div>
  );
};
