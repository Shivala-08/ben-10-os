'use client';

import React, { useEffect } from 'react';
import { motion } from 'framer-motion';

interface AccessDeniedProps {
  alienName: string;
  onClose: () => void;
}

export function AccessDenied({ alienName, onClose }: AccessDeniedProps) {
  useEffect(() => {
    // Automatically close the overlay after 3 seconds
    const timer = setTimeout(() => {
      onClose();
    }, 3200);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center pointer-events-none">
      {/* Dark translucent backdrop */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/60 pointer-events-auto backdrop-blur-[2px]"
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: -15 }}
        transition={{ type: 'spring', damping: 20, stiffness: 150 }}
        className="bg-black/90 border border-red-500/60 p-8 rounded-lg shadow-[0_0_40px_rgba(239,68,68,0.3)] text-center max-w-sm pointer-events-auto backdrop-blur-md relative overflow-hidden z-10"
      >
        {/* Glitchy red warning scanning grid */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(239,68,68,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(239,68,68,0.03)_1px,transparent_1px)] bg-[size:10px_10px] pointer-events-none" />
        
        <h2 className="text-red-500 font-display text-2xl tracking-widest uppercase mb-3 select-none flex items-center justify-center gap-2">
          <span>⚠️</span> ACCESS DENIED
        </h2>
        
        <p className="text-white/95 font-mono text-[11px] tracking-wider uppercase mb-5 select-none">
          DNA PROFILE FOR <span className="text-red-400 font-bold">{alienName}</span> IS UNSEQUENCED
        </p>

        <div className="text-red-400 font-mono text-[10px] leading-relaxed uppercase tracking-widest border-t border-red-500/30 pt-5 select-none animate-pulse">
          BIOMETRIC SYSTEM SECURED
          <br />
          <span className="text-white/60 text-[9px] block mt-1">Select card again to force DNA sequence override</span>
        </div>
      </motion.div>
    </div>
  );
}
export default AccessDenied;
