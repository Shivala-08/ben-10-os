'use client';

import React from 'react';

export function HUDFrame() {
  return (
    <div className="fixed inset-0 pointer-events-none z-40 select-none animate-hud-pulse">
      {/* Top Left Corner */}
      <div className="absolute top-6 left-6 w-12 h-12 border-t-2 border-l-2 border-[var(--color-primary)]/70 shadow-[0_0_10px_var(--color-glow)]/40 transition-colors duration-500">
        <div className="w-2 h-2 bg-[var(--color-primary)] absolute -top-1 -left-1 transition-colors duration-500 animate-pulse" />
      </div>

      {/* Top Right Corner */}
      <div className="absolute top-6 right-6 w-12 h-12 border-t-2 border-r-2 border-[var(--color-primary)]/70 shadow-[0_0_10px_var(--color-glow)]/40 transition-colors duration-500">
        <div className="w-2 h-2 bg-[var(--color-primary)] absolute -top-1 -right-1 transition-colors duration-500 animate-pulse" />
      </div>

      {/* Bottom Left Corner */}
      <div className="absolute bottom-6 left-6 w-12 h-12 border-b-2 border-l-2 border-[var(--color-primary)]/70 shadow-[0_0_10px_var(--color-glow)]/40 transition-colors duration-500">
        <div className="w-2 h-2 bg-[var(--color-primary)] absolute -bottom-1 -left-1 transition-colors duration-500 animate-pulse" />
      </div>

      {/* Bottom Right Corner */}
      <div className="absolute bottom-6 right-6 w-12 h-12 border-b-2 border-r-2 border-[var(--color-primary)]/70 shadow-[0_0_10px_var(--color-glow)]/40 transition-colors duration-500">
        <div className="w-2 h-2 bg-[var(--color-primary)] absolute -bottom-1 -right-1 transition-colors duration-500 animate-pulse" />
      </div>

      {/* Side HUD bars */}
      <div className="absolute top-1/2 left-4 -translate-y-1/2 w-[2px] h-32 bg-gradient-to-b from-transparent via-[var(--color-primary)]/50 to-transparent transition-colors duration-500" />
      <div className="absolute top-1/2 right-4 -translate-y-1/2 w-[2px] h-32 bg-gradient-to-b from-transparent via-[var(--color-primary)]/50 to-transparent transition-colors duration-500" />

      {/* Top and Bottom scanning lines */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 text-[8px] font-mono text-[var(--color-primary)]/40 tracking-[0.3em] uppercase transition-colors duration-500 animate-pulse hidden md:block">
        SYSTEM MONITOR // OMNI_GRID_STATUS: OPERATIONAL
      </div>
    </div>
  );
}
