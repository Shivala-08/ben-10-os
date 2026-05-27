'use client';

import React from 'react';

interface CodexSearchProps {
  value: string;
  onChange: (value: string) => void;
}

export function CodexSearch({ value, onChange }: CodexSearchProps) {
  return (
    <div className="w-full relative select-none">
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="SEARCH DNA CODEX INDEX (NAME, SPECIES, HOME WORLD, ABILITIES)..."
        className="w-full bg-black/60 border border-[#00FF41]/30 focus:border-[#00FF41] rounded px-4 py-3 text-xs uppercase tracking-wider font-mono text-[#00FF41] placeholder:text-[#00FF41]/30 focus:outline-none focus:shadow-[0_0_15px_rgba(0,255,65,0.15)] transition-all duration-300 select-text"
      />
      <div className="absolute right-4 top-1/2 -translate-y-1/2 text-[9px] text-[#00FF41]/40 uppercase tracking-widest font-mono pointer-events-none">
        DB_QUERY_MODE
      </div>
    </div>
  );
}
export default CodexSearch;
