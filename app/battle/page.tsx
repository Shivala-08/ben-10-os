'use client';

import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchAllAliens } from '@/lib/api/ben10';
import { Alien } from '@/lib/api/types';
import { runBattle, BattleRound, calculateAlienScore } from '@/lib/battle/battleEngine';
import { AlienSelector } from '@/components/battle/AlienSelector';
import { BattleArena } from '@/components/battle/BattleArena';
import { BattleLog } from '@/components/battle/BattleLog';
import { useRouter } from 'next/navigation';
import { synth } from '@/lib/utils/WebAudioSynth';

export default function BattlePage() {
  const router = useRouter();
  const { data, isLoading, error } = useQuery({
    queryKey: ['aliens'],
    queryFn: fetchAllAliens,
    staleTime: Infinity,
  });

  const aliens = data?.aliens || [];

  // Selector states
  const [alienA, setAlienA] = useState<Alien | null>(null);
  const [alienB, setAlienB] = useState<Alien | null>(null);

  // Scores
  const [scoreA, setScoreA] = useState<number>(0);
  const [scoreB, setScoreB] = useState<number>(0);

  // Battle outcomes
  const [isFighting, setIsFighting] = useState(false);
  const [rounds, setRounds] = useState<BattleRound[]>([]);
  const [winner, setWinner] = useState<Alien | null>(null);
  const [customPrimaryColor, setCustomPrimaryColor] = useState<string | null>(null);

  // Evaluate single ratings on pick
  useEffect(() => {
    if (alienA) setScoreA(calculateAlienScore(alienA));
  }, [alienA]);

  useEffect(() => {
    if (alienB) setScoreB(calculateAlienScore(alienB));
  }, [alienB]);

  const handleFight = () => {
    if (!alienA || !alienB) return;

    synth.playTransform();
    setIsFighting(true);
    setRounds([]);
    setWinner(null);
    setCustomPrimaryColor(null);

    // Staggered timing simulation of battle rounds
    setTimeout(() => {
      const outcome = runBattle(alienA, alienB);
      
      setScoreA(outcome.winnerScore - (outcome.winner._id === alienA._id ? 0 : 5));
      setScoreB(outcome.winnerScore - (outcome.winner._id === alienB._id ? 0 : 5));
      
      if (outcome.winner._id === alienA._id) {
        setScoreA(outcome.winnerScore);
        setScoreB(outcome.loserScore);
      } else {
        setScoreA(outcome.loserScore);
        setScoreB(outcome.winnerScore);
      }

      setRounds(outcome.rounds);
      setWinner(outcome.winner);
      setIsFighting(false);

      // Flash body screen red/green on finished duel verdict
      const flash = document.createElement('div');
      flash.className = 'fixed inset-0 bg-[#00FF41]/20 z-50 pointer-events-none transition-opacity duration-500';
      document.body.appendChild(flash);
      setTimeout(() => {
        flash.style.opacity = '0';
        setTimeout(() => flash.remove(), 500);
      }, 300);

      // Play finished fanfare buzzer
      synth.playClick();

      // Winner Theme Sync Override (Update primary CSS variable)
      const name = outcome.winner.general.name.toLowerCase();
      let color = '#00FF41'; // fallback green
      if (name.includes('heatblast')) color = '#FF4500'; // red-orange
      else if (name.includes('xlr8')) color = '#00FFFF'; // cyan
      else if (name.includes('ghostfreak')) color = '#9370DB'; // purple
      else if (name.includes('diamondhead')) color = '#7FFFD4'; // aquamarine
      else if (name.includes('four')) color = '#FF0000'; // pure red
      else if (name.includes('upgrade')) color = '#32CD32'; // lime
      else if (name.includes('grey')) color = '#708090'; // slate grey
      else if (name.includes('ripjaws')) color = '#4682B4'; // steel blue

      setCustomPrimaryColor(color);
      document.documentElement.style.setProperty('--color-primary', color);
    }, 1800); // 1.8 seconds loading scan animation
  };

  const handleBack = () => {
    synth.playClick();
    // Reset CSS variables override on exit back to dial
    document.documentElement.style.removeProperty('--color-primary');
    router.push('/');
  };

  const isCombatReady = alienA && alienB && alienA._id !== alienB._id && !isFighting;

  return (
    <main 
      className="w-full min-h-screen bg-black text-[#00FF41] font-mono flex flex-col p-6 overflow-x-hidden relative select-none"
      style={{
        '--color-primary': customPrimaryColor || '#00FF41'
      } as React.CSSProperties}
    >
      {/* Laser line grid filter */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.3)_50%),linear-gradient(90deg,var(--color-primary,rgba(0,255,65,0.02))_1px,transparent_1px)] bg-[size:100%_4px,8px_8px] pointer-events-none opacity-80" />

      {/* Diagnostics Header Banners */}
      <div className="flex justify-between items-center border-b border-[#00FF41]/20 pb-4 mb-8 select-none relative z-10">
        <div className="flex items-center gap-3">
          <button
            onClick={handleBack}
            className="px-2.5 py-1 bg-black/60 border border-[#00FF41]/30 hover:border-[#00FF41] rounded text-[#00FF41]/75 hover:text-[#00FF41] text-[10px] uppercase font-bold tracking-widest transition-all duration-300"
          >
            [BACK]
          </button>
          <span className="w-2.5 h-2.5 bg-[#00FF41] rounded-full animate-pulse drop-shadow-[0_0_5px_var(--color-primary,#00FF41)]" />
          <h1 className="text-sm md:text-base font-bold tracking-[0.25em] uppercase select-none drop-shadow-[0_0_4px_var(--color-primary,rgba(0,255,65,0.4))]">
            ⬡ OMNITRIX_BATTLE_SIMULATOR
          </h1>
        </div>
        <div className="text-[10px] text-[#00FF41]/45 tracking-widest font-semibold uppercase hidden sm:block">
          COMBAT STAGE: BIOMETRIC ARENA SECURED
        </div>
      </div>

      <div className="flex-1 max-w-4xl mx-auto w-full flex flex-col space-y-8 relative z-10 select-none pb-12">
        {/* Selection Fields */}
        <div className="flex flex-col md:flex-row gap-6 items-center">
          <AlienSelector
            aliens={aliens}
            selectedAlien={alienA}
            onSelect={setAlienA}
            label="SPECIMEN CORES ALPHA"
          />
          <AlienSelector
            aliens={aliens}
            selectedAlien={alienB}
            onSelect={setAlienB}
            label="SPECIMEN CORES BETA"
          />
        </div>

        {/* Diagnostic loading triggers */}
        {isLoading && (
          <div className="flex-1 py-16 flex flex-col items-center justify-center font-mono text-[11px] text-[#00FF41] uppercase tracking-[0.25em] animate-pulse gap-2">
            <span>⬡ INITIALIZING ARENA BIOMATRIX CONFIGS...</span>
          </div>
        )}

        {!isLoading && !error && (
          <>
            {/* Arena Board */}
            <BattleArena
              alienA={alienA}
              alienB={alienB}
              scoreA={scoreA}
              scoreB={scoreB}
              isFighting={isFighting}
              winner={winner}
            />

            {/* Initiate Battle Trigger Button */}
            {alienA && alienB && alienA._id === alienB._id && (
              <div className="text-[#FFCC00] font-mono text-[10px] uppercase font-bold text-center animate-pulse">
                [ERROR: DUAL TRANSFORMS RE-ENTRY FOR THE SAME DNA STRAND BLOCKED]
              </div>
            )}

            {alienA && alienB && alienA._id !== alienB._id && (
              <button
                onClick={handleFight}
                disabled={!isCombatReady}
                className={`w-full py-3.5 rounded font-bold uppercase tracking-widest text-[11px] text-center transition-all duration-300 border ${
                  isCombatReady
                    ? 'bg-[#00FF41]/10 hover:bg-[#00FF41]/25 border-[#00FF41] text-[#00FF41] shadow-[0_0_15px_rgba(0,255,65,0.25)] cursor-pointer'
                    : 'bg-black/40 border-[#00FF41]/10 text-[#00FF41]/25 cursor-not-allowed'
                }`}
              >
                {isFighting ? 'SYNCHRONIZING KINETIC CLASH CORES...' : 'INITIATE BIOMETRIC SIMULATION'}
              </button>
            )}

            {/* Chronicles combat logs */}
            {rounds.length > 0 && !isFighting && (
              <BattleLog rounds={rounds} winnerName={winner?.general.name || ''} />
            )}
          </>
        )}
      </div>
    </main>
  );
}
