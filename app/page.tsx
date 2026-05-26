'use client';

import { useOmnitrixStore } from '@/lib/store/useOmnitrixStore';
import { BootSequence } from '@/components/boot/BootSequence';
import { AlienWheel } from '@/components/wheel/AlienWheel';
import { ThemeSwapper } from '@/components/transformation/ThemeSwapper';
import { SoundManager } from '@/components/transformation/SoundManager';
import { CustomCursor } from '@/components/cursor/CustomCursor';
import { SurpriseButton } from '@/components/ui/SurpriseButton';
import { useLenis } from '@/hooks/useLenis';
import { ParticleField } from '@/components/alien-world/ParticleField';
import { AlienHero } from '@/components/alien-world/AlienHero';
import { AbilitiesGrid } from '@/components/alien-world/AbilitiesGrid';
import { StatCards } from '@/components/alien-world/StatCards';
import { Canvas } from '@react-three/fiber';
import { NavBar } from '@/components/ui/NavBar';
import { HUDFrame } from '@/components/ui/HUDFrame';
import { useMouseParallax } from '@/hooks/useMouseParallax';

import { TransformSequence } from '@/components/transformation/TransformSequence';

export default function Home() {
  const bootComplete = useOmnitrixStore((state) => state.bootComplete);
  const activeAlien = useOmnitrixStore((state) => state.activeAlien);
  const tiltRef = useMouseParallax(5); // Smooth sci-fi tilt effect
  
  // Initialize Lenis smooth scroll
  useLenis();

  return (
    <main className="min-h-screen bg-black text-white overflow-x-hidden transition-colors duration-500 relative selection:bg-[var(--color-primary)] selection:text-black">
      <ThemeSwapper />
      <SoundManager />
      <TransformSequence />
      <CustomCursor />
      <NavBar />
      <HUDFrame />

      {!bootComplete && <BootSequence />}

      {bootComplete && !activeAlien && (
        <div ref={tiltRef} className="fixed inset-0 w-full h-full z-10 flex flex-col justify-between p-8 pt-24 pb-16">
          <AlienWheel />
          <h1 className="text-4xl md:text-6xl font-display text-[#00FF41] tracking-widest uppercase text-center drop-shadow-[0_0_15px_rgba(0,255,65,0.5)] z-20 pointer-events-none select-none select-none">
            SELECT ALIEN
          </h1>
          <p className="text-[#00FF41]/60 font-mono text-sm tracking-widest uppercase text-center z-20 pointer-events-none select-none">
            Scroll or Drag to Rotate // Click to Transform
          </p>
          <SurpriseButton />
        </div>
      )}

      {bootComplete && activeAlien && (
        <div className="relative z-20 min-h-screen w-full bg-[var(--color-bg)] transition-colors duration-500">
          <div className="fixed inset-0 pointer-events-none z-0">
            <Canvas camera={{ position: [0, 0, 5] }}>
              <ParticleField />
            </Canvas>
          </div>
          
          <div ref={tiltRef} className="relative z-10 w-full max-w-6xl mx-auto px-6 py-24 space-y-24">
             {/* We will implement AlienHero, StatCards, AbilitiesGrid which take the activeAlien ID as prop */}
             <AlienHero alienId={activeAlien} />
             <StatCards alienId={activeAlien} />
             <AbilitiesGrid alienId={activeAlien} />
          </div>

          <SurpriseButton />
        </div>
      )}
    </main>
  );
}
