'use client';

import React, { useEffect, useRef } from 'react';
import { useOmnitrixStore } from '@/lib/store/useOmnitrixStore';
import { themes } from '@/lib/themes';

export function CursorTrail() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const activeAlien = useOmnitrixStore((state) => state.activeAlien);
  
  // Circular buffer to hold trailing mouse positions
  const positionsRef = useRef<{ x: number; y: number }[]>([]);
  const mouseRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Handle high DPI screens
    const resizeCanvas = () => {
      canvas.width = window.innerWidth * window.devicePixelRatio;
      canvas.height = window.innerHeight * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };

    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };

    window.addEventListener('mousemove', handleMouseMove);

    let animationFrameId: number;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Add current mouse position to buffer
      const positions = positionsRef.current;
      positions.push({ ...mouseRef.current });

      // Cap size to 10 positions for a premium visual trail
      if (positions.length > 10) {
        positions.shift();
      }

      // Draw the energy trailing dots
      if (positions.length > 1) {
        const theme = activeAlien ? themes[activeAlien] : null;
        const color = theme ? theme.colors.primary : '#00FF41';

        for (let i = 0; i < positions.length; i++) {
          const pos = positions[i];
          const ratio = i / positions.length; // 0 (oldest) to 1 (newest)
          const opacity = ratio * 0.7;
          const radius = ratio * 5; // taper size

          ctx.beginPath();
          ctx.arc(pos.x, pos.y, radius, 0, Math.PI * 2);
          ctx.fillStyle = color;
          ctx.globalAlpha = opacity;
          
          // Add neon glow
          ctx.shadowBlur = 10;
          ctx.shadowColor = color;
          
          ctx.fill();
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, [activeAlien]);

  // Flush buffer on alien theme swap
  useEffect(() => {
    positionsRef.current = [];
  }, [activeAlien]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-[9998]"
      style={{ width: '100vw', height: '100vh' }}
    />
  );
}
export default CursorTrail;
