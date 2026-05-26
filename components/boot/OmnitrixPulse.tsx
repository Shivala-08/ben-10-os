'use client';
 
import { useEffect, useRef } from 'react';
import gsap from 'gsap';
 
export function OmnitrixPulse() {
  const svgRef = useRef<SVGSVGElement>(null);
  const hourglassPathRef = useRef<SVGPathElement>(null);
 
  useEffect(() => {
    if (!svgRef.current) return;
 
    const circles = svgRef.current.querySelectorAll('.pulse-circle');
    
    gsap.to(circles, {
      scale: 2,
      opacity: 0,
      duration: 2,
      stagger: 0.5,
      repeat: -1,
      ease: 'power2.out',
      transformOrigin: '50% 50%',
    });

    if (hourglassPathRef.current) {
      // Animate self-drawing path
      const path = hourglassPathRef.current;
      const length = path.getTotalLength();
      
      // Set initial styles
      gsap.set(path, {
        strokeDasharray: length,
        strokeDashoffset: length,
        fill: 'rgba(0, 255, 65, 0)',
        stroke: '#00FF41',
        strokeWidth: 4,
      });

      // Animate stroke and then fill
      gsap.timeline()
        .to(path, {
          strokeDashoffset: 0,
          duration: 2,
          ease: 'power1.inOut',
        })
        .to(path, {
          fill: '#00FF41',
          duration: 0.8,
          ease: 'power2.out',
        });
    }
  }, []);
 
  return (
    <div className="relative flex items-center justify-center w-64 h-64">
      <svg
        ref={svgRef}
        viewBox="0 0 100 100"
        className="w-full h-full overflow-visible absolute"
      >
        <circle className="pulse-circle" cx="50" cy="50" r="20" fill="none" stroke="#00FF41" strokeWidth="2" />
        <circle className="pulse-circle" cx="50" cy="50" r="20" fill="none" stroke="#00FF41" strokeWidth="2" />
        <circle className="pulse-circle" cx="50" cy="50" r="20" fill="none" stroke="#00FF41" strokeWidth="2" />
      </svg>
      {/* Core Omnitrix hourglass shape */}
      <div className="z-10 bg-black rounded-full p-4 border-4 border-[#00FF41] shadow-[0_0_30px_#00FF41_inset,0_0_20px_#00FF41] flex items-center justify-center w-28 h-28">
        <svg width="64" height="64" viewBox="0 0 100 100">
          <path
            ref={hourglassPathRef}
            d="M 20 20 L 80 20 L 50 50 L 80 80 L 20 80 L 50 50 Z"
          />
        </svg>
      </div>
    </div>
  );
}
