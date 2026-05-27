'use client';

import React from 'react';
import { OmnitrixClock } from '@/components/ui/OmnitrixClock';
import { Screensaver } from '@/components/ui/Screensaver';
import { useRouter } from 'next/navigation';
import { synth } from '@/lib/utils/WebAudioSynth';

export default function ClockPage() {
  const router = useRouter();

  const handleBack = () => {
    synth.playClick();
    router.push('/');
  };

  return (
    <main className="w-full min-h-screen bg-black text-[#00FF41] font-mono flex flex-col items-center p-6 overflow-hidden relative select-none">
      {/* Dynamic 60 seconds Inactivity Screensaver overlay */}
      <Screensaver />

      {/* Repeating CRT lines grid */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.3)_50%)] bg-[size:100%_4px] pointer-events-none z-0 opacity-80" />

      {/* Diagnostics Header Banners */}
      <div className="w-full flex justify-between items-center border-b border-[#00FF41]/20 pb-4 mb-16 select-none relative z-10">
        <div className="flex items-center gap-3">
          <button
            onClick={handleBack}
            className="px-2.5 py-1 bg-black/60 border border-[#00FF41]/30 hover:border-[#00FF41] rounded text-[#00FF41]/75 hover:text-[#00FF41] text-[10px] uppercase font-bold tracking-widest transition-all duration-300"
          >
            [BACK]
          </button>
          <span className="w-2.5 h-2.5 bg-[#00FF41] rounded-full animate-pulse drop-shadow-[0_0_5px_#00FF41]" />
          <h1 className="text-sm md:text-base font-bold tracking-[0.25em] uppercase select-none drop-shadow-[0_0_4px_rgba(0,255,65,0.4)]">
            ⬡ OMNITRIX_STANDBY_CLOCK
          </h1>
        </div>
        <div className="text-[10px] text-[#00FF41]/45 tracking-widest font-semibold uppercase hidden sm:block">
          SYS_TIMEFEED: CHRONO_MODULE SECURED
        </div>
      </div>

      {/* Analog/Digital Core clock widget */}
      <div className="flex-1 flex items-center justify-center relative z-10 w-full pb-12">
        <OmnitrixClock />
      </div>
    </main>
  );
}
