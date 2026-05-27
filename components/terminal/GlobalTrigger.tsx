'use client';

import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { synth } from '@/lib/utils/WebAudioSynth';

const TARGET_SEQUENCE = 'omnitrix';

export function GlobalTrigger() {
  const sequence = useRef<string[]>([]);
  const router = useRouter();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Prevent triggering if user is inputting text inside form inputs
      if (
        document.activeElement?.tagName === 'INPUT' || 
        document.activeElement?.tagName === 'TEXTAREA' ||
        document.activeElement?.getAttribute('contenteditable') === 'true'
      ) {
        return;
      }

      const key = e.key.toLowerCase();
      const nextChar = TARGET_SEQUENCE[sequence.current.length];

      if (key === nextChar) {
        sequence.current.push(key);
        
        if (sequence.current.join('') === TARGET_SEQUENCE) {
          // Play energetic glitch audio feedback
          synth.playMalfunction();

          // Flash screen temporary danger-red before routing
          const flash = document.createElement('div');
          flash.className = 'fixed inset-0 bg-red-600/30 z-[9999] pointer-events-none transition-opacity duration-300';
          document.body.appendChild(flash);
          
          setTimeout(() => {
            flash.style.opacity = '0';
            setTimeout(() => flash.remove(), 300);
          }, 300);

          // Route to console takeover!
          router.push('/terminal');
          sequence.current = [];
        }
      } else {
        // Reset buffers, but check if the typed key starts the sequence again
        if (key === TARGET_SEQUENCE[0]) {
          sequence.current = [key];
        } else {
          sequence.current = [];
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [router]);

  return null;
}
export default GlobalTrigger;
