'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchAllAliens } from '@/lib/api/ben10';
import { useOmnitrixStore } from '@/lib/store/useOmnitrixStore';
import { themes } from '@/lib/themes';
import { motion, AnimatePresence } from 'framer-motion';

export function AlienHero({ alienId }: { alienId: string }) {
  const { data: allAliens, isLoading } = useQuery({
    queryKey: ['aliens'],
    queryFn: fetchAllAliens,
  });

  const setActiveAlien = useOmnitrixStore((state) => state.setActiveAlien);
  const [toastVisible, setToastVisible] = useState(false);

  if (isLoading) {
    return <div className="text-[var(--color-primary)] font-mono animate-pulse text-lg tracking-widest uppercase">DECODING DNA MATRICES...</div>;
  }

  // Find the matching alien from API data (checking direct ID match or name mapping)
  const alienData = allAliens?.aliens.find(
    (a) => a._id === alienId || a.general.name.toLowerCase().replace(' ', '_') === alienId
  );

  const theme = themes[alienId];

  const handleShare = async () => {
    if (!alienData) return;
    const name = theme ? theme.name : alienId;
    const url = `${window.location.origin}/alien/${alienId}`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${name} | OmnitrixOS`,
          text: `Analyze species, home world, and known abilities of ${name} on OmnitrixOS.`,
          url: url
        });
      } catch (err) {
        console.warn('Native share dismissed', err);
      }
    } else {
      // Fallback clipboard copy
      try {
        await navigator.clipboard.writeText(url);
        setToastVisible(true);
        setTimeout(() => setToastVisible(false), 2000);
      } catch (err) {
        console.error('Failed to copy link', err);
      }
    }
  };

  return (
    <div className="relative w-full select-none">
      {/* Floating Share Button at the top-right */}
      <button
        onClick={handleShare}
        className="absolute top-0 right-0 p-2.5 rounded-full border border-[var(--color-primary)]/40 text-[var(--color-primary)] bg-black/40 hover:bg-[var(--color-primary)]/10 hover:border-[var(--color-primary)] transition-all cursor-pointer shadow-[0_0_10px_var(--color-glow)/20] hover:shadow-[0_0_20px_var(--color-glow)/50] hover:scale-110 active:scale-95 z-30"
        title="Secure Share Link"
        aria-label="Share Alien Profile"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
          <polyline points="16 6 12 2 8 6" />
          <line x1="12" y1="2" x2="12" y2="15" />
        </svg>
      </button>

      <div className="flex flex-col md:flex-row items-center justify-between gap-12 w-full">
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
                textShadow: `0 0 35px var(--color-glow)`,
                animation: 'float-name 4s ease-in-out infinite',
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
              @keyframes float-name {
                0%, 100% { transform: translateY(0); }
                50% { transform: translateY(-4px); }
              }
            `}</style>
          </div>
        </div>
      </div>

      {/* Copy link confirmation toast banner */}
      <AnimatePresence>
        {toastVisible && (
          <motion.div
            initial={{ opacity: 0, y: 15, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="fixed bottom-10 left-1/2 -translate-x-1/2 z-50 bg-black/90 border border-[var(--color-primary)]/60 px-6 py-2.5 rounded shadow-[0_0_25px_var(--color-glow)/40] text-center font-mono text-[10px] text-[var(--color-primary)] tracking-widest uppercase select-none pointer-events-none"
          >
            ⬡ DNA PROFILE LINK COPIED TO BIOMATRIX BOARD
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
export default AlienHero;
