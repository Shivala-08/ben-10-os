'use client';

import React from 'react';
import { Alien } from '@/lib/api/types';
import { BIG_10_NAMES } from '@/lib/api/ben10';

interface BattleArenaProps {
  alienA: Alien | null;
  alienB: Alien | null;
  scoreA: number;
  scoreB: number;
  isFighting: boolean;
  winner: Alien | null;
}

export function BattleArena({ alienA, alienB, scoreA, scoreB, isFighting, winner }: BattleArenaProps) {
  const renderSpecimenCard = (alien: Alien | null, score: number, position: 'left' | 'right') => {
    if (!alien) {
      return (
        <div className="flex-1 min-h-[160px] border border-dashed border-[#00FF41]/20 rounded flex items-center justify-center font-mono text-[9px] text-[#00FF41]/30 uppercase tracking-widest text-center select-none bg-black/25">
          AWAITING CORES IDENTIFICATION...
        </div>
      );
    }

    const name = alien.general.name;
    const formattedId = name.toLowerCase().replace(' ', '_');
    const isMainRoster = BIG_10_NAMES.includes(name);
    const isWinner = winner && winner._id === alien._id;

    return (
      <div 
        className={`flex-1 border p-5 rounded-md flex flex-col items-center gap-4 transition-all duration-500 bg-black/60 relative overflow-hidden select-none ${
          isWinner 
            ? 'border-[#00FF41] shadow-[0_0_25px_rgba(0,255,65,0.3)] bg-[#00FF41]/5' 
            : 'border-[#00FF41]/20'
        }`}
      >
        {/* Hologram Vector Grid */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(0,255,65,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,65,0.02)_1px,transparent_1px)] bg-[size:6px_6px] pointer-events-none" />

        {/* Floating image or vector placeholder */}
        <div className="w-24 h-24 bg-black/90 rounded border border-[#00FF41]/20 flex items-center justify-center relative overflow-hidden">
          {isMainRoster ? (
            <img
              src={`/aliens/${formattedId}.png`}
              alt={name}
              className={`w-20 h-20 object-contain drop-shadow-[0_0_8px_rgba(0,255,65,0.4)] ${isFighting ? 'animate-[pulse_0.15s_infinite]' : ''}`}
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center bg-[radial-gradient(circle_at_center,transparent_30%,#000_90%)] relative">
              <div className="w-10 h-10 rounded-full border border-dashed border-[#00FF41]/30 flex items-center justify-center group-hover:animate-spin">
                <span className="w-2.5 h-2.5 bg-[#00FF41] rounded-full animate-ping" />
              </div>
              <div className="absolute top-0 left-0 w-full h-[1px] bg-[#00FF41]/20 animate-[radar-sweep_2s_linear_infinite]" />
            </div>
          )}
        </div>

        {/* Diagnostic Metadata details */}
        <div className="text-center w-full relative z-10">
          <h3 className="font-mono font-bold text-sm uppercase text-[#00FF41] tracking-wider drop-shadow-[0_0_3px_rgba(0,255,65,0.25)]">
            {name}
          </h3>
          <p className="font-mono text-[9px] text-white/50 uppercase tracking-widest truncate mt-0.5">
            {alien.general.species}
          </p>
          
          {/* Biometrics power ratings bar */}
          <div className="mt-4 flex flex-col space-y-1 w-full text-left">
            <div className="flex justify-between items-center text-[8px] text-white/40 tracking-wider">
              <span>MUTATION_RATING</span>
              <span className="text-[#00FF41] font-bold">{isFighting ? 'CALCULATING...' : `${score} RATING`}</span>
            </div>
            <div className="w-full h-1.5 bg-[#00FF41]/10 rounded border border-[#00FF41]/20 overflow-hidden relative">
              <div 
                className="h-full bg-[#00FF41] transition-all duration-1000 ease-out"
                style={{ 
                  width: isFighting ? '100%' : `${Math.min(100, Math.max(10, (score / 45) * 100))}%`,
                  animation: isFighting ? 'arena-bar-pulse 0.3s infinite alternate' : 'none'
                }}
              />
            </div>
          </div>
        </div>

        {isWinner && (
          <div className="absolute top-2 right-2 px-1.5 py-0.5 bg-[#00FF41] text-black font-mono text-[8px] uppercase font-black tracking-widest select-none rounded border border-[#00FF41] drop-shadow-[0_0_5px_#00FF41]">
            WINNER
          </div>
        )}

        <style jsx>{`
          @keyframes radar-sweep {
            0% { transform: translateY(0); }
            100% { transform: translateY(96px); }
          }
          @keyframes arena-bar-pulse {
            0% { opacity: 0.4; }
            100% { opacity: 1.0; }
          }
        `}</style>
      </div>
    );
  };

  return (
    <div className="w-full flex flex-col md:flex-row gap-8 items-stretch select-none relative">
      {/* Left Specimen */}
      {renderSpecimenCard(alienA, scoreA, 'left')}

      {/* VS separator block */}
      <div className="flex items-center justify-center font-mono font-black text-2xl text-[#00FF41] tracking-widest py-4 md:py-0 select-none relative z-10 self-center">
        {isFighting ? (
          <div className="w-12 h-12 rounded-full border border-[#00FF41]/50 border-t-transparent animate-spin flex items-center justify-center text-xs">
            ⚔️
          </div>
        ) : (
          <span className="drop-shadow-[0_0_10px_#00FF41] animate-pulse">VS</span>
        )}
      </div>

      {/* Right Specimen */}
      {renderSpecimenCard(alienB, scoreB, 'right')}
    </div>
  );
}
export default BattleArena;
