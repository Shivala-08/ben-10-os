'use client';

import React, { useState } from 'react';
import { BattleRound } from '@/lib/battle/battleEngine';
import { motion } from 'framer-motion';
import { synth } from '@/lib/utils/WebAudioSynth';

interface BattleLogProps {
  rounds: BattleRound[];
  winnerName: string;
}

export function BattleLog({ rounds, winnerName }: BattleLogProps) {
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    synth.playClick();
    const text = `Omnitrix OS Battle Simulator Duel Result:\n${winnerName.toUpperCase()} conquered the arena! Check it out on OmnitrixOS!`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Omnitrix OS Battle Simulator',
          text,
          url: window.location.origin + '/battle'
        });
      } catch (e) {}
    } else {
      // Fallback: Copy URL and text to clipboard
      try {
        await navigator.clipboard.writeText(text + '\n' + window.location.origin + '/battle');
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (e) {}
    }
  };

  const getLineClass = (type: BattleRound['type']) => {
    switch (type) {
      case 'intro':
        return 'text-[#FFCC00] font-semibold';
      case 'verdict':
        return 'text-[#00FF41] font-bold drop-shadow-[0_0_4px_rgba(0,255,65,0.4)]';
      case 'clash':
      default:
        return 'text-white/80';
    }
  };

  return (
    <div className="w-full bg-black/80 border border-[#00FF41]/30 rounded p-5 flex flex-col gap-4 relative font-mono select-none overflow-hidden">
      {/* Scanline grid */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.3)_50%)] bg-[size:100%_4px] pointer-events-none" />

      <div className="flex justify-between items-center border-b border-[#00FF41]/20 pb-2 mb-1 select-none relative z-10">
        <span className="text-[10px] text-[#00FF41] font-bold tracking-widest uppercase">
          SYS_COMBAT_LOG_STREAM
        </span>
        <span className="text-[8px] text-[#00FF41]/40 uppercase tracking-widest">
          SYNC: COMPLETE
        </span>
      </div>

      {/* Rounds logs items scroll box */}
      <div className="max-h-60 overflow-y-auto space-y-2 pr-1 custom-scrollbar relative z-10 select-text selection:bg-[#00FF41]/20 selection:text-white">
        {rounds.map((r, index) => (
          <motion.div
            key={`${r.round}-${index}`}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.18 }} // Staggered reveal 180-200ms delay
            className={`text-[11px] leading-relaxed uppercase whitespace-pre-wrap ${getLineClass(r.type)}`}
          >
            {r.text}
          </motion.div>
        ))}
      </div>

      {/* Action Footer sharing block */}
      <div className="border-t border-[#00FF41]/20 pt-4 mt-1 flex justify-end relative z-10 select-none">
        <button
          onClick={handleShare}
          className="px-4 py-2 bg-[#00FF41]/10 hover:bg-[#00FF41]/20 border border-[#00FF41]/30 hover:border-[#00FF41] text-[#00FF41] rounded text-[10px] uppercase font-bold tracking-widest transition-all duration-300"
        >
          {copied ? 'OUTCOME COPIED!' : 'SHARE LOG OUTCOME'}
        </button>
      </div>
    </div>
  );
}
export default BattleLog;
