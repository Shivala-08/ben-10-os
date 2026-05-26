'use client';

import React, { useEffect, useState } from 'react';
import { useOmnitrixStore } from '@/lib/store/useOmnitrixStore';
import { themes } from '@/lib/themes';
import gsap from 'gsap';

export function TransformSequence() {
  const activeAlien = useOmnitrixStore((state) => state.activeAlien);
  const [isFlashing, setIsFlashing] = useState(false);
  const [flashColor, setFlashColor] = useState('#00FF41');

  useEffect(() => {
    if (!activeAlien) return;

    const theme = themes[activeAlien];
    if (theme) {
      setFlashColor(theme.colors.primary);
    } else {
      setFlashColor('#00FF41');
    }

    setIsFlashing(true);

    // Apply high-energy GSAP shake to the HTML body
    const body = document.body;
    if (body) {
      body.classList.add('animate-shake');
      setTimeout(() => {
        body.classList.remove('animate-shake');
      }, 500);
    }

    // Animate flash overlay fadeout
    const timer = setTimeout(() => {
      setIsFlashing(false);
    }, 600);

    return () => {
      clearTimeout(timer);
    };
  }, [activeAlien]);

  if (!isFlashing) return null;

  return (
    <div
      className="fixed inset-0 z-50 pointer-events-none flex items-center justify-center mix-blend-screen"
      style={{
        backgroundColor: flashColor,
        animation: 'flash-anim 0.5s cubic-bezier(0.1, 0.8, 0.3, 1) forwards',
      }}
    >
      <style jsx global>{`
        @keyframes flash-anim {
          0% { opacity: 1; filter: blur(0px); }
          50% { opacity: 0.8; filter: blur(10px); }
          100% { opacity: 0; filter: blur(20px); }
        }
      `}</style>
      
      {/* Dynamic central morph blast ring */}
      <div 
        className="w-[10vw] h-[10vw] border-8 rounded-full animate-ping opacity-75"
        style={{ borderColor: flashColor }}
      />
    </div>
  );
}
