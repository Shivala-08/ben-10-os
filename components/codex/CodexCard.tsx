'use client';

import React from 'react';
import { Alien } from '@/lib/api/types';
import { BIG_10_NAMES } from '@/lib/api/ben10';
import { synth } from '@/lib/utils/WebAudioSynth';

interface CodexCardProps {
  alien: Alien;
  onClick: () => void;
}

export function CodexCard({ alien, onClick }: CodexCardProps) {
  const name = alien.general.name;
  const formattedId = name.toLowerCase().replace(' ', '_');
  const isMainRoster = BIG_10_NAMES.includes(name);

  const handleClick = () => {
    onClick();
    synth.playClick();
  };

  return (
    <div
      onClick={handleClick}
      className="group bg-black/60 hover:bg-black border border-[#00FF41]/20 hover:border-[#00FF41]/60 rounded-md p-4 flex flex-col items-center gap-3 transition-all duration-300 shadow-[0_0_10px_rgba(0,0,0,0.5)] hover:shadow-[0_0_20px_rgba(0,255,65,0.2)] cursor-pointer select-none relative overflow-hidden"
    >
      {/* Glitchy micro-borders on hover */}
      <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-[#00FF41]/0 group-hover:border-[#00FF41] transition-all duration-300" />
      <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-[#00FF41]/0 group-hover:border-[#00FF41] transition-all duration-300" />
      <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-[#00FF41]/0 group-hover:border-[#00FF41] transition-all duration-300" />
      <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-[#00FF41]/0 group-hover:border-[#00FF41] transition-all duration-300" />

      {/* Roster Image / Biometric Grid Placeholder */}
      <div className="w-24 h-24 bg-black/80 rounded border border-[#00FF41]/10 flex items-center justify-center relative overflow-hidden">
        {isMainRoster ? (
          /* Render Roster PNG image */
          <img
            src={`/aliens/${formattedId}.png`}
            alt={name}
            className="w-20 h-20 object-contain drop-shadow-[0_0_8px_rgba(0,255,65,0.4)] group-hover:scale-110 transition-transform duration-300"
            loading="lazy"
          />
        ) : (
          /* Render Holographic Radar scan simulation */
          <div className="w-full h-full flex flex-col items-center justify-center relative bg-[linear-gradient(rgba(0,255,65,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,65,0.02)_1px,transparent_1px)] bg-[size:6px_6px] p-2">
            {/* Blinking sensor node */}
            <div className="w-10 h-10 rounded-full border border-dashed border-[#00FF41]/30 flex items-center justify-center group-hover:animate-spin transition-all duration-[6s]">
              <span className="w-2 h-2 bg-[#00FF41] rounded-full animate-ping" />
            </div>
            {/* Holographic scanning vector line */}
            <div className="absolute top-0 left-0 w-full h-[1px] bg-[#00FF41]/30 animate-[radar-sweep_2s_linear_infinite]" />
            <span className="font-mono text-[7px] text-[#00FF41]/40 uppercase tracking-widest mt-1 select-none">
              UNRESOLVED DNA
            </span>
          </div>
        )}
      </div>

      {/* Info labels */}
      <div className="text-center w-full select-none">
        <h3 className="font-mono font-bold text-xs uppercase text-[#00FF41] tracking-wider truncate drop-shadow-[0_0_3px_rgba(0,255,65,0.25)]">
          {name}
        </h3>
        <p className="font-mono text-[9px] text-white/50 uppercase tracking-widest truncate mt-0.5">
          {alien.general.species}
        </p>
      </div>

      {/* Series Ribbon badge */}
      <div className="absolute top-2 right-2 px-1.5 py-0.5 bg-[#00FF41]/10 rounded border border-[#00FF41]/20 font-mono text-[7px] text-[#00FF41] uppercase font-bold tracking-widest select-none">
        {alien.series === 'Original' ? 'ORIGINAL' : alien.series}
      </div>

      <style jsx>{`
        @keyframes radar-sweep {
          0% { transform: translateY(0); }
          100% { transform: translateY(96px); }
        }
      `}</style>
    </div>
  );
}
export default CodexCard;
