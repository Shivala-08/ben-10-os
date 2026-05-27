'use client';

import { useEffect } from 'react';
import { useOmnitrixStore } from '@/lib/store/useOmnitrixStore';
import gsap from 'gsap';

export function useIdleAnimations(bootComplete: boolean) {
  useEffect(() => {
    if (!bootComplete) return;

    // Check prefers-reduced-motion accessibility preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    // Create the master GSAP context to ensure safe cleaning on unmount
    const ctx = gsap.context(() => {
      // 1. HUD frame corners: slow breathing opacity pulse
      gsap.to('.hud-corner', {
        opacity: 0.85,
        duration: 3,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        stagger: {
          each: 0.75,
          from: 'random'
        }
      });

      // 2. Active alien title name: floating up and down
      gsap.to('.alien-name', {
        y: -5,
        duration: 4,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut'
      });

      // 3. Stats details cards: subtle glowing pulse on border/shadow
      gsap.to('.stat-card', {
        boxShadow: '0 0 20px var(--color-glow)',
        borderColor: 'var(--color-primary)',
        duration: 2.5,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        stagger: 0.4
      });

      // 4. Abilities chips: slow staggered opacity shimmers
      gsap.to('.ability-chip', {
        opacity: 0.75,
        duration: 1.8,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        stagger: 0.15
      });
    });

    return () => {
      ctx.revert();
    };
  }, [bootComplete]);
}
