'use client';

import { useQuery } from '@tanstack/react-query';
import { fetchAllAliens } from '@/lib/api/ben10';
import { motion } from 'framer-motion';

export function AbilitiesGrid({ alienId }: { alienId: string }) {
  const { data: allAliens } = useQuery({
    queryKey: ['aliens'],
    queryFn: fetchAllAliens,
  });

  // Find by direct ID match (most robust) or fallback to name matching
  const alienData = allAliens?.aliens.find(
    (a) => a._id === alienId || a.general.name.toLowerCase().replace(' ', '_') === alienId
  );

  if (!alienData || !alienData.abilities) return null;

  return (
    <div className="space-y-8">
      <h3 
        className="text-2xl font-display uppercase tracking-widest border-b pb-4 inline-block"
        style={{ 
          color: 'var(--color-primary)', 
          borderBottomColor: 'rgba(255, 255, 255, 0.15)',
          textShadow: '0 0 15px var(--color-glow)'
        }}
      >
        Known Abilities
      </h3>
      
      <div className="flex flex-wrap gap-4">
        {alienData.abilities.map((ability, index) => (
          <motion.div
            key={ability}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.08, duration: 0.4, ease: 'easeOut' }}
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.04)',
              borderColor: 'var(--color-primary)',
              borderWidth: '1px',
              color: 'var(--color-text)',
              textShadow: '0 0 5px var(--color-glow)',
              boxShadow: '0 0 12px var(--color-glow) inset'
            }}
            className="px-6 py-3 rounded-full font-mono text-sm tracking-wider uppercase hover:text-black transition-all duration-300 cursor-default"
          >
            {ability}
          </motion.div>
        ))}
      </div>
    </div>
  );
}
