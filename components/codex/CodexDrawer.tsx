'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Alien } from '@/lib/api/types';
import { BIG_10_NAMES } from '@/lib/api/ben10';
import { useOmnitrixStore } from '@/lib/store/useOmnitrixStore';
import { synth } from '@/lib/utils/WebAudioSynth';

interface CodexDrawerProps {
  alien: Alien | null;
  onClose: () => void;
}

export function CodexDrawer({ alien, onClose }: CodexDrawerProps) {
  const unlockAlien = useOmnitrixStore((state) => state.unlockAlien);
  const setActiveAlien = useOmnitrixStore((state) => state.setActiveAlien);
  const setIsTransforming = useOmnitrixStore((state) => state.setIsTransforming);

  if (!alien) return null;

  const name = alien.general.name;
  const species = alien.general.species;
  const homeWorld = alien.general.homeWorld;
  const series = alien.series;
  const abilities = alien.abilities;
  const formattedId = name.toLowerCase().replace(' ', '_');
  const isMainRoster = BIG_10_NAMES.includes(name);

  const handleActivate = () => {
    synth.playTransform();
    setIsTransforming(true);
    unlockAlien(formattedId);
    onClose();

    // Small timeout for visual blast transition
    setTimeout(() => {
      setActiveAlien(formattedId);
      setIsTransforming(false);
    }, 600);
  };

  return (
    <>
      {/* Drawer Overlay Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/60 backdrop-blur-[2px] z-50 pointer-events-auto cursor-pointer"
      />

      {/* Slide-in details panel */}
      <motion.div
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', damping: 22, stiffness: 180 }}
        className="fixed top-0 right-0 h-full w-full max-w-md bg-black/95 border-l border-[#00FF41]/30 z-50 flex flex-col p-6 shadow-[-10px_0_30px_rgba(0,255,65,0.15)] pointer-events-auto font-mono text-white select-none overflow-y-auto"
      >
        {/* CRT Scanline Filter */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.3)_50%)] bg-[size:100%_4px] pointer-events-none" />

        {/* Header Title */}
        <div className="flex justify-between items-center border-b border-[#00FF41]/30 pb-4 mb-6 select-none relative z-10">
          <div>
            <h2 className="text-[#00FF41] text-lg font-bold tracking-widest uppercase drop-shadow-[0_0_5px_#00FF41]">
              ⬡ DNA_SPECIMEN_CARD
            </h2>
            <div className="text-[9px] text-[#00FF41]/40 tracking-wider uppercase mt-0.5">
              DATABASE PROFILE REFERENCE
            </div>
          </div>
          <button
            onClick={() => {
              onClose();
              synth.playClick();
            }}
            className="text-[#00FF41]/60 hover:text-[#00FF41] text-xs font-semibold tracking-widest uppercase transition-colors"
          >
            [CLOSE]
          </button>
        </div>

        {/* Thumbnail Image / Scanner */}
        <div className="w-full h-48 bg-black/80 rounded border border-[#00FF41]/20 flex items-center justify-center relative overflow-hidden mb-6 z-10">
          {isMainRoster ? (
            <img
              src={`/aliens/${formattedId}.png`}
              alt={name}
              className="w-40 h-40 object-contain drop-shadow-[0_0_15px_rgba(0,255,65,0.5)] scale-110"
              loading="eager"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center bg-[linear-gradient(rgba(0,255,65,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,65,0.02)_1px,transparent_1px)] bg-[size:8px_8px]">
              <div className="w-16 h-16 rounded-full border-2 border-dashed border-[#00FF41]/40 flex items-center justify-center animate-spin">
                <span className="w-4 h-4 bg-[#00FF41] rounded-full animate-ping" />
              </div>
              <span className="font-mono text-[9px] text-[#00FF41]/40 uppercase tracking-[0.25em] mt-3 animate-pulse">
                CELLULAR_RESOLVER_SWEEPING
              </span>
            </div>
          )}
        </div>

        {/* Diagnostic Metadata Fields */}
        <div className="space-y-4 text-xs select-text relative z-10">
          <div className="flex flex-col border-b border-[#00FF41]/10 pb-2.5">
            <span className="text-white/40 uppercase text-[9px] tracking-wider mb-0.5">DNA PROFILE NAME</span>
            <span className="text-[#00FF41] font-bold uppercase text-sm drop-shadow-[0_0_3px_rgba(0,255,65,0.3)]">{name}</span>
          </div>

          <div className="flex flex-col border-b border-[#00FF41]/10 pb-2.5">
            <span className="text-white/40 uppercase text-[9px] tracking-wider mb-0.5">SPECIES CODEX</span>
            <span className="text-white font-semibold uppercase">{species}</span>
          </div>

          <div className="flex flex-col border-b border-[#00FF41]/10 pb-2.5">
            <span className="text-white/40 uppercase text-[9px] tracking-wider mb-0.5">HOME PLANET WORLD</span>
            <span className="text-white font-semibold uppercase">{homeWorld}</span>
          </div>

          <div className="flex flex-col border-b border-[#00FF41]/10 pb-2.5">
            <span className="text-white/40 uppercase text-[9px] tracking-wider mb-0.5">CHRONOLOGICAL DATABASE CATEGORY</span>
            <span className="text-white font-semibold uppercase">{series}</span>
          </div>

          <div className="flex flex-col mb-4">
            <span className="text-white/40 uppercase text-[9px] tracking-wider mb-1.5">MUTATION SKILLS / ABILITIES</span>
            <div className="flex flex-wrap gap-1.5 pr-2 select-none">
              {abilities.map((ab) => (
                <span
                  key={ab}
                  className="px-2 py-0.5 rounded bg-[#00FF41]/5 hover:bg-[#00FF41]/15 border border-[#00FF41]/10 text-white/90 uppercase text-[9px] font-medium tracking-wide transition-colors"
                >
                  {ab}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Dynamic Action Buttons Footer */}
        <div className="mt-auto border-t border-[#00FF41]/20 pt-5 relative z-10 select-none">
          {isMainRoster ? (
            <button
              onClick={handleActivate}
              className="w-full py-3 bg-[#00FF41]/15 hover:bg-[#00FF41]/30 border border-[#00FF41] hover:border-[#00FF41] text-[#00FF41] rounded font-bold uppercase tracking-widest text-[11px] text-center transition-all duration-300 shadow-[0_0_15px_rgba(0,255,65,0.2)] hover:shadow-[0_0_25px_rgba(0,255,65,0.4)]"
            >
              ACTIVATE OMNITRIX CORE
            </button>
          ) : (
            <div className="w-full py-3 bg-red-950/20 border border-red-500/20 text-red-400 rounded font-mono text-[10px] tracking-widest uppercase font-bold text-center animate-pulse">
              [NOT IN OMNITRIX ROSTER]
            </div>
          )}
        </div>
      </motion.div>
    </>
  );
}
export default CodexDrawer;
