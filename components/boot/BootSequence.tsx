'use client';

import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { OmnitrixPulse } from './OmnitrixPulse';
import { GlitchText } from './GlitchText';
import { useOmnitrixStore } from '@/lib/store/useOmnitrixStore';

export function BootSequence() {
  const containerRef = useRef<HTMLDivElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const [step, setStep] = useState(0);
  const setBootComplete = useOmnitrixStore((state) => state.setBootComplete);

  useEffect(() => {
    // Phase 1: Show Pulse and Text
    const timer1 = setTimeout(() => {
      setStep(1); // triggers "DNA SAMPLE DETECTED"
    }, 1000);

    // Phase 2: Show Progress Bar
    const timer2 = setTimeout(() => {
      setStep(2);
      
      // Animate progress bar
      if (progressBarRef.current) {
        gsap.to(progressBarRef.current, {
          width: '100%',
          duration: 1.5,
          ease: 'power2.inOut',
          onComplete: () => {
            // Phase 3: Fade out and complete
            gsap.to(containerRef.current, {
              opacity: 0,
              duration: 0.5,
              delay: 0.5,
              onComplete: () => setBootComplete(true),
            });
          }
        });
      }
    }, 3000);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, [setBootComplete]);

  return (
    <div 
      ref={containerRef}
      className="fixed inset-0 z-50 bg-black flex flex-col items-center justify-center space-y-12"
    >
      <OmnitrixPulse />
      
      <div className="h-16 flex items-center justify-center">
        {step >= 1 && <GlitchText text="DNA SAMPLE DETECTED" />}
      </div>

      <div className="w-64 max-w-[80vw] space-y-2 opacity-0 transition-opacity duration-500" style={{ opacity: step >= 2 ? 1 : 0 }}>
        <div className="text-[#00FF41] text-sm font-mono text-center tracking-widest">
          INITIALIZING OMNITRIX OS...
        </div>
        <div className="w-full h-1 bg-gray-900 overflow-hidden">
          <div ref={progressBarRef} className="h-full w-0 bg-[#00FF41] shadow-[0_0_10px_#00FF41]" />
        </div>
      </div>
    </div>
  );
}
