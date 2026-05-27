'use client';

import React, { useRef, useEffect } from 'react';
import { useTerminal } from '@/hooks/useTerminal';
import { ScanLines } from './ScanLines';
import { TerminalOutput } from './TerminalOutput';
import { TerminalInput } from './TerminalInput';
import { synth } from '@/lib/utils/WebAudioSynth';

export function Terminal() {
  const { lines, isLoading, historyUp, historyDown, executeCommand } = useTerminal();
  const scrollRef = useRef<HTMLDivElement>(null);

  // Play a computer hum ambient texture when entering terminal
  useEffect(() => {
    // Lazy trigger ambient sound context
    synth.playClick();
  }, []);

  // Automatically scroll output panel to the bottom when new console streams spawn
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [lines]);

  return (
    <div className="w-full h-screen bg-[#000000] text-[#00FF41] flex flex-col p-6 overflow-hidden relative select-none font-mono">
      {/* High-Tech Neon Glass Glassmorphic Scanline overlay */}
      <ScanLines />

      {/* Cybernetic Status Top Header */}
      <div className="flex justify-between items-center border-b border-[#00FF41]/20 pb-3 select-none relative z-10">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 bg-[#00FF41] rounded-full animate-pulse drop-shadow-[0_0_5px_#00FF41]" />
          <h1 className="text-[13px] font-bold tracking-[0.25em] uppercase select-none drop-shadow-[0_0_4px_rgba(0,255,65,0.4)]">
            ⬡ OMNITRIX_CONSOLE_CORE v2.0
          </h1>
        </div>
        <div className="text-[10px] text-[#00FF41]/45 tracking-widest font-semibold uppercase">
          SECURE CONNECTION // SYS_STATUS: OPERATIONAL
        </div>
      </div>

      {/* Console Outputs Scroll View */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto pr-1 my-4 scroll-smooth relative z-10 custom-scrollbar"
      >
        <TerminalOutput lines={lines} />
      </div>

      {/* Console Input Console Bar */}
      <div className="relative z-10 select-none">
        <TerminalInput 
          onExecute={executeCommand}
          onHistoryUp={historyUp}
          onHistoryDown={historyDown}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
}
export default Terminal;
