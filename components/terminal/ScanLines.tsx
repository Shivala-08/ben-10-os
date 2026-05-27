'use client';

import React from 'react';

export function ScanLines() {
  return (
    <div className="absolute inset-0 z-50 pointer-events-none overflow-hidden rounded-none">
      {/* Moving horizontal scanning laser line */}
      <div 
        className="absolute top-0 left-0 w-full h-[6px] bg-emerald-500/10 mix-blend-screen opacity-70"
        style={{
          animation: 'scanbeam 7s linear infinite'
        }}
      />

      {/* Repeating fine CRT scanlines grid */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.3)_50%)] bg-[size:100%_4px]" />

      {/* Glassmorphic curved screen reflections & CRT flicker bloom */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_30%,rgba(0,0,0,0.45)_95%)] pointer-events-none" />

      {/* Screen flicker glow overlay */}
      <div 
        className="absolute inset-0 bg-[#00ff41]/[0.006] pointer-events-none mix-blend-color-dodge"
        style={{
          animation: 'crtflicker 0.15s infinite'
        }}
      />

      <style jsx global>{`
        @keyframes scanbeam {
          0% {
            transform: translateY(-100%);
          }
          100% {
            transform: translateY(100vh);
          }
        }
        @keyframes crtflicker {
          0% { opacity: 0.98; }
          50% { opacity: 1.02; }
          100% { opacity: 0.99; }
        }
      `}</style>
    </div>
  );
}
export default ScanLines;
