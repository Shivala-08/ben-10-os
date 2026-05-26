'use client';

import { useEffect, useState } from 'react';
import Lenis from '@studio-freight/lenis';
import { useOmnitrixStore } from '@/lib/store/useOmnitrixStore';

export function useLenis() {
  const [lenis, setLenis] = useState<Lenis | null>(null);
  const setWheelRotation = useOmnitrixStore((state) => state.setWheelRotation);

  useEffect(() => {
    const lenisInstance = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
    });

    setLenis(lenisInstance);

    lenisInstance.on('scroll', (e: any) => {
      // Map scroll position to wheel rotation
      // Here e.animatedScroll is the current scroll position
      setWheelRotation(e.animatedScroll * 0.005); 
    });

    function raf(time: number) {
      lenisInstance.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenisInstance.destroy();
    };
  }, [setWheelRotation]);

  return lenis;
}
