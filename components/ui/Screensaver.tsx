'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { synth } from '@/lib/utils/WebAudioSynth';

export function Screensaver() {
  const [isActive, setIsActive] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const resetTimer = () => {
    if (isActive) {
      setIsActive(false);
      synth.playClick();
    }
    
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    // 60 seconds spec inactivity timer
    timeoutRef.current = setTimeout(() => {
      setIsActive(true);
      synth.playMalfunction();
    }, 60000);
  };

  useEffect(() => {
    // Register global event trackers for active presence
    window.addEventListener('mousemove', resetTimer);
    window.addEventListener('keydown', resetTimer);
    window.addEventListener('touchstart', resetTimer);
    window.addEventListener('click', resetTimer);

    // Initialise trigger timer
    resetTimer();

    return () => {
      window.removeEventListener('mousemove', resetTimer);
      window.removeEventListener('keydown', resetTimer);
      window.removeEventListener('touchstart', resetTimer);
      window.removeEventListener('click', resetTimer);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [isActive]);

  return (
    <AnimatePresence>
      {isActive && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.0 }}
          className="fixed inset-0 z-[150] bg-[#000000] flex flex-col items-center justify-center font-mono pointer-events-auto cursor-none select-none"
        >
          {/* Glass CRT filter */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.3)_50%)] bg-[size:100%_4px] pointer-events-none opacity-80" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_30%,rgba(0,0,0,0.85)_95%)] pointer-events-none" />

          {/* STANDBY floating core hourglass logo */}
          <div className="flex flex-col items-center space-y-8 animate-[pulse_4s_infinite_alternate]">
            {/* Spinning vector hourglass outline */}
            <div className="relative w-28 h-28 border-[3px] border-[#00FF41] rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(0,255,65,0.4)] animate-[spin_24s_linear_infinite]">
              {/* Internal green triangles */}
              <div className="w-16 h-16 bg-[#00FF41]/10 border border-[#00FF41]/30 rotate-45 rounded" />
              <div className="absolute w-8 h-8 bg-[#00FF41]/80 rounded-sm" />
            </div>

            <div className="text-center space-y-2">
              <h2 className="text-[#00FF41] text-lg font-bold tracking-[0.3em] uppercase drop-shadow-[0_0_5px_#00FF41]">
                OMNITRIX OS // STANDBY
              </h2>
              <p className="text-[#00FF41]/40 text-[9px] tracking-widest uppercase">
                Biometric scanner online // Press key to wake
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
export default Screensaver;
