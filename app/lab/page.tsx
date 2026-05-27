'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchAllAliens } from '@/lib/api/ben10';
import { Alien } from '@/lib/api/types';
import { fuseAliens } from '@/lib/fusion/fusionEngine';
import { FusedAlien } from '@/types/fusion.types';
import { AlienDragCard } from '@/components/lab/AlienDragCard';
import { DNAMixer } from '@/components/lab/DNAMixer';
import { FusionResult } from '@/components/lab/FusionResult';
import { useRouter, useSearchParams } from 'next/navigation';
import { synth } from '@/lib/utils/WebAudioSynth';

function LabContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const { data, isLoading, error } = useQuery({
    queryKey: ['aliens'],
    queryFn: fetchAllAliens,
    staleTime: Infinity,
  });

  const aliens = data?.aliens || [];

  // Drop slot slots states
  const [slotA, setSlotA] = useState<Alien | null>(null);
  const [slotB, setSlotB] = useState<Alien | null>(null);

  // Fusion result and processing states
  const [isFusing, setIsFusing] = useState(false);
  const [result, setResult] = useState<FusedAlien | null>(null);
  
  // Persistent saved hybrids list
  const [savedFusions, setSavedFusions] = useState<FusedAlien[]>([]);
  const [isResultSaved, setIsResultSaved] = useState(false);

  // Sync saved list from browser storage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('omnitrix_fusions');
      if (stored) {
        try {
          setSavedFusions(JSON.parse(stored));
        } catch (e) {}
      }
    }
  }, []);

  // Sync Query pre-loaded parameter cards (D1 Console triggers / router push)
  useEffect(() => {
    if (aliens.length === 0) return;

    const a1 = searchParams.get('alien1');
    const a2 = searchParams.get('alien2');

    if (a1) {
      const match1 = aliens.find(
        (a) =>
          a.general.name.toLowerCase() === a1.toLowerCase() ||
          a.general.name.toLowerCase().replace(/\s+/g, '_') === a1
      );
      if (match1) setSlotA(match1);
    }
    if (a2) {
      const match2 = aliens.find(
        (a) =>
          a.general.name.toLowerCase() === a2.toLowerCase() ||
          a.general.name.toLowerCase().replace(/\s+/g, '_') === a2
      );
      if (match2) setSlotB(match2);
    }
  }, [aliens, searchParams]);

  // Execute molecular blend whenever both slot targets are populated
  useEffect(() => {
    if (slotA && slotB && slotA._id !== slotB._id) {
      setIsFusing(true);
      setResult(null);
      setIsResultSaved(false);

      // Play soft high-tension glitch blending scan
      synth.playMalfunction();

      const timer = setTimeout(() => {
        const hybrid = fuseAliens(slotA, slotB);
        setResult(hybrid);
        setIsFusing(false);
        synth.playClick();
      }, 1200); // 1.2s blending animation delay

      return () => clearTimeout(timer);
    } else {
      setResult(null);
    }
  }, [slotA, slotB]);

  // Bounding rect overlap checking for drag drops snapping
  const handleDragEnd = (alien: Alien, info: any) => {
    const rectA = document.getElementById('slot-a')?.getBoundingClientRect();
    const rectB = document.getElementById('slot-b')?.getBoundingClientRect();
    
    // Grab drop coordinates
    const { x, y } = info.point;

    // Snapped into slot A
    if (rectA && x >= rectA.left && x <= rectA.right && y >= rectA.top && y <= rectA.bottom) {
      if (slotB?._id === alien._id) {
        // Prevent duplicate DNA entries in slots
        synth.playAccessDenied();
        return;
      }
      setSlotA(alien);
      synth.playClick();
    }
    // Snapped into slot B
    else if (rectB && x >= rectB.left && x <= rectB.right && y >= rectB.top && y <= rectB.bottom) {
      if (slotA?._id === alien._id) {
        synth.playAccessDenied();
        return;
      }
      setSlotB(alien);
      synth.playClick();
    }
  };

  const handleSaveFusion = () => {
    if (!result) return;
    
    const updated = [result, ...savedFusions].slice(0, 30); // limit 30 saves
    setSavedFusions(updated);
    localStorage.setItem('omnitrix_fusions', JSON.stringify(updated));
    setIsResultSaved(true);
  };

  const handlePurgeSaves = () => {
    localStorage.removeItem('omnitrix_fusions');
    setSavedFusions([]);
    synth.playAccessDenied();
  };

  const handleBack = () => {
    synth.playClick();
    router.push('/');
  };

  return (
    <main className="w-full min-h-screen bg-black text-[#00FF41] font-mono flex flex-col p-6 overflow-x-hidden relative select-none">
      {/* Curved CRT Filter */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.3)_50%)] bg-[size:100%_4px] pointer-events-none opacity-80 z-20" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_30%,rgba(0,0,0,0.45)_95%)] pointer-events-none z-20" />

      {/* Diagnostics Header Banners */}
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
            ⬡ OMNITRIX_FUSION_LAB
          </h1>
        </div>
        <div className="text-[10px] text-[#00FF41]/45 tracking-widest font-semibold uppercase hidden sm:block">
          SYS_CHAMBER: BLENDER CORES CHARGED
        </div>
      </div>

      <div className="flex-1 max-w-5xl mx-auto w-full flex flex-col lg:flex-row gap-8 relative z-10 select-none pb-12">
        {/* Left Side: Drag Mixer Board & Result */}
        <div className="flex-1 flex flex-col space-y-8 min-w-0">
          
          {/* Snap Drag Target Mixer */}
          <DNAMixer
            slotA={slotA}
            slotB={slotB}
            onRemoveSlot={(slot) => {
              if (slot === 'A') setSlotA(null);
              else setSlotB(null);
            }}
            isFusing={isFusing}
          />

          {/* Fusion scan loader */}
          {isFusing && (
            <div className="py-12 border border-[#00FF41]/10 bg-black/40 rounded flex flex-col items-center justify-center font-mono text-[11px] text-[#00FF41] uppercase tracking-[0.25em] animate-pulse gap-2 w-full">
              <span>⬡ RE-MUTATING CELLULAR CHROMOSOMES...</span>
              <span className="text-[9px] text-[#00FF41]/50">LOCKING CONICAL CORE MATRIX...</span>
            </div>
          )}

          {/* Fusion Outcome Results block */}
          {result && !isFusing && (
            <FusionResult
              fused={result}
              onSave={handleSaveFusion}
              isSaved={isResultSaved}
            />
          )}

          {/* Draggable DNA list pool */}
          <div className="border border-[#00FF41]/20 bg-black/50 p-4 rounded-md flex flex-col space-y-3">
            <span className="text-[9px] text-white/45 font-bold uppercase tracking-widest">
              🧬 SPECIMEN ROSTER CELLULAR VAULT (DRAG CARDS UP)
            </span>
            
            {isLoading ? (
              <div className="py-8 font-mono text-[10px] text-[#00FF41]/40 uppercase tracking-widest animate-pulse text-center">
                AQUEOUS DNA CONCENTRATE LOADING...
              </div>
            ) : (
              <div className="flex flex-wrap gap-2.5 max-h-52 overflow-y-auto pr-1 custom-scrollbar justify-center py-1">
                {aliens.map((alien) => (
                  <AlienDragCard
                    key={alien._id}
                    alien={alien}
                    onDragEnd={handleDragEnd}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Side: Saved Hybrids Catalog list */}
        <div className="w-full lg:w-72 bg-black/60 border border-[#00FF41]/20 rounded-md p-5 flex flex-col gap-4 max-h-[580px] overflow-hidden select-none">
          <div className="border-b border-[#00FF41]/20 pb-2 flex justify-between items-center select-none">
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#00FF41] flex items-center gap-1.5">
              📁 CACHED HYBRIDS
            </span>
            <span className="text-[8px] text-white/45">
              {savedFusions.length} CORES
            </span>
          </div>

          <div className="flex-1 overflow-y-auto space-y-3 pr-1 custom-scrollbar">
            {savedFusions.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center text-[#00FF41]/25 uppercase text-[9px] tracking-widest py-12 select-none">
                <span>LAB CATALOG EMPTY</span>
                <span className="text-[8px] mt-1 text-[#00FF41]/15">Save outcome hybrid profiles above...</span>
              </div>
            ) : (
              savedFusions.map((fuse, idx) => (
                <div
                  key={idx}
                  className="border border-[#00FF41]/20 bg-black/80 p-3 rounded flex flex-col gap-1.5 hover:bg-[#00FF41]/5 transition-colors group relative overflow-hidden"
                  style={{ borderColor: `${fuse.palette.primary}30` }}
                >
                  <div className="flex justify-between items-start select-none">
                    <span 
                      className="font-bold uppercase text-[11px] tracking-wider truncate max-w-[130px] drop-shadow-[0_0_2px_rgba(255,255,255,0.1)]"
                      style={{ color: fuse.palette.primary }}
                    >
                      {fuse.name}
                    </span>
                    <span className="text-[8px] font-semibold text-white/40 bg-white/[0.04] px-1 rounded truncate max-w-[90px] border border-white/5 uppercase">
                      {fuse.species}
                    </span>
                  </div>
                  <div className="text-[7.5px] text-[#00FF41]/40 uppercase tracking-widest border-t border-white/[0.04] pt-1 truncate w-full select-text selection:bg-[#00FF41]/10 selection:text-white">
                    WORLD: {fuse.homeWorld}
                  </div>
                </div>
              ))
            )}
          </div>

          {savedFusions.length > 0 && (
            <button
              onClick={handlePurgeSaves}
              className="w-full py-2 bg-red-950/30 hover:bg-red-900/40 border border-red-500/30 hover:border-red-500 rounded text-red-400 font-bold uppercase tracking-widest text-[9px] text-center transition-all select-none cursor-pointer"
            >
              PURGE HYBRIDS SYSTEM
            </button>
          )}
        </div>
      </div>
    </main>
  );
}

export default function LabPage() {
  return (
    <Suspense fallback={
      <div className="w-full min-h-screen bg-black flex items-center justify-center font-mono text-[11px] text-[#00FF41]/40 uppercase tracking-[0.25em] animate-pulse">
        <span>⬡ ACCESSING LABORATORY CORE SIGNAL...</span>
      </div>
    }>
      <LabContent />
    </Suspense>
  );
}
