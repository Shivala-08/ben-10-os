'use client';

import React, { useState } from 'react';
import { Alien } from '@/lib/api/types';
import { synth } from '@/lib/utils/WebAudioSynth';

interface AlienSelectorProps {
  aliens: Alien[];
  selectedAlien: Alien | null;
  onSelect: (alien: Alien) => void;
  label: string;
}

export function AlienSelector({ aliens, selectedAlien, onSelect, label }: AlienSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleToggle = () => {
    setIsOpen(!isOpen);
    synth.playClick();
  };

  const handleSelect = (alien: Alien) => {
    onSelect(alien);
    setIsOpen(false);
    synth.playClick();
  };

  return (
    <div className="flex flex-col space-y-2 w-full font-mono relative select-none">
      <span className="text-[10px] text-white/45 uppercase tracking-widest font-semibold">
        {label}
      </span>

      {/* Select button */}
      <button
        onClick={handleToggle}
        className="w-full bg-black/60 border border-[#00FF41]/30 focus:border-[#00FF41] hover:border-[#00FF41]/60 rounded px-4 py-3 text-xs uppercase tracking-wider text-left text-[#00FF41] transition-all duration-300 flex justify-between items-center"
      >
        <span>
          {selectedAlien ? selectedAlien.general.name.toUpperCase() : 'SELECT DNA STRAND...'}
        </span>
        <span className="text-[9px] text-[#00FF41]/40">
          {isOpen ? '[CLOSE]' : '[EXPAND]'}
        </span>
      </button>

      {/* Dropdown list */}
      {isOpen && (
        <div className="absolute top-[64px] left-0 w-full max-h-56 bg-black border border-[#00FF41]/40 rounded-md overflow-y-auto z-30 shadow-[0_10px_25px_rgba(0,255,65,0.15)] custom-scrollbar">
          <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.3)_50%)] bg-[size:100%_4px] pointer-events-none" />
          
          <div className="p-1.5 grid grid-cols-1 gap-1 relative z-10">
            {aliens.map((alien) => (
              <button
                key={alien._id}
                onClick={() => handleSelect(alien)}
                className="w-full text-left font-mono text-[10px] uppercase text-[#00FF41]/75 hover:text-[#00FF41] hover:bg-[#00FF41]/10 px-3 py-2 rounded transition-colors"
              >
                {alien.general.name} - <span className="text-white/40">{alien.general.species}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
export default AlienSelector;
