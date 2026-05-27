'use client';

import React, { useRef, useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchAllAliens } from '@/lib/api/ben10';
import { Alien } from '@/lib/api/types';
import { synth } from '@/lib/utils/WebAudioSynth';

interface RadarBlip {
  id: string;
  x: number; // relative to canvas center
  y: number; // relative to canvas center
  angle: number; // angle from center
  distance: number; // distance from center
  alienName: string;
  species: string;
  lifespan: number; // in seconds, default 8s
  created: number; // spawn timestamp
  pulseState: number; // sinus tracker
}

export function AlienRadar() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { data } = useQuery({
    queryKey: ['aliens'],
    queryFn: fetchAllAliens,
    staleTime: Infinity,
  });

  const aliens = data?.aliens || [];
  
  const [blips, setBlips] = useState<RadarBlip[]>([]);
  const [selectedBlip, setSelectedBlip] = useState<RadarBlip | null>(null);
  const [tooltipPos, setTooltipPos] = useState<{ x: number; y: number } | null>(null);
  const blipsRef = useRef<RadarBlip[]>([]);

  // Periodically attempt to spawn random bio-signal radar blips
  useEffect(() => {
    if (aliens.length === 0) return;

    const interval = setInterval(() => {
      // 30% chance to spawn, max 5 active
      if (Math.random() < 0.3 && blipsRef.current.length < 5) {
        const randomAlien = aliens[Math.floor(Math.random() * aliens.length)];
        const canvas = canvasRef.current;
        if (!canvas) return;

        const maxDist = Math.min(canvas.width, canvas.height) * 0.4;
        const distance = 40 + Math.random() * (maxDist - 40);
        const angle = Math.random() * Math.PI * 2;
        
        const x = Math.cos(angle) * distance;
        const y = Math.sin(angle) * distance;

        const newBlip: RadarBlip = {
          id: Math.random().toString(36).substring(2, 9) + Date.now(),
          x,
          y,
          angle,
          distance,
          alienName: randomAlien.general.name,
          species: randomAlien.general.species,
          lifespan: 8000, // 8 seconds spec lifespan
          created: Date.now(),
          pulseState: 0
        };

        const updated = [...blipsRef.current, newBlip];
        blipsRef.current = updated;
        setBlips(updated);
        
        // Play soft bio sensor sweep radar click
        synth.playClick();
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [aliens]);

  // Handle blips expiration
  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      const updated = blipsRef.current.filter((b) => now - b.created < b.lifespan);
      
      if (updated.length !== blipsRef.current.length) {
        blipsRef.current = updated;
        setBlips(updated);
        
        // De-select selected if it expired
        if (selectedBlip && !updated.some((b) => b.id === selectedBlip.id)) {
          setSelectedBlip(null);
          setTooltipPos(null);
        }
      }
    }, 100);

    return () => clearInterval(interval);
  }, [selectedBlip]);

  // Main Canvas-2D sweep drawing loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let sweepAngle = 0;

    const resizeCanvas = () => {
      const rect = canvas.parentElement?.getBoundingClientRect();
      canvas.width = rect?.width || 600;
      canvas.height = rect?.height || 600;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const render = () => {
      const width = canvas.width;
      const height = canvas.height;
      const center = { x: width / 2, y: height / 2 };
      const maxRadius = Math.min(width, height) * 0.45;

      // Read current primary CSS color dynamically (theme sync)
      const primaryColor = getComputedStyle(document.documentElement)
        .getPropertyValue('--color-primary')
        .trim() || '#00FF41';

      // Clear with slight trailing opacity fade
      ctx.fillStyle = 'rgba(0, 0, 0, 0.12)';
      ctx.fillRect(0, 0, width, height);

      // Draw concentric radar lines grid
      ctx.strokeStyle = primaryColor;
      ctx.lineWidth = 1;
      
      ctx.shadowBlur = 0;
      for (let i = 1; i <= 4; i++) {
        ctx.beginPath();
        ctx.arc(center.x, center.y, maxRadius * (i / 4), 0, Math.PI * 2);
        ctx.strokeStyle = `${primaryColor}22`; // highly translucent
        ctx.stroke();
      }

      // Draw circular radar bounds border
      ctx.beginPath();
      ctx.arc(center.x, center.y, maxRadius, 0, Math.PI * 2);
      ctx.strokeStyle = `${primaryColor}aa`;
      ctx.stroke();

      // Crosshairs lines
      ctx.beginPath();
      ctx.moveTo(center.x - maxRadius, center.y);
      ctx.lineTo(center.x + maxRadius, center.y);
      ctx.moveTo(center.x, center.y - maxRadius);
      ctx.lineTo(center.x, center.y + maxRadius);
      ctx.strokeStyle = `${primaryColor}15`;
      ctx.stroke();

      // Draw active pulsing radar blips
      const now = Date.now();
      blipsRef.current.forEach((blip) => {
        const age = now - blip.created;
        const opacity = Math.max(0, 1 - age / blip.lifespan);

        // Blip pulse expansion ring
        blip.pulseState += 0.05;
        const pulseRad = 6 + Math.sin(blip.pulseState) * 4;

        ctx.shadowColor = primaryColor;
        ctx.shadowBlur = 10;
        
        ctx.beginPath();
        ctx.arc(center.x + blip.x, center.y + blip.y, 4, 0, Math.PI * 2);
        ctx.fillStyle = `${primaryColor}${Math.floor(opacity * 255).toString(16).padStart(2, '0')}`;
        ctx.fill();

        ctx.shadowBlur = 0;
        ctx.beginPath();
        ctx.arc(center.x + blip.x, center.y + blip.y, pulseRad, 0, Math.PI * 2);
        ctx.strokeStyle = `${primaryColor}${Math.floor(opacity * 40).toString(16).padStart(2, '0')}`;
        ctx.stroke();
      });

      // Draw sweeping sector gradient tail
      ctx.save();
      ctx.translate(center.x, center.y);
      ctx.rotate(sweepAngle);
      
      const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, maxRadius);
      gradient.addColorStop(0, `${primaryColor}00`);
      gradient.addColorStop(1, `${primaryColor}11`);
      
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      // Sweep sector angle slice (faded cone)
      ctx.arc(0, 0, maxRadius, -0.22, 0);
      ctx.closePath();
      ctx.fill();

      // Draw primary sweep leading laser vector
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(maxRadius, 0);
      ctx.strokeStyle = `${primaryColor}88`;
      ctx.lineWidth = 1.5;
      ctx.stroke();
      ctx.restore();

      // Increment rotation angle
      sweepAngle += 0.015;
      if (sweepAngle > Math.PI * 2) {
        sweepAngle = 0;
      }

      animationId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    const center = { x: canvas.width / 2, y: canvas.height / 2 };
    
    // Convert click coordinates relative to center
    const x = clickX - center.x;
    const y = clickY - center.y;

    // Check if clicked close to any blip (radius 15px trigger)
    const match = blipsRef.current.find((blip) => {
      const dx = blip.x - x;
      const dy = blip.y - y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      return dist <= 20;
    });

    if (match) {
      synth.playClick();
      setSelectedBlip(match);
      setTooltipPos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    } else {
      setSelectedBlip(null);
      setTooltipPos(null);
    }
  };

  return (
    <div className="w-full h-full relative select-none">
      <canvas
        ref={canvasRef}
        onClick={handleCanvasClick}
        className="w-full h-full block bg-black/90 cursor-crosshair z-10 relative"
      />

      {/* Floating bio scan hover tooltip card */}
      {selectedBlip && tooltipPos && (
        <div 
          className="absolute z-20 bg-black/95 border border-[#00FF41]/80 p-4 rounded shadow-[0_0_20px_rgba(0,255,65,0.4)] pointer-events-auto font-mono text-white text-[10px] w-52 flex flex-col gap-1 select-none animate-[pulse_1s_infinite]"
          style={{
            left: `${Math.min(tooltipPos.x + 10, (canvasRef.current?.width || 500) - 220)}px`,
            top: `${Math.min(tooltipPos.y + 10, (canvasRef.current?.height || 500) - 130)}px`
          }}
        >
          {/* Status grid */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.3)_50%)] bg-[size:100%_4px] pointer-events-none" />
          
          <div className="text-[#FFCC00] font-bold border-b border-[#00FF41]/30 pb-1 mb-1.5 uppercase select-none tracking-widest text-[9px]">
            ⚠️ LIFE FORM DETECTED
          </div>
          <div className="flex flex-col">
            <span className="text-[#00FF41]/50 uppercase text-[8px] font-medium tracking-wide">METAMORPHIC NAME</span>
            <span className="text-[#00FF41] font-bold text-xs uppercase tracking-wider">{selectedBlip.alienName}</span>
          </div>
          <div className="flex flex-col mt-1">
            <span className="text-[#00FF41]/50 uppercase text-[8px] font-medium tracking-wide">SPECIES INDEX</span>
            <span className="text-white uppercase tracking-wide">{selectedBlip.species}</span>
          </div>
        </div>
      )}
    </div>
  );
}
export default AlienRadar;
