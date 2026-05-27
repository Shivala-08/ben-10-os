'use client';

import { useQuery } from '@tanstack/react-query';
import { fetchAllAliens } from '@/lib/api/ben10';

export function StatCards({ alienId }: { alienId: string }) {
  const { data: allAliens } = useQuery({
    queryKey: ['aliens'],
    queryFn: fetchAllAliens,
  });

  const alienData = allAliens?.aliens.find(
    (a) => a._id === alienId || a.general.name.toLowerCase().replace(' ', '_') === alienId
  );

  if (!alienData) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="stat-card bg-[var(--color-surface)] border border-[var(--color-primary)]/30 p-6 rounded-lg backdrop-blur-sm relative overflow-hidden group hover:border-[var(--color-primary)] transition-colors">
        <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-primary)]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        <h3 className="text-[var(--color-text)]/50 font-mono text-sm mb-2 uppercase tracking-widest">Home World</h3>
        <p className="text-[var(--color-text)] font-display text-xl">{alienData.general.homeWorld}</p>
      </div>
      
      <div className="stat-card bg-[var(--color-surface)] border border-[var(--color-primary)]/30 p-6 rounded-lg backdrop-blur-sm relative overflow-hidden group hover:border-[var(--color-primary)] transition-colors">
        <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-primary)]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        <h3 className="text-[var(--color-text)]/50 font-mono text-sm mb-2 uppercase tracking-widest">Body Type</h3>
        <p className="text-[var(--color-text)] font-display text-xl">{alienData.general.body}</p>
      </div>

      <div className="stat-card bg-[var(--color-surface)] border border-[var(--color-primary)]/30 p-6 rounded-lg backdrop-blur-sm relative overflow-hidden group hover:border-[var(--color-primary)] transition-colors">
        <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-primary)]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        <h3 className="text-[var(--color-text)]/50 font-mono text-sm mb-2 uppercase tracking-widest">First Appearance</h3>
        <p className="text-[var(--color-text)] font-display text-xl">{alienData.series}</p>
      </div>
    </div>
  );
}
