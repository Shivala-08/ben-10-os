'use client';

import { useQuery } from '@tanstack/react-query';
import { fetchAllAliens } from '@/lib/api/ben10';
import { useOmnitrixStore } from '@/lib/store/useOmnitrixStore';
import { themes } from '@/lib/themes';

export function AlienHero({ alienId }: { alienId: string }) {
  const { data: allAliens, isLoading } = useQuery({
    queryKey: ['aliens'],
    queryFn: fetchAllAliens,
  });

  const setActiveAlien = useOmnitrixStore((state) => state.setActiveAlien);

  if (isLoading) {
    return <div className="text-[var(--color-primary)] font-mono animate-pulse text-lg tracking-widest uppercase">DECODING DNA MATRICES...</div>;
  }

  // Find the matching alien from API data
  const alienData = allAliens?.aliens.find(
    (a) => a.general.name.toLowerCase().replace(' ', '_') === alienId
  );

  const theme = themes[alienId];

  return (
    <div className="flex flex-col md:flex-row items-center justify-between gap-12 w-full select-none">
      {/* Left Column: Text & Navigation */}
      <div className="flex flex-col items-start gap-4 order-2 md:order-1 flex-1">
        <button 
          onClick={() => setActiveAlien(null)}
          className="text-[var(--color-primary)] font-mono text-xs uppercase tracking-widest hover:underline cursor-pointer flex items-center gap-2 mb-8 bg-[var(--color-primary)]/10 px-4 py-2 border border-[var(--color-primary)]/30 rounded shadow-[0_0_10px_var(--color-primary)/10]"
        >
          <span>&larr;</span> RE-ALIGN OMNITRIX DIAL
        </button>

        <div className="flex flex-col">
          <h2 className="text-xl md:text-2xl font-mono text-[var(--color-text)] opacity-70 uppercase tracking-widest mb-2">
            SPECIES: {alienData ? alienData.general.species : 'Unknown Species'}
          </h2>
          <h1 
            className="text-6xl md:text-8xl font-display uppercase tracking-tighter transition-all"
            style={{ 
              color: 'var(--color-primary)', 
              textShadow: `0 0 35px var(--color-glow)`
            }}
          >
            {theme ? theme.name : alienId}
          </h1>
        </div>
      </div>

      {/* Right Column: High-Tech Glowing Floating Image Frame */}
      <div className="order-1 md:order-2 flex-shrink-0 flex items-center justify-center">
        <div className="relative w-64 h-64 md:w-96 md:h-96 rounded-full border-2 border-[var(--color-primary)]/40 flex items-center justify-center p-6 bg-gradient-to-b from-[var(--color-surface)] to-black/80 shadow-[0_0_40px_var(--color-glow)/25_inset,0_0_30px_var(--color-glow)/30] group">
          {/* Futuristic holographic circular spinning scanlines */}
          <div className="absolute inset-2 border border-dashed border-[var(--color-primary)]/20 rounded-full animate-spin" style={{ animationDuration: '20s' }} />
          <div className="absolute inset-4 border border-[var(--color-primary)]/10 rounded-full animate-spin" style={{ animationDuration: '40s', animationDirection: 'reverse' }} />
          
          {/* The glowing alien avatar */}
          <img 
            src={`/aliens/${alienId}.png`} 
            alt={theme ? theme.name : alienId}
            className="relative z-10 w-full h-full object-contain filter drop-shadow-[0_0_20px_var(--color-glow)] transition-transform duration-700 group-hover:scale-110"
            style={{
              animation: 'float-image 4s ease-in-out infinite',
            }}
          />

          <style jsx>{`
            @keyframes float-image {
              0%, 100% { transform: translateY(0); }
              50% { transform: translateY(-10px); }
            }
          `}</style>
        </div>
      </div>
    </div>
  );
}
