'use client';

import React from 'react';

interface ClockHandsProps {
  hours: number;
  minutes: number;
  seconds: number;
}

export function ClockHands({ hours, minutes, seconds }: ClockHandsProps) {
  // Compute degrees for each clock hand
  const secDeg = (seconds / 60) * 360;
  const minDeg = ((minutes + seconds / 60) / 60) * 360;
  const hrDeg = (((hours % 12) + minutes / 60) / 12) * 360;

  return (
    <g className="select-none pointer-events-none filter drop-shadow-[0_0_8px_var(--color-primary,#00FF41)]">
      {/* Hours Hand */}
      <line
        x1="100"
        y1="100"
        x2="100"
        y2="52"
        stroke="var(--color-primary, #00FF41)"
        strokeWidth="4"
        strokeLinecap="round"
        transform={`rotate(${hrDeg} 100 100)`}
        className="transition-transform duration-500"
      />

      {/* Minutes Hand */}
      <line
        x1="100"
        y1="100"
        x2="100"
        y2="34"
        stroke="var(--color-primary, #00FF41)"
        strokeWidth="2.5"
        strokeLinecap="round"
        transform={`rotate(${minDeg} 100 100)`}
        className="transition-transform duration-300"
      />

      {/* Seconds Hand */}
      <line
        x1="100"
        y1="100"
        x2="100"
        y2="24"
        stroke="#FF4444" // sleek warning red seconds hand
        strokeWidth="1.2"
        strokeLinecap="round"
        transform={`rotate(${secDeg} 100 100)`}
      />

      {/* Center cap node pin */}
      <circle 
        cx="100" 
        cy="100" 
        r="4.5" 
        fill="var(--color-primary, #00FF41)" 
        stroke="#000" 
        strokeWidth="1.5" 
      />
    </g>
  );
}
export default ClockHands;
