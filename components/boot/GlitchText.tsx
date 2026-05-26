'use client';

import { useEffect, useState, useRef } from 'react';
import gsap from 'gsap';

interface GlitchTextProps {
  text: string;
  onComplete?: () => void;
}

export function GlitchText({ text, onComplete }: GlitchTextProps) {
  const [displayText, setDisplayText] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const chars = '01⬡⎔[]/\\*+-=<>_#@$%';
    let currentIteration = 0;
    const finalLength = text.length;
    let interval: NodeJS.Timeout;

    // Typewriter with scramble
    interval = setInterval(() => {
      let result = '';
      
      for (let i = 0; i < finalLength; i++) {
        if (i < currentIteration) {
          result += text[i];
        } else if (i < currentIteration + 3) {
          result += chars[Math.floor(Math.random() * chars.length)];
        } else {
          result += ''; // Hidden or empty space to keep typewriter vibe
        }
      }

      setDisplayText(result);

      if (currentIteration >= finalLength) {
        clearInterval(interval);
        if (onComplete) {
          onComplete();
        }
      }
      
      currentIteration += 0.5; // Controls the speed of writing
    }, 40);

    // Apply rapid flickering glitch effect on container
    if (containerRef.current) {
      gsap.to(containerRef.current, {
        skewX: () => Math.random() > 0.95 ? (Math.random() - 0.5) * 20 : 0,
        x: () => Math.random() > 0.95 ? (Math.random() - 0.5) * 8 : 0,
        opacity: () => Math.random() > 0.98 ? 0.4 : 1,
        duration: 0.1,
        repeat: -1,
        yoyo: true,
        ease: 'power1.inOut',
      });
    }

    return () => {
      clearInterval(interval);
    };
  }, [text, onComplete]);

  return (
    <div
      ref={containerRef}
      className="font-display text-[#00FF41] text-2xl md:text-4xl tracking-widest uppercase font-bold text-center relative select-none animate-text-glitch"
      style={{
        fontFamily: 'var(--font-display, monospace)',
        textShadow: '0 0 10px rgba(0, 255, 65, 0.8), 0 0 20px rgba(0, 255, 65, 0.4)',
      }}
    >
      {displayText}
    </div>
  );
}
