'use client';

import React, { useState } from 'react';
import { FusedAlien } from '@/types/fusion.types';
import { synth } from '@/lib/utils/WebAudioSynth';

interface FusionResultProps {
  fused: FusedAlien;
  onSave: () => void;
  isSaved: boolean;
}

export function FusionResult({ fused, onSave, isSaved }: FusionResultProps) {
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    synth.playClick();
    const text = `I synthesized a new DNA hybrid spec inside the Omnitrix Lab: [${fused.name.toUpperCase()}] (${fused.species.toUpperCase()})! Check out the DNA fusion on OmnitrixOS!`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Omnitrix DNA Fusion Lab',
          text,
          url: window.location.origin + '/lab'
        });
      } catch (e) {}
    } else {
      try {
        await navigator.clipboard.writeText(text + '\n' + window.location.origin + '/lab');
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (e) {}
    }
  };

  const handleSaveClick = () => {
    onSave();
    synth.playClick();
  };

  return (
    <div 
      className="w-full bg-black border border-[#00FF41]/40 p-6 rounded-md flex flex-col gap-6 relative font-mono text-white select-none overflow-hidden"
      style={{
        boxShadow: `0 0 25px ${fused.palette.glow}20`,
        borderColor: fused.palette.primary
      }}
    >
      {/* Curved CRT Filter */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.3)_50%)] bg-[size:100%_4px] pointer-events-none opacity-80" />
      
      {/* Hologram details */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(0,255,65,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,65,0.02)_1px,transparent_1px)] bg-[size:8px_8px] pointer-events-none" />

      {/* Header diagnostics */}
      <div className="flex justify-between items-center border-b border-[#00FF41]/20 pb-3 mb-1 select-none relative z-10" style={{ borderColor: `${fused.palette.primary}40` }}>
        <span className="text-[10px] font-bold tracking-widest uppercase flex items-center gap-1.5" style={{ color: fused.palette.primary }}>
          <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: fused.palette.primary }} />
          HYBRID DNA DIAGNOSTICS REPORT
        </span>
        <span className="text-[8px] uppercase tracking-widest text-white/40">
          STABILITY RATING: MAXIMUM SECURED
        </span>
      </div>

      <div className="flex flex-col md:flex-row gap-6 relative z-10 w-full">
        {/* Spliced Spec details */}
        <div className="flex-1 space-y-4">
          <div className="flex flex-col border-b border-white/5 pb-2">
            <span className="text-white/40 uppercase text-[8px] tracking-wider mb-0.5">SYNTHESIZED HYBRID NAME</span>
            <span className="font-bold uppercase text-lg drop-shadow-[0_0_5px_rgba(255,255,255,0.15)]" style={{ color: fused.palette.primary }}>
              {fused.name}
            </span>
          </div>

          <div className="flex flex-col border-b border-white/5 pb-2">
            <span className="text-white/40 uppercase text-[8px] tracking-wider mb-0.5">HYBRID SPECIES CLASS</span>
            <span className="text-white font-semibold uppercase">{fused.species}</span>
          </div>

          <div className="flex flex-col border-b border-white/5 pb-2">
            <span className="text-white/40 uppercase text-[8px] tracking-wider mb-0.5">FUSED CORES планетарный ORIGINS</span>
            <span className="text-white font-semibold uppercase">{fused.homeWorld}</span>
          </div>
        </div>

        {/* Fused Abilities List */}
        <div className="flex-1 flex flex-col">
          <span className="text-white/40 uppercase text-[8px] tracking-wider mb-2.5">INTEGRATED CELLULAR MUTATIONS</span>
          <div className="flex flex-wrap gap-1.5 pr-2 select-none">
            {fused.abilities.map((ab) => (
              <span
                key={ab}
                className="px-2 py-0.5 rounded bg-white/[0.03] hover:bg-white/[0.08] border text-white/90 uppercase text-[9px] font-medium tracking-wide transition-colors"
                style={{ borderColor: `${fused.palette.primary}20` }}
              >
                {ab}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Action triggers sharing/saving */}
      <div className="border-t border-[#00FF41]/20 pt-4 mt-1 flex justify-between relative z-10 select-none" style={{ borderColor: `${fused.palette.primary}40` }}>
        <button
          onClick={handleSaveClick}
          disabled={isSaved}
          className={`px-4 py-2 border rounded text-[10px] uppercase font-bold tracking-widest transition-all duration-300 ${
            isSaved
              ? 'bg-white/[0.04] border-white/10 text-white/35 cursor-not-allowed'
              : 'hover:bg-white/[0.05] cursor-pointer'
          }`}
          style={{ 
            borderColor: isSaved ? 'rgba(255,255,255,0.1)' : `${fused.palette.primary}60`,
            color: isSaved ? 'rgba(255,255,255,0.3)' : fused.palette.primary
          }}
        >
          {isSaved ? 'HYBRID CACHED' : 'SAVE HYBRID TO OS DECK'}
        </button>

        <button
          onClick={handleShare}
          className="px-4 py-2 border rounded text-[10px] uppercase font-bold tracking-widest transition-all duration-300 hover:bg-white/[0.05] cursor-pointer"
          style={{ borderColor: `${fused.palette.primary}60`, color: fused.palette.primary }}
        >
          {copied ? 'OUTCOME COPIED!' : 'SHARE DNA HYBRID'}
        </button>
      </div>
    </div>
  );
}
export default FusionResult;
