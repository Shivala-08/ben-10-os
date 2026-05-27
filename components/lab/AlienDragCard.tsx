'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Alien } from '@/lib/api/types';
import { BIG_10_NAMES } from '@/lib/api/ben10';

interface AlienDragCardProps {
  alien: Alien;
  onDragEnd: (alien: Alien, info: any) => void;
}

export function AlienDragCard({ alien, onDragEnd }: AlienDragCardProps) {
  const name = alien.general.name;
  const formattedId = name.toLowerCase().replace(' ', '_');
  const isMainRoster = BIG_10_NAMES.includes(name);

  return (
    <motion.div
      drag
      dragElastic={0.6}
      dragSnapToOrigin
      onDragEnd={(e, info) => onDragEnd(alien, info)}
      whileDrag={{ scale: 1.15, zIndex: 50, cursor: 'grabbing' }}
      className="bg-black/80 border border-[#00FF41]/25 hover:border-[#00FF41] p-3 rounded flex flex-col items-center gap-2 cursor-grab select-none relative pointer-events-auto transition-colors duration-300 w-24 h-28"
    >
      {/* Laser screen grid details */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(0,255,65,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,65,0.02)_1px,transparent_1px)] bg-[size:5px_5px] pointer-events-none" />

      {/* Thumbnail */}
      <div className="w-14 h-14 bg-black/60 rounded border border-[#00FF41]/10 flex items-center justify-center relative overflow-hidden pointer-events-none">
        {isMainRoster ? (
          <img
            src={`/aliens/${formattedId}.png`}
            alt={name}
            className="w-12 h-12 object-contain drop-shadow-[0_0_5px_rgba(0,255,65,0.3)]"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center p-1 bg-[radial-gradient(circle_at_center,transparent_30%,#000_90%)]">
            <span className="w-2 h-2 bg-[#00FF41] rounded-full animate-ping" />
            <span className="font-mono text-[6px] text-[#00FF41]/40 uppercase mt-1">GEN_DNA</span>
          </div>
        )}
      </div>

      {/* Text label */}
      <span className="font-mono text-[9px] uppercase text-[#00FF41] font-bold text-center tracking-wider truncate w-full select-none pointer-events-none drop-shadow-[0_0_2px_rgba(0,255,65,0.3)]">
        {name}
      </span>
    </motion.div>
  );
}
export default AlienDragCard;
