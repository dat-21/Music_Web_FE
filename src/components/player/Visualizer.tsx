import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface VisualizerProps {
  isPlaying: boolean;
  barCount?: number;
  color?: string;
}

export const Visualizer: React.FC<VisualizerProps> = ({ isPlaying, barCount = 32, color = 'bg-white' }) => {
  const [bars, setBars] = useState<number[]>(Array(barCount).fill(10));

  useEffect(() => {
    if (!isPlaying) {
      setBars(Array(barCount).fill(10));
      return;
    }
    
    // Fake audio visualizer effect
    const interval = setInterval(() => {
      setBars(prev => prev.map(() => Math.floor(Math.random() * 80) + 10));
    }, 100);

    return () => clearInterval(interval);
  }, [isPlaying, barCount]);

  return (
    <div className="flex items-end justify-center gap-1 h-24 w-full opacity-60 overflow-hidden">
      {bars.map((height, i) => (
        <motion.div
          key={i}
          className={`w-1.5 md:w-2 ${color} rounded-t-sm shadow-[0_0_8px_currentColor]`}
          animate={{ height: `${height}%` }}
          transition={{ type: 'tween', duration: 0.1, ease: 'linear' }}
        />
      ))}
    </div>
  );
};
