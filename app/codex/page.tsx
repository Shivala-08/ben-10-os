'use client';

import React from 'react';
import { useCodex } from '@/hooks/useCodex';
import { CodexSearch } from '@/components/codex/CodexSearch';
import { CodexFilters } from '@/components/codex/CodexFilters';
import { CodexGrid } from '@/components/codex/CodexGrid';
import { CodexDrawer } from '@/components/codex/CodexDrawer';
import { AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { synth } from '@/lib/utils/WebAudioSynth';

export default function CodexPage() {
  const {
    aliens,
    isLoading,
    error,
    searchTerm,
    setSearchTerm,
    activeTab,
    setActiveTab,
    selectedAlien,
    setSelectedAlien
  } = useCodex();

  const router = useRouter();

  const handleBack = () => {
    synth.playClick();
    router.push('/');
  };

  return (
    <main className="w-full min-h-screen bg-black text-[#00FF41] font-mono flex flex-col p-6 overflow-x-hidden relative select-none">
      {/* Curved CRT Scanning Grid Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.3)_50%),linear-gradient(90deg,rgba(0,255,65,0.02)_1px,transparent_1px)] bg-[size:100%_4px,8px_8px] pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_30%,rgba(0,0,0,0.45)_95%)] pointer-events-none" />

      {/* Header diagnostics bar */}
      <div className="flex justify-between items-center border-b border-[#00FF41]/20 pb-4 mb-8 select-none relative z-10">
        <div className="flex items-center gap-3">
          <button
            onClick={handleBack}
            className="px-2.5 py-1 bg-black/60 border border-[#00FF41]/30 hover:border-[#00FF41] rounded text-[#00FF41]/75 hover:text-[#00FF41] text-[10px] uppercase font-bold tracking-widest transition-all duration-300"
          >
            [BACK]
          </button>
          <span className="w-2.5 h-2.5 bg-[#00FF41] rounded-full animate-pulse drop-shadow-[0_0_5px_#00FF41]" />
          <h1 className="text-sm md:text-base font-bold tracking-[0.25em] uppercase select-none drop-shadow-[0_0_4px_rgba(0,255,65,0.4)]">
            ⬡ OMNITRIX_SPECIMEN_CODEX
          </h1>
        </div>
        <div className="text-[10px] text-[#00FF41]/45 tracking-widest font-semibold uppercase hidden sm:block">
          DATABASE TOTAL: 62 BIO-PROFILES // CACHE_ONLINE
        </div>
      </div>

      {/* Content wrapper */}
      <div className="flex-1 max-w-7xl mx-auto w-full flex flex-col space-y-6 relative z-10 select-none pb-12">
        {/* Search Bar */}
        <CodexSearch value={searchTerm} onChange={setSearchTerm} />

        {/* Tab Series Filters */}
        <CodexFilters activeTab={activeTab} setActiveTab={setActiveTab} />

        {/* Diagnostic loading feeds */}
        {isLoading && (
          <div className="flex-1 py-20 flex flex-col items-center justify-center font-mono text-[11px] text-[#00FF41] uppercase tracking-[0.25em] animate-pulse gap-2 select-none">
            <span>⬡ RETRIEVING SPECIMEN INDEX RECORDS...</span>
            <span className="text-[9px] text-[#00FF41]/50">Synchronizing TanStack Query Cache...</span>
          </div>
        )}

        {error && (
          <div className="flex-1 py-20 flex flex-col items-center justify-center font-mono text-[11px] text-[#FF4444] uppercase tracking-[0.25em] animate-pulse gap-2 select-none">
            <span>⚠️ ERROR: DNA STREAM QUERY COLLISION FAULT</span>
            <span className="text-[9px] text-[#FF4444]/60">Biomatrix telemetry servers offline.</span>
          </div>
        )}

        {/* Card Grids */}
        {!isLoading && !error && (
          <CodexGrid aliens={aliens} onCardClick={setSelectedAlien} />
        )}
      </div>

      {/* Slide Drawer biometrics overview */}
      <AnimatePresence>
        {selectedAlien && (
          <CodexDrawer
            alien={selectedAlien}
            onClose={() => setSelectedAlien(null)}
          />
        )}
      </AnimatePresence>
    </main>
  );
}
