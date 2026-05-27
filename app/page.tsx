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
import { useIdleAnimations } from '@/hooks/useIdleAnimations';

import { useEffect, useRef, useState } from 'react';
import { TransformSequence } from '@/components/transformation/TransformSequence';
import { CursorTrail } from '@/components/cursor/CursorTrail';
import gsap from 'gsap';

function CameraPullback() {
  const { camera } = useThree();
  const setIsTransforming = useOmnitrixStore((state) => state.setIsTransforming);
  useEffect(() => {
    gsap.fromTo(camera.position, { z: 1.5 }, { z: 5, duration: 0.8, ease: 'power2.out' });
    
    const timer = setTimeout(() => {
      setIsTransforming(false);
    }, 800);

    return () => clearTimeout(timer);
  }, [camera, setIsTransforming]);
  return null;
}

function TransformAberration() {
  const [offset, setOffset] = useState<[number, number]>([0.018, 0.018]);

  useEffect(() => {
    const initialOffset = { x: 0.018, y: 0.018 };
    const tween = gsap.to(initialOffset, {
      x: 0.001,
      y: 0.001,
      duration: 0.6,
      ease: 'power2.out',
      onUpdate: () => {
        setOffset([initialOffset.x, initialOffset.y]);
      }
    });

    return () => {
      tween.kill();
    };
  }, []);

  return <ChromaticAberration offset={offset} />;
}

export default function Home() {
  const bootComplete = useOmnitrixStore((state) => state.bootComplete);
  const activeAlien = useOmnitrixStore((state) => state.activeAlien);
  const tiltRef = useMouseParallax(5); // Smooth sci-fi tilt effect
  
  // Register GSAP continuous UI breathing loops
  useIdleAnimations(bootComplete);

  // Initialize Lenis smooth scroll
  useLenis();

  // Global Keyboard Shortcuts (Escape to exit alien view, M to toggle mute)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (document.activeElement?.tagName === 'INPUT' || document.activeElement?.tagName === 'TEXTAREA') {
        return;
      }

      if (e.key === 'Escape') {
        const active = useOmnitrixStore.getState().activeAlien;
        if (active) {
          useOmnitrixStore.getState().setActiveAlien(null);
        }
      } else if (e.key.toLowerCase() === 'm') {
        const muted = useOmnitrixStore.getState().isMuted;
        useOmnitrixStore.getState().setIsMuted(!muted);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

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
