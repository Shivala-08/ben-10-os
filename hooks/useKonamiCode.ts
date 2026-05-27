'use client';

import { useEffect, useRef } from 'react';

const KONAMI_CODE = [
  'arrowup',
  'arrowup',
  'arrowdown',
  'arrowdown',
  'arrowleft',
  'arrowright',
  'arrowleft',
  'arrowright',
  'b',
  'a'
];

export function useKonamiCode(onMatch: () => void) {
  const sequence = useRef<string[]>([]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Prevent triggering if user is inputting text
      if (
        document.activeElement?.tagName === 'INPUT' || 
        document.activeElement?.tagName === 'TEXTAREA' ||
        document.activeElement?.getAttribute('contenteditable') === 'true'
      ) {
        return;
      }

      const key = e.key.toLowerCase();
      const index = sequence.current.length;
      const expectedKey = KONAMI_CODE[index];

      if (key === expectedKey) {
        sequence.current.push(key);
        if (sequence.current.length === KONAMI_CODE.length) {
          onMatch();
          sequence.current = [];
        }
      } else {
        // Reset sequence. If this key is ArrowUp, start sequence anew.
        if (key === 'arrowup') {
          sequence.current = ['arrowup'];
        } else {
          sequence.current = [];
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onMatch]);
}
