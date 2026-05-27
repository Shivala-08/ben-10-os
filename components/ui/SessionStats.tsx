'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useOmnitrixStore } from '@/lib/store/useOmnitrixStore';
import { getHistory, getMostUsedAlien, getTotalSessionTime } from '@/lib/utils/history';
import { BIG_10_NAMES } from '@/lib/api/ben10';
import { synth } from '@/lib/utils/WebAudioSynth';

export function SessionStats() {
  const [isOpen, setIsOpen] = useState(true);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [stats, setStats] = useState({
    totalTransformations: 0,
    mostUsed: null as { name: string; count: number } | null,
    totalTimeSpent: 0
  });

  const unlockedCount = useOmnitrixStore((state) => state.unlockedAliens.length);
  const totalAliens = BIG_10_NAMES.length;

  const refreshStats = () => {
    const history = getHistory();
    setStats({
      totalTransformations: history.length,
      mostUsed: getMostUsedAlien(),
      totalTimeSpent: getTotalSessionTime()
    });
  };

  useEffect(() => {
    refreshStats();

    // Re-verify on history updates
    window.addEventListener('omnitrix_history_updated', refreshStats);
    // Also track storage events (like unlock)
    const storeSub = useOmnitrixStore.subscribe(() => {
      refreshStats();
    });

    // Session time tracking
    const startTime = Date.now();
    const interval = setInterval(() => {
      setElapsedTime(Math.round((Date.now() - startTime) / 1000));
    }, 1000);

    return () => {
      window.removeEventListener('omnitrix_history_updated', refreshStats);
      storeSub();
      clearInterval(interval);
    };
  }, []);

  const toggleStats = () => {
    setIsOpen(!isOpen);
    synth.playClick();
  };

  const formatSessionTime = (totalSeconds: number) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    const pad = (num: number) => String(num).padStart(2, '0');
    return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
  };

  return (
    <div className="fixed bottom-8 left-8 z-40 pointer-events-auto font-mono text-[11px]">
      <AnimatePresence mode="wait">
        {!isOpen ? (
          <motion.button
            key="collapsed"
            initial={{ opacity: 0, scale: 0.95, y: 5 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 5 }}
            onClick={toggleStats}
            className="px-3 py-1.5 bg-black/80 hover:bg-black border border-[#00FF41]/30 hover:border-[#00FF41] rounded text-[#00FF41] tracking-widest uppercase transition-all duration-300 shadow-[0_0_15px_rgba(0,255,65,0.15)] flex items-center gap-2 select-none"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#00FF41] animate-ping" />
            <span>SYS STATS</span>
          </motion.button>
        ) : (
          <motion.div
            key="expanded"
            initial={{ opacity: 0, scale: 0.95, y: 5 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 5 }}
            className="w-56 bg-black/90 border border-[#00FF41]/40 rounded-md p-4 shadow-[0_0_25px_rgba(0,255,65,0.15)] relative overflow-hidden backdrop-blur-md"
          >
            {/* Scanline CRT simulation */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%)] bg-[size:100%_4px] pointer-events-none" />

            <div className="flex justify-between items-center border-b border-[#00FF41]/20 pb-2 mb-3 select-none">
              <span className="text-[#00FF41] font-bold tracking-widest uppercase flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#00FF41] animate-pulse" />
                BIOMETRICS HUD
              </span>
              <button
                onClick={toggleStats}
                className="text-[#00FF41]/50 hover:text-[#00FF41] transition-colors"
                title="Collapse Panel"
              >
                [-]
              </button>
            </div>

            <div className="space-y-2 text-white/80 select-none uppercase tracking-wide">
              <div className="flex justify-between items-center">
                <span className="text-white/45">SYS RUNTIME:</span>
                <span className="text-[#00FF41] font-bold">{formatSessionTime(elapsedTime)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-white/45">DNA MUTATED:</span>
                <span className="text-[#00FF41] font-bold">
                  {unlockedCount} / {totalAliens}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-white/45">TRANSFORMS:</span>
                <span className="text-[#00FF41] font-bold">{stats.totalTransformations}</span>
              </div>
              
              <div className="border-t border-[#00FF41]/10 pt-2 mt-2 space-y-1.5">
                <div className="text-[9px] text-white/30 tracking-wider">PRIMARY COMBAT HERO:</div>
                {stats.mostUsed ? (
                  <div className="flex flex-col">
                    <span className="text-[#00FF41] font-bold text-[10px] truncate max-w-full">
                      {stats.mostUsed.name}
                    </span>
                    <span className="text-[8px] text-white/40 lowercase mt-0.5">
                      ({stats.mostUsed.count} activations)
                    </span>
                  </div>
                ) : (
                  <div className="text-[#00FF41]/35 text-[9px] tracking-wide italic">
                    NO ENGAGEMENT DATA
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
