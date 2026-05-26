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
import { Canvas, useThree } from '@react-three/fiber';
import { EffectComposer, Bloom, Noise, Vignette, ChromaticAberration } from '@react-three/postprocessing';
import { NavBar } from '@/components/ui/NavBar';
import { HUDFrame } from '@/components/ui/HUDFrame';
import { useMouseParallax } from '@/hooks/useMouseParallax';

import { useEffect, useRef } from 'react';
import { TransformSequence } from '@/components/transformation/TransformSequence';
import { CursorTrail } from '@/components/cursor/CursorTrail';
import gsap from 'gsap';

function CameraPullback() {
  const { camera } = useThree();
  useEffect(() => {
    gsap.fromTo(camera.position, { z: 1.5 }, { z: 5, duration: 0.8, ease: 'power2.out' });
  }, [camera]);
  return null;
}

function TransformAberration() {
  const ref = useRef<any>(null);
  useEffect(() => {
    if (!ref.current) return;
    const initialOffset = { x: 0.018, y: 0.018 };
    gsap.to(initialOffset, {
      x: 0.001,
      y: 0.001,
      duration: 0.6,
      ease: 'power2.out',
      onUpdate: () => {
        if (ref.current && ref.current.offset) {
          ref.current.offset.set(initialOffset.x, initialOffset.y);
        }
      }
    });
  }, []);

  return <ChromaticAberration ref={ref} offset={[0.018, 0.018]} />;
}

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
      <CursorTrail />
      <NavBar />
      <HUDFrame />

      {!bootComplete && <BootSequence />}

      {bootComplete && !activeAlien && (
        <>
          <div ref={tiltRef} className="fixed inset-0 w-full h-full z-10 flex flex-col justify-between p-8 pt-24 pb-16 pointer-events-none">
            <div className="w-full h-full pointer-events-auto relative">
              <AlienWheel />
              <div className="absolute inset-0 flex flex-col items-center justify-between p-8 pt-16 z-20 pointer-events-none">
                <h1 className="text-4xl md:text-6xl font-display text-[#00FF41] tracking-widest uppercase text-center drop-shadow-[0_0_15px_rgba(0,255,65,0.5)] select-none">
                  SELECT ALIEN
                </h1>
                <p className="text-[#00FF41]/60 font-mono text-sm tracking-widest uppercase text-center select-none">
                  Scroll or Drag to Rotate // Click to Transform
                </p>
              </div>
              <SurpriseButton />
            </div>
          </div>
          {/* Scroll spacer to give Lenis scrolling height */}
          <div className="h-[400vh] w-full pointer-events-none" />
        </>
      )}

      {bootComplete && activeAlien && (
        <div className="relative z-20 min-h-screen w-full bg-[var(--color-bg)] transition-colors duration-500">
          <div className="fixed inset-0 pointer-events-none z-0">
            <Canvas camera={{ position: [0, 0, 5] }}>
              <ParticleField />
              <CameraPullback />
              <EffectComposer>
                <Bloom luminanceThreshold={0.15} intensity={1.5} mipmapBlur />
                <TransformAberration />
                <Noise opacity={0.03} />
                <Vignette eskil={false} offset={0.3} darkness={0.8} />
              </EffectComposer>
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
