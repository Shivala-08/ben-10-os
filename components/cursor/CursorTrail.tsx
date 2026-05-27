'use client';

import React, { useEffect, useRef } from 'react';
import { useOmnitrixStore } from '@/lib/store/useOmnitrixStore';
import { themes } from '@/lib/themes';

export function CursorTrail() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const activeAlien = useOmnitrixStore((state) => state.activeAlien);
  
  // Track primary color via ref to avoid re-running the RAF hook on theme change!
  const primaryColorRef = useRef('#00FF41');
  const targetPos = useRef({ x: 0, y: 0 });
  
  // Initialize trail dots positions
  const TRAIL_LENGTH = 8;
  const positionsRef = useRef<{ x: number; y: number }[]>(
    Array.from({ length: TRAIL_LENGTH }, () => ({ x: 0, y: 0 }))
  );

  // Sync color ref on theme change
  useEffect(() => {
    const theme = activeAlien ? themes[activeAlien] : null;
    primaryColorRef.current = theme ? theme.colors.primary : '#00FF41';
  }, [activeAlien]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth * window.devicePixelRatio;
      canvas.height = window.innerHeight * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };

    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    // Track mouse coordinates
    const handleMouseMove = (e: MouseEvent) => {
      targetPos.current = { x: e.clientX, y: e.clientY };
    };

    // Also support touch screens
    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches[0]) {
        targetPos.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('touchmove', handleTouchMove);

    // Initialize position values to mouse coordinate on first move
    let initialized = false;
    const handleFirstMove = (e: MouseEvent) => {
      const positions = positionsRef.current;
      for (let i = 0; i < TRAIL_LENGTH; i++) {
        positions[i] = { x: e.clientX, y: e.clientY };
      }
      targetPos.current = { x: e.clientX, y: e.clientY };
      initialized = true;
      window.removeEventListener('mousemove', handleFirstMove);
    };
    window.addEventListener('mousemove', handleFirstMove);

    let animationFrameId: number;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const positions = positionsRef.current;
      const target = targetPos.current;

      // Caterpillar lagging physics lerp
      // The head (index 0) lerps directly to the mouse target
      positions[0].x += (target.x - positions[0].x) * 0.22;
      positions[0].y += (target.y - positions[0].y) * 0.22;

      // All subsequent dots follow the preceding dot with lag/inertia!
      for (let i = 1; i < TRAIL_LENGTH; i++) {
        positions[i].x += (positions[i - 1].x - positions[i].x) * 0.32;
        positions[i].y += (positions[i - 1].y - positions[i].y) * 0.32;
      }

      // Draw particle trail dots
      const color = primaryColorRef.current;
      positions.forEach((pos, i) => {
        const ratio = 1 - i / TRAIL_LENGTH; // 1 (head) to 0 (tail)
        const opacity = ratio * 0.65;
        const radius = ratio * 4.5;

        if (opacity > 0.05) {
          ctx.beginPath();
          ctx.arc(pos.x, pos.y, radius, 0, Math.PI * 2);
          
          // Draw dynamic glow
          ctx.shadowBlur = ratio * 12;
          ctx.shadowColor = color;
          ctx.fillStyle = color;
          ctx.globalAlpha = opacity;
          
          ctx.fill();
        }
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('mousemove', handleFirstMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-[9998]"
      style={{ width: '100vw', height: '100vh' }}
    />
  );
}
export default CursorTrail;
