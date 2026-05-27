'use client';

import React from 'react';
import { Alien } from '@/lib/api/types';
import { BIG_10_NAMES } from '@/lib/api/ben10';
import { synth } from '@/lib/utils/WebAudioSynth';

interface DNAMixerProps {
  slotA: Alien | null;
  slotB: Alien | null;
  onRemoveSlot: (slot: 'A' | 'B') => void;
  isFusing: boolean;
}

export function DNAMixer({ slotA, slotB, onRemoveSlot, isFusing }: DNAMixerProps) {
  const renderSlot = (slot: Alien | null, label: string, slotId: string, removeType: 'A' | 'B') => {
    const formattedId = slot?.general.name.toLowerCase().replace(' ', '_');
    const isMainRoster = slot ? BIG_10_NAMES.includes(slot.general.name) : false;

    return (
      <div 
        id={slotId}
        className={`w-36 h-44 rounded-md border flex flex-col items-center justify-center relative overflow-hidden select-none transition-all duration-300 ${
          slot 
            ? 'border-[#00FF41] bg-[#00FF41]/5 shadow-[0_0_15px_rgba(0,255,65,0.15)]' 
            : 'border-dashed border-[#00FF41]/20 bg-black/40 hover:border-[#00FF41]/40'
        }`}
      >
        {/* Hologram details */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(0,255,65,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,65,0.02)_1px,transparent_1px)] bg-[size:6px_6px] pointer-events-none" />

        {slot ? (
          <div className="flex flex-col items-center justify-center p-4 relative z-10 w-full h-full text-center">
            {/* Remove button */}
            <button
              onClick={() => {
                onRemoveSlot(removeType);
                synth.playAccessDenied();
              }}
              className="absolute top-2 right-2 w-4 h-4 bg-red-950/80 hover:bg-red-800 border border-red-500/40 hover:border-red-500 rounded text-red-400 text-[8px] font-bold flex items-center justify-center transition-colors cursor-pointer select-none"
              title="Purge DNA"
            >
              X
            </button>

            {/* Thumbnail */}
            <div className="w-16 h-16 bg-black/60 rounded border border-[#00FF41]/20 flex items-center justify-center overflow-hidden mb-3">
              {isMainRoster ? (
                <img
                  src={`/aliens/${formattedId}.png`}
                  alt={slot.general.name}
                  className="w-12 h-12 object-contain drop-shadow-[0_0_6px_rgba(0,255,65,0.4)]"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center p-1 bg-[radial-gradient(circle_at_center,transparent_30%,#000_90%)]">
                  <span className="w-2.5 h-2.5 bg-[#00FF41] rounded-full animate-ping" />
                </div>
              )}
            </div>

            <span className="font-mono text-[10px] text-[#00FF41] font-bold uppercase tracking-wider truncate w-full">
              {slot.general.name}
            </span>
            <span className="font-mono text-[7px] text-white/40 uppercase tracking-widest truncate w-full mt-0.5">
              {slot.general.species}
            </span>
          </div>
        ) : (
          <div className="text-center p-4 flex flex-col items-center pointer-events-none">
            <span className="text-[20px] text-[#00FF41]/30 mb-2">📥</span>
            <span className="font-mono text-[9px] text-[#00FF41]/40 uppercase font-bold tracking-widest">
              {label}
            </span>
            <span className="font-mono text-[7px] text-[#00FF41]/20 uppercase tracking-wider mt-1">
              DRAG CARD HERE
            </span>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="flex flex-col sm:flex-row gap-6 items-center justify-center w-full select-none relative">
      {/* Slot A */}
      {renderSlot(slotA, 'DNA CORE A', 'slot-a', 'A')}

      {/* Double Helix Anim in center */}
      <div className="flex flex-col items-center justify-center py-4 sm:py-0 w-28 relative h-36 select-none z-10">
        <div 
          className={`w-16 h-16 rounded-full border-2 border-[#00FF41]/20 flex items-center justify-center relative ${
            isFusing ? 'animate-spin border-t-[#00FF41] border-[#00FF41]/80 shadow-[0_0_20px_rgba(0,255,65,0.4)]' : ''
          }`}
        >
          {/* Animated matrix DNA double helix */}
          <div className="flex items-center gap-1.5 h-10 select-none">
            <div className="w-1 h-8 bg-[#00FF41]/30 rounded animate-[helix-bounce_1s_infinite_alternate]" />
            <div className="w-1 h-5 bg-[#00FF41]/50 rounded animate-[helix-bounce_1s_infinite_alternate_0.2s]" />
            <div className="w-1 h-3 bg-[#00FF41]/80 rounded animate-[helix-bounce_1s_infinite_alternate_0.4s]" />
            <div className="w-1 h-5 bg-[#00FF41]/50 rounded animate-[helix-bounce_1s_infinite_alternate_0.6s]" />
            <div className="w-1 h-8 bg-[#00FF41]/30 rounded animate-[helix-bounce_1s_infinite_alternate_0.8s]" />
          </div>
        </div>
        <span className="font-mono text-[8px] text-[#00FF41]/40 uppercase tracking-widest mt-2 select-none">
          {isFusing ? 'MIXING...' : 'MATRIX_LOCK'}
        </span>
      </div>

      {/* Slot B */}
      {renderSlot(slotB, 'DNA CORE B', 'slot-b', 'B')}

      <style jsx>{`
        @keyframes helix-bounce {
          0% { transform: scaleY(0.2); }
          100% { transform: scaleY(1.0); }
        }
      `}</style>
    </div>
  );
}
export default DNAMixer;
