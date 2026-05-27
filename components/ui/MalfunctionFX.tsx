'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useOmnitrixStore } from '@/lib/store/useOmnitrixStore';
import { BIG_10_NAMES } from '@/lib/api/ben10';
import { synth } from '@/lib/utils/WebAudioSynth';

export function MalfunctionFX() {
  const isMalfunctioning = useOmnitrixStore((state) => state.isMalfunctioning);
  const setIsMalfunctioning = useOmnitrixStore((state) => state.setIsMalfunctioning);
  const unlockAlien = useOmnitrixStore((state) => state.unlockAlien);
  const setActiveAlien = useOmnitrixStore((state) => state.setActiveAlien);

  const [slotIndex, setSlotIndex] = useState(0);
  const [glitchText, setGlitchText] = useState('CRITICAL MALFUNCTION');
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isMalfunctioning) {
      // Play high-tension malfunction audio
      synth.playMalfunction();

      // Fast-cycling slot machine ticker (50ms interval)
      let cycleCount = 0;
      const maxCycles = 50; // ~2.5 seconds of fast cycling

      const cycle = () => {
        setSlotIndex((prev) => (prev + 1) % BIG_10_NAMES.length);
        
        // Randomize glitchy text overlays
        const glitchPhrases = [
          'DNA_MUTATION_CORE_OVERLOAD',
          'OMNITRIX_MALFUNCTION_404',
          'MATRIX_INTEGRITY_FAIL',
          'BIOMETRIC_FEEDBACK_SPIKE',
          'OVERRIDE_SEQUENCE_DETECTED',
          'SYSTEM_KERNEL_CRASH'
        ];
        if (Math.random() > 0.7) {
          setGlitchText(glitchPhrases[Math.floor(Math.random() * glitchPhrases.length)]);
        }

        cycleCount++;
        if (cycleCount < maxCycles) {
          timerRef.current = setTimeout(cycle, 50);
        } else {
          // Finish and land on a random alien!
          const randomIndex = Math.floor(Math.random() * BIG_10_NAMES.length);
          const selectedAlienName = BIG_10_NAMES[randomIndex];
          const formattedId = selectedAlienName.toLowerCase().replace(' ', '_');

          setSlotIndex(randomIndex);
          setGlitchText('SEQUENCE LOCK: ' + selectedAlienName.toUpperCase());

          // Wait 1 second before forcing transformation into selected alien
          setTimeout(() => {
            // Unlock and activate
            unlockAlien(formattedId);
            setActiveAlien(formattedId);
            setIsMalfunctioning(false);
          }, 1200);
        }
      };

      timerRef.current = setTimeout(cycle, 50);
    }

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [isMalfunctioning, unlockAlien, setActiveAlien, setIsMalfunctioning]);

  return (
    <AnimatePresence>
      {isMalfunctioning && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[110] bg-black flex flex-col items-center justify-center font-mono pointer-events-auto select-none"
        >
          {/* Audio buzz looping or repeating */}
          {/* Static / Glitch screen background overlay */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_20%,#000_90%)] z-10 pointer-events-none" />
          <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.3)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[size:100%_4px,6px_100%] z-10 pointer-events-none opacity-80" />

          {/* Warning Grid */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(239,68,68,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(239,68,68,0.04)_1px,transparent_1px)] bg-[size:16px_16px] pointer-events-none" />

          {/* Scrolling glitch blocks */}
          <div className="absolute w-full h-1/4 bg-red-600/10 mix-blend-color-dodge top-[20%] left-0 animate-[pulse_0.1s_infinite] pointer-events-none" />
          <div className="absolute w-full h-1/6 bg-green-600/10 mix-blend-color-dodge bottom-[30%] left-0 animate-[pulse_0.15s_infinite] pointer-events-none" />

          <div className="z-20 text-center px-4 max-w-lg flex flex-col items-center">
            {/* Flashing danger triangle */}
            <motion.div
              animate={{ opacity: [1, 0, 1] }}
              transition={{ repeat: Infinity, duration: 0.3 }}
              className="text-red-500 text-6xl mb-4 font-bold"
            >
              ⚠️
            </motion.div>

            {/* Static Glitch Main Header */}
            <h2 className="text-red-500 text-3xl font-display font-black tracking-widest uppercase mb-2 drop-shadow-[0_0_10px_rgba(239,68,68,0.8)] animate-pulse">
              SYS_MALFUNCTION
            </h2>

            {/* Dynamic system log feeds */}
            <div className="text-[10px] text-red-400/70 border border-red-500/25 bg-red-950/20 px-3 py-1.5 rounded mb-8 uppercase tracking-widest text-center w-80 truncate h-8 flex items-center justify-center font-semibold">
              {glitchText}
            </div>

            {/* Slot-machine rotating alien roster */}
            <div className="relative h-28 w-80 border-y-2 border-red-500/40 bg-black/60 flex items-center justify-center overflow-hidden">
              <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-black to-transparent" />
              <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-black to-transparent" />
              
              <motion.div
                key={slotIndex}
                initial={{ y: 25, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -25, opacity: 0 }}
                transition={{ duration: 0.04 }}
                className="text-white text-2xl font-bold font-display uppercase tracking-widest text-center"
              >
                {BIG_10_NAMES[slotIndex]}
              </motion.div>
            </div>

            {/* Diagnostic system instructions */}
            <div className="text-[9px] text-white/40 tracking-widest uppercase mt-8 leading-relaxed max-w-xs">
              BIOMETRIC SYNCHRONIZATION OVERLOADED
              <br />
              LOCKING RANDOM DNA INDEX STRAND...
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
