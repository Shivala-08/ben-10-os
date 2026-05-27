'use client';

import React, { useRef, useEffect } from 'react';

interface VoiceVisualizerProps {
  analyser: AnalyserNode | null;
}

export function VoiceVisualizer({ analyser }: VoiceVisualizerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!analyser) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const draw = () => {
      const width = canvas.width = 120;
      const height = canvas.height = 36;
      ctx.clearRect(0, 0, width, height);

      // Read current primary color dynamically
      const primaryColor = getComputedStyle(document.documentElement)
        .getPropertyValue('--color-primary')
        .trim() || '#00FF41';

      analyser.getByteFrequencyData(dataArray);

      const barWidth = (width / bufferLength) * 1.5;
      let x = 0;

      ctx.fillStyle = primaryColor;
      ctx.shadowColor = primaryColor;
      ctx.shadowBlur = 4;

      for (let i = 0; i < bufferLength; i++) {
        // Normalize bar height
        const val = dataArray[i];
        const percent = val / 255;
        const barHeight = Math.max(2, height * percent);

        ctx.fillRect(x, height - barHeight, barWidth - 1.5, barHeight);
        x += barWidth;
      }

      animationId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animationId);
    };
  }, [analyser]);

  if (!analyser) return null;

  return (
    <canvas 
      ref={canvasRef} 
      className="w-[120px] h-9 block pointer-events-none select-none relative z-10"
    />
  );
}
export default VoiceVisualizer;
