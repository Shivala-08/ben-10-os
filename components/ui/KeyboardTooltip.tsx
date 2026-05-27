'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export function KeyboardTooltip() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Check if the tooltip was already shown in this browser session
    const shown = sessionStorage.getItem('omnitrix_tooltip_shown');
    if (shown === 'true') return;

    // Gracefully fade in after boot animations conclude (1.8 seconds)
    const timerIn = setTimeout(() => {
      setVisible(true);
    }, 1800);

    // Fade out after displaying for 6 seconds
    const timerOut = setTimeout(() => {
      setVisible(false);
      sessionStorage.setItem('omnitrix_tooltip_shown', 'true');
    }, 7800);

    return () => {
      clearTimeout(timerIn);
      clearTimeout(timerOut);
    };
  }, []);

  return (
    <AnimatePresence>
      {visible ? (
        <motion.div
          initial={{ opacity: 0, y: 25, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 15, scale: 0.96 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="fixed bottom-10 left-1/2 -translate-x-1/2 z-40 bg-black/85 backdrop-blur-md border border-[#00FF41]/40 px-6 py-3 rounded shadow-[0_0_20px_rgba(0,255,65,0.2)] flex items-center justify-center font-mono text-[11px] text-[#00FF41] tracking-widest uppercase select-none pointer-events-none gap-2.5 text-center min-w-[280px] md:min-w-[450px]"
        >
          <span className="w-2 h-2 rounded-full bg-[#00FF41] animate-ping" />
          <span>&larr; &rarr; keys to rotate &middot; Enter to transform &middot; M to mute &middot; Esc to exit</span>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
export default KeyboardTooltip;
