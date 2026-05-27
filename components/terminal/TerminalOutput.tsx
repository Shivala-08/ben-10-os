'use client';

import React from 'react';
import { TerminalLine } from '@/hooks/useTerminal';

interface TerminalOutputProps {
  lines: TerminalLine[];
}

export function TerminalOutput({ lines }: TerminalOutputProps) {
  const getLineClass = (type: TerminalLine['type']) => {
    switch (type) {
      case 'input':
        return 'text-white/80 font-bold';
      case 'system':
        return 'text-[#FFCC00] font-semibold drop-shadow-[0_0_5px_rgba(255,204,0,0.3)]';
      case 'error':
        return 'text-[#FF4444] font-bold drop-shadow-[0_0_5px_rgba(255,68,68,0.4)] animate-pulse';
      case 'output':
      default:
        return 'text-[#00FF41] font-medium drop-shadow-[0_0_3px_rgba(0,255,65,0.25)]';
    }
  };

  return (
    <div className="flex-1 flex flex-col space-y-1.5 py-4 w-full select-text selection:bg-[#00FF41]/20 selection:text-white">
      {lines.map((line) => (
        <div 
          key={line.id} 
          className={`font-mono text-[12px] leading-relaxed uppercase whitespace-pre-wrap ${getLineClass(line.type)}`}
        >
          {line.text}
        </div>
      ))}
    </div>
  );
}
export default TerminalOutput;
