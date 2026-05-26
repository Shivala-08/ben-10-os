'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';

export function useMouseParallax(intensity: number = 10) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const onMouseMove = (e: MouseEvent) => {
      const { innerWidth, innerHeight } = window;
      const x = (e.clientX / innerWidth - 0.5) * 2; // -1 to 1
      const y = (e.clientY / innerHeight - 0.5) * 2; // -1 to 1

      // Smoothly animate the rotational offsets
      gsap.to(element, {
        rotateY: x * intensity,
        rotateX: -y * intensity,
        transformPerspective: 1000,
        ease: 'power2.out',
        duration: 0.5,
      });
    };

    window.addEventListener('mousemove', onMouseMove);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      // Reset rotation on unmount
      gsap.to(element, {
        rotateY: 0,
        rotateX: 0,
        duration: 0.5,
      });
    };
  }, [intensity]);

  return ref;
}
