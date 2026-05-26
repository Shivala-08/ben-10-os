'use client';

import React from 'react';
import { useOmnitrixStore } from '@/lib/store/useOmnitrixStore';
import { themes } from '@/lib/themes';

export function NavBar() {
  const activeAlien = useOmnitrixStore((state) => state.activeAlien);
  const setActiveAlien = useOmnitrixStore((state) => state.setActiveAlien);
  const isMuted = useOmnitrixStore((state) => state.isMuted);
  const setIsMuted = useOmnitrixStore((state) => state.setIsMuted);
  const bootComplete = useOmnitrixStore((state) => state.bootComplete);

  if (!bootComplete) return null;

  const currentTheme = activeAlien ? themes[activeAlien] : null;
  const alienName = currentTheme ? currentTheme.name : '';

  return (
    <header className="fixed top-0 inset-x-0 h-16 bg-black/60 backdrop-blur-md border-b border-[var(--color-primary)]/20 z-40 transition-colors duration-500 px-6 md:px-12 flex items-center justify-between select-none">
      {/* Title / DNA Status */}
      <div className="flex items-center gap-4">
        <div className="w-3 h-3 rounded-full bg-[var(--color-primary)] shadow-[0_0_10px_var(--color-glow)] animate-pulse transition-colors duration-500" />
        <div className="font-mono text-xs md:text-sm tracking-widest text-[var(--color-text)] uppercase flex items-center gap-2">
          <span className="opacity-60 text-xs hidden sm:inline">OMNITRIX OS //</span>
          {activeAlien ? (
            <span className="text-[var(--color-primary)] font-bold transition-colors duration-500">
              DNA LINK SECURED: {alienName}
            </span>
          ) : (
            <span className="text-[#00FF41] font-bold">DNA PATTERN ACQUISITION ACTIVE</span>
          )}
        </div>
      </div>

      {/* Control Buttons */}
      <div className="flex items-center gap-4 md:gap-6">
        {activeAlien && (
          <button
            onClick={() => setActiveAlien(null)}
            className="px-4 py-1.5 border border-[var(--color-primary)]/40 hover:border-[var(--color-primary)] rounded bg-black/40 text-xs font-mono uppercase tracking-widest text-[var(--color-primary)] hover:bg-[var(--color-primary)] hover:text-black transition-all cursor-pointer shadow-[0_0_5px_var(--color-primary)/20] hover:shadow-[0_0_15px_var(--color-primary)/50]"
          >
            Reset Matrix
          </button>
        )}

        {/* Audio Speaker Mute Button */}
        <button
          onClick={() => setIsMuted(!isMuted)}
          className="p-2 border border-[var(--color-primary)]/20 rounded-full hover:bg-[var(--color-primary)]/10 text-[var(--color-primary)] hover:border-[var(--color-primary)] transition-all cursor-pointer flex items-center justify-center"
          aria-label={isMuted ? 'Unmute Audio' : 'Mute Audio'}
          title={isMuted ? 'Unmute Audio' : 'Mute Audio'}
        >
          {isMuted ? (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M11 5L6 9H2v6h4l5 4V5zM23 9l-6 6M17 9l6 6" />
            </svg>
          ) : (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M11 5L6 9H2v6h4l5 4V5zM19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07" />
            </svg>
          )}
        </button>
      </div>
    </header>
  );
}
