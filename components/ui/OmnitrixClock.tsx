'use client';

import React, { useState, useEffect, useRef } from 'react';
import { ClockHands } from './ClockHands';
import { BIG_10_NAMES } from '@/lib/api/ben10';
import { useOmnitrixStore } from '@/lib/store/useOmnitrixStore';
import { synth } from '@/lib/utils/WebAudioSynth';
import { useRouter } from 'next/navigation';
import gsap from 'gsap';

export function OmnitrixClock() {
  const [time, setTime] = useState<Date | null>(null);
  const [isHourlySpinning, setIsHourlySpinning] = useState(false);
  const clockDialRef = useRef<HTMLDivElement>(null);

  const unlockAlien = useOmnitrixStore((state) => state.unlockAlien);
  const setActiveAlien = useOmnitrixStore((state) => state.setActiveAlien);
  const setIsTransforming = useOmnitrixStore((state) => state.setIsTransforming);
  const router = useRouter();

  // Smooth ticking loop
  useEffect(() => {
    setTime(new Date());

    const timer = setInterval(() => {
      const now = new Date();
      setTime(now);

      // Hourly Event Trigger Checks
      if (now.getMinutes() === 0 && now.getSeconds() === 0) {
        triggerHourlyEvent(now.getHours());
      }
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const triggerHourlyEvent = (currentHour: number) => {
    if (isHourlySpinning) return;
    
    setIsHourlySpinning(true);
    synth.playTransform();
    setIsTransforming(true);

    // Rotate clock dial index rapidly via GSAP
    if (clockDialRef.current) {
      gsap.to(clockDialRef.current, {
        rotation: '+=720',
        duration: 2.0,
        ease: 'power3.inOut',
        onComplete: () => {
          setIsHourlySpinning(false);
          setIsTransforming(false);

          // Resolve and activate alien of the hour (currentHour % 10)
          const targetIndex = (currentHour % 10 + 10) % 10;
          const alienName = BIG_10_NAMES[targetIndex];
          const formattedId = alienName.toLowerCase().replace(' ', '_');

          unlockAlien(formattedId);
          setTimeout(() => {
            setActiveAlien(formattedId);
            router.push(`/alien/${formattedId}`);
          }, 100);
        }
      });
    }
  };

  // Immediate simulation button to demonstrate the gorgeous transitions
  const handleTestTrigger = () => {
    const hr = time ? time.getHours() : new Date().getHours();
    triggerHourlyEvent(hr);
  };

  if (!time) {
    return (
      <div className="flex flex-col items-center justify-center font-mono text-[11px] text-[#00FF41]/40 uppercase tracking-[0.25em] animate-pulse">
        <span>⬡ ACCESSING CELLULAR CLOCK SIGNAL...</span>
      </div>
    );
  }

  const hours = time.getHours();
  const minutes = time.getMinutes();
  const seconds = time.getSeconds();

  const pad = (n: number) => String(n).padStart(2, '0');
  const digitalString = `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;

  return (
    <div className="flex flex-col items-center justify-center space-y-8 font-mono select-none relative z-10">
      {/* Curved CRT Filter */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.3)_50%)] bg-[size:100%_4px] pointer-events-none" />

      {/* Analog Clock Dial container */}
      <div 
        ref={clockDialRef}
        className="w-64 h-64 rounded-full border-[3px] border-[#00FF41]/30 hover:border-[#00FF41]/60 bg-black/60 relative flex items-center justify-center transition-all duration-300 shadow-[0_0_20px_rgba(0,255,65,0.1)] hover:shadow-[0_0_30px_rgba(0,255,65,0.2)]"
      >
        {/* Hologram concentric details */}
        <div className="absolute inset-4 rounded-full border border-dashed border-[#00FF41]/10" />
        <div className="absolute inset-16 rounded-full border border-dashed border-[#00FF41]/20 animate-[spin_40s_linear_infinite]" />

        {/* 10 Alien dial markers */}
        {BIG_10_NAMES.map((name, index) => {
          const angle = (index / 10) * Math.PI * 2 - Math.PI / 2;
          const radius = 104; // pixel offset from center
          const x = Math.cos(angle) * radius;
          const y = Math.sin(angle) * radius;

          return (
            <div
              key={name}
              className="absolute w-6 h-6 rounded-full bg-black border border-[#00FF41]/25 flex items-center justify-center text-[7px] text-[#00FF41]/60 hover:text-[#00FF41] transition-colors"
              style={{
                left: `calc(50% + ${x}px - 12px)`,
                top: `calc(50% + ${y}px - 12px)`,
              }}
              title={name}
            >
              {index + 1}
            </div>
          );
        })}

        {/* Inner SVG Clock hands container */}
        <svg 
          viewBox="0 0 200 200" 
          className="w-48 h-48 absolute z-20 pointer-events-none"
        >
          <ClockHands hours={hours} minutes={minutes} seconds={seconds} />
        </svg>
      </div>

      {/* Digital clock & Test trigger footer */}
      <div className="text-center space-y-4">
        <div className="px-6 py-2 border border-[#00FF41]/20 bg-black/80 rounded shadow-[0_0_15px_rgba(0,255,65,0.15)] inline-block select-text selection:bg-[#00FF41]/20 selection:text-white">
          <span className="text-white/45 text-[9px] uppercase tracking-widest block mb-0.5 select-none">DIGITAL TIMEFEED</span>
          <span className="text-[#00FF41] text-2xl font-bold tracking-widest font-mono drop-shadow-[0_0_5px_rgba(0,255,65,0.4)]">
            {digitalString}
          </span>
        </div>

        <div>
          <button
            onClick={handleTestTrigger}
            disabled={isHourlySpinning}
            className="px-4 py-2 border border-[#00FF41]/30 hover:border-[#00FF41] bg-black hover:bg-[#00FF41]/10 text-[10px] text-[#00FF41] font-bold uppercase tracking-widest rounded transition-all shadow-[0_0_10px_rgba(0,255,65,0.05)] cursor-pointer disabled:opacity-40"
          >
            {isHourlySpinning ? 'SPINNING MATRIX CORES...' : 'TEST HOURLY TRANSFORM EVENT'}
          </button>
        </div>
      </div>
    </div>
  );
}
export default OmnitrixClock;
