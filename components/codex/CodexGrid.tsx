'use client';

import React from 'react';
import { Alien } from '@/lib/api/types';
import { CodexCard } from './CodexCard';
import { motion } from 'framer-motion';

interface CodexGridProps {
  aliens: Alien[];
  onCardClick: (alien: Alien) => void;
}

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.02
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  show: { opacity: 1, y: 0, transition: { type: 'spring' as const, stiffness: 200, damping: 18 } }
};

export function CodexGrid({ aliens, onCardClick }: CodexGridProps) {
  if (aliens.length === 0) {
    return (
      <div className="w-full py-16 flex flex-col items-center justify-center text-center font-mono text-[#00FF41]/35 select-none uppercase tracking-widest text-[11px] border border-[#00FF41]/10 bg-black/40 rounded">
        <span>NO SPECIMEN RECORD COMPATIBLE IN DNA CORE</span>
        <span className="text-[9px] mt-1 text-[#00FF41]/20">Awaiting database query refactoring...</span>
      </div>
    );
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4"
    >
      {aliens.map((alien) => (
        <motion.div key={alien._id} variants={itemVariants}>
          <CodexCard alien={alien} onClick={() => onCardClick(alien)} />
        </motion.div>
      ))}
    </motion.div>
  );
}
export default CodexGrid;
