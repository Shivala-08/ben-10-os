'use client';

import React, { useState, useRef, useEffect } from 'react';

interface TerminalInputProps {
  onExecute: (command: string) => void;
  onHistoryUp: (current: string) => string;
  onHistoryDown: () => string;
  isLoading: boolean;
}

export function TerminalInput({ onExecute, onHistoryUp, onHistoryDown, isLoading }: TerminalInputProps) {
  const [value, setValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  // Keep input focused automatically
  useEffect(() => {
    const focusInput = () => {
      if (inputRef.current) {
        inputRef.current.focus();
      }
    };
    
    focusInput();
    
    // Global listener to keep input active on canvas click
    window.addEventListener('click', focusInput);
    return () => window.removeEventListener('click', focusInput);
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (isLoading) {
      e.preventDefault();
      return;
    }

    if (e.key === 'Enter') {
      const trimmed = value.trim();
      if (trimmed) {
        onExecute(trimmed);
        setValue('');
      }
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      const histCmd = onHistoryUp(value);
      setValue(histCmd);
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      const histCmd = onHistoryDown();
      setValue(histCmd);
    }
  };

  return (
    <div className="flex items-center gap-1.5 border-t border-[#00FF41]/10 pt-3 mt-auto w-full select-none">
      {/* Console Prompt */}
      <span className="font-mono text-[#00FF41] font-bold text-[12px] uppercase tracking-wider drop-shadow-[0_0_3px_rgba(0,255,65,0.3)]">
        OMNITRIX_OS &gt;
      </span>

      {/* Hidden input field, but operational */}
      <div className="flex-1 relative flex items-center">
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={isLoading}
          className="absolute inset-0 opacity-0 cursor-text w-full z-10 pointer-events-auto"
          autoComplete="off"
          autoCapitalize="off"
          spellCheck={false}
        />
        
        {/* Mirror value representation on screen with flashing cursor */}
        <div className="font-mono text-[12px] uppercase text-[#00FF41] tracking-wide flex items-center gap-0.5 selection:bg-[#00FF41]/25 select-text drop-shadow-[0_0_3px_rgba(0,255,65,0.25)]">
          <span>{value}</span>
          {!isLoading && (
            <span className="w-1.5 h-3.5 bg-[#00FF41] animate-[cursor-blink_0.8s_infinite] drop-shadow-[0_0_4px_#00FF41]" />
          )}
          {isLoading && (
            <span className="text-[10px] text-[#FFCC00] ml-2 select-none animate-pulse">
              [PROCESSING...]
            </span>
          )}
        </div>
      </div>

      <style jsx>{`
        @keyframes cursor-blink {
          0%, 49% { opacity: 1; }
          50%, 100% { opacity: 0; }
        }
      `}</style>
    </div>
  );
}
export default TerminalInput;
