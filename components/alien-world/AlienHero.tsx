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
    return <div className="text-[var(--color-primary)] font-mono animate-pulse">DECODING DNA...</div>;
  }

  // Find the matching alien from API data
  const alienData = allAliens?.aliens.find(
    (a) => a.general.name.toLowerCase().replace(' ', '_') === alienId
  );

  const theme = themes[alienId];

  return (
    <div className="flex flex-col items-start gap-4">
      <button 
        onClick={() => setActiveAlien(null)}
        className="text-[var(--color-primary)] font-mono text-sm hover:underline cursor-pointer flex items-center gap-2 mb-8"
      >
        <span>&larr;</span> BACK TO OMNITRIX
      </button>

      <div className="flex flex-col">
        <h2 className="text-xl md:text-3xl font-mono text-[var(--color-text)] opacity-70 uppercase tracking-widest">
          {alienData ? alienData.general.species : 'Unknown Species'}
        </h2>
        <h1 
          className="text-6xl md:text-9xl font-display uppercase tracking-tighter"
          style={{ 
            color: 'var(--color-primary)', 
            textShadow: `0 0 40px var(--color-glow)`
          }}
        >
          {theme ? theme.name : alienId}
        </h1>
      </div>
    </div>
  );
}
