'use client';

import { useState } from 'react';
import { fetchRandomAlien } from '@/lib/api/ben10';
import { useOmnitrixStore } from '@/lib/store/useOmnitrixStore';

export function SurpriseButton() {
  const [loading, setLoading] = useState(false);
  const setActiveAlien = useOmnitrixStore((state) => state.setActiveAlien);

  const handleSurprise = async () => {
    setLoading(true);
    try {
      const alien = await fetchRandomAlien();
      if (alien && alien.general && alien.general.name) {
        const formattedId = alien.general.name.toLowerCase().replace(' ', '_');
        setActiveAlien(formattedId);
      }
    } catch (err) {
      console.error('Failed to trigger surprise mode', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleSurprise}
      disabled={loading}
      className="fixed bottom-8 right-8 z-50 w-16 h-16 rounded-full border-2 border-[#00FF41] bg-black/50 backdrop-blur-md text-[#00FF41] flex items-center justify-center hover:bg-[#00FF41]/20 hover:scale-110 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
      title="Surprise Mode"
      aria-label="Trigger Random Alien"
    >
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
      </svg>
    </button>
  );
}
