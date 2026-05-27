'use client';

import { EffectComposer, Bloom, ChromaticAberration, Noise, Vignette } from '@react-three/postprocessing';
import { BlendFunction } from 'postprocessing';
import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

interface PostProcessingProps {
  isTransforming: boolean;
}

export function PostProcessing({ isTransforming }: PostProcessingProps) {
  const [reducedMotion, setReducedMotion] = useState(false);
  const [aberrationOffset, setAberrationOffset] = useState<[number, number]>([0.0005, 0.0005]);

  // Check prefers-reduced-motion accessibility preference on mount
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mediaQuery.matches);

    const listener = (e: MediaQueryListEvent) => {
      setReducedMotion(e.matches);
    };

    mediaQuery.addEventListener('change', listener);
    return () => mediaQuery.removeEventListener('change', listener);
  }, []);

  // Handle transformation Chromatic Aberration spikes with GSAP lerp
  useEffect(() => {
    if (reducedMotion) {
      setAberrationOffset([0, 0]);
      return;
    }

    if (isTransforming) {
      // Aberration spikes instantly to peak
      const currentOffset = { x: 0.025, y: 0.025 };
      setAberrationOffset([currentOffset.x, currentOffset.y]);

      // GSAP smooth lerp back to normal over 800ms
      const tween = gsap.to(currentOffset, {
        x: 0.0005,
        y: 0.0005,
        duration: 0.8,
        ease: 'power2.out',
        onUpdate: () => {
          setAberrationOffset([currentOffset.x, currentOffset.y]);
        }
      });

      return () => {
        tween.kill();
      };
    } else {
      // Default rest state
      setAberrationOffset([0.0005, 0.0005]);
    }
  }, [isTransforming, reducedMotion]);

  // Apply visual configurations & respect reduced motion (skip aberration, half bloom intensity)
  const bloomIntensity = reducedMotion ? 0.75 : 1.5;

  return (
    <EffectComposer>
      <Bloom 
        luminanceThreshold={0.2}
        luminanceSmoothing={0.9}
        intensity={bloomIntensity}
        mipmapBlur
      />
      
      <ChromaticAberration 
        offset={aberrationOffset as any}
      />

      <Noise 
        opacity={0.04}
        blendFunction={BlendFunction.SCREEN}
      />

      <Vignette 
        offset={0.3}
        darkness={0.8}
      />
    </EffectComposer>
  );
}
