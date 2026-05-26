'use client';

import { useQuery } from '@tanstack/react-query';
import { fetchAllAliens } from '@/lib/api/ben10';
import { motion } from 'framer-motion';

export function AbilitiesGrid({ alienId }: { alienId: string }) {
  const { data: allAliens } = useQuery({
    queryKey: ['aliens'],
    queryFn: fetchAllAliens,
  });

  const alienData = allAliens?.aliens.find(
    (a) => a.general.name.toLowerCase().replace(' ', '_') === alienId
  );

  if (!alienData || !alienData.abilities) return null;

  return (
    <div className="space-y-8">
      <h3 className="text-2xl font-display text-[var(--color-primary)] uppercase tracking-widest border-b border-[var(--color-primary)]/30 pb-4 inline-block">
        Known Abilities
      </h3>
      
      <div className="flex flex-wrap gap-4">
        {alienData.abilities.map((ability, index) => (
          <motion.div
            key={ability}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.5 }}
            viewport={{ once: true }}
            className="px-6 py-3 bg-[var(--color-primary)]/10 border border-[var(--color-primary)]/50 rounded-full text-[var(--color-text)] font-mono text-sm tracking-wider uppercase shadow-[0_0_10px_var(--color-primary)_inset] hover:bg-[var(--color-primary)] hover:text-black hover:shadow-[0_0_20px_var(--color-primary)] transition-all cursor-default"
          >
            {ability}
          </motion.div>
        ))}
      </div>
    </div>
  );
}
