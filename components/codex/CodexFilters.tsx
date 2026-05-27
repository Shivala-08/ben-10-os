'use client';

import React from 'react';
import { SeriesTab } from '@/hooks/useCodex';
import { synth } from '@/lib/utils/WebAudioSynth';

interface CodexFiltersProps {
  activeTab: SeriesTab;
  setActiveTab: (tab: SeriesTab) => void;
}

const TABS: SeriesTab[] = ['All', 'Original Series', 'Alien Force', 'Ultimate Alien', 'Omniverse'];

export function CodexFilters({ activeTab, setActiveTab }: CodexFiltersProps) {
  const handleTabChange = (tab: SeriesTab) => {
    setActiveTab(tab);
    synth.playClick();
  };

  return (
    <div className="flex flex-wrap gap-2 select-none border-b border-[#00FF41]/10 pb-4 w-full">
      {TABS.map((tab) => {
        const active = activeTab === tab;
        return (
          <button
            key={tab}
            onClick={() => handleTabChange(tab)}
            className={`font-mono text-[10px] uppercase tracking-widest px-3.5 py-1.5 rounded transition-all duration-300 border ${
              active
                ? 'bg-[#00FF41]/15 border-[#00FF41] text-[#00FF41] shadow-[0_0_10px_rgba(0,255,65,0.25)]'
                : 'bg-black/50 border-[#00FF41]/20 text-[#00FF41]/50 hover:text-[#00FF41] hover:border-[#00FF41]/60'
            }`}
          >
            {tab}
          </button>
        );
      })}
    </div>
  );
}
export default CodexFilters;
