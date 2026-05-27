'use client';

import React from 'react';
import { AlienRadar } from '@/components/ui/AlienRadar';
import { useRouter } from 'next/navigation';
import { synth } from '@/lib/utils/WebAudioSynth';

export default function RadarPage() {
  const router = useRouter();

  const handleBack = () => {
    synth.playClick();
    router.push('/');
  };

  return (
    <main className="w-full min-h-screen bg-black text-[#00FF41] font-mono flex flex-col relative select-none overflow-hidden">
      {/* Laser line grid scanlines */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.3)_50%)] bg-[size:100%_4px] pointer-events-none z-20 opacity-80" />

      {/* Dynamic diagnostics header */}
      <div className="flex justify-between items-center border-b border-[#00FF41]/20 p-6 select-none relative z-20 bg-black/60 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <button
            onClick={handleBack}
            className="px-2.5 py-1 bg-black/60 border border-[#00FF41]/30 hover:border-[#00FF41] rounded text-[#00FF41]/75 hover:text-[#00FF41] text-[10px] uppercase font-bold tracking-widest transition-all duration-300"
          >
            [BACK]
          </button>
          <span className="w-2.5 h-2.5 bg-[#00FF41] rounded-full animate-pulse drop-shadow-[0_0_5px_#00FF41]" />
          <h1 className="text-sm md:text-base font-bold tracking-[0.25em] uppercase select-none drop-shadow-[0_0_4px_rgba(0,255,65,0.4)]">
            ⬡ OMNITRIX_SIGNAL_RADAR
          </h1>
        </div>
        <div className="text-[10px] text-[#00FF41]/45 tracking-widest font-semibold uppercase hidden sm:block">
          SYS_DETECTION: CORE SWEEPER ACTIVE
        </div>
      </div>

      {/* Radar Sweeper Fullscreen View */}
      <div className="flex-1 w-full h-full relative z-10">
        <AlienRadar />
      </div>
    </main>
  );
}
