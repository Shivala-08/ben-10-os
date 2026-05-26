'use client';

import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { useOmnitrixStore } from '@/lib/store/useOmnitrixStore';
import { themes } from '@/lib/themes';

export function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const activeAlien = useOmnitrixStore((state) => state.activeAlien);
  const [hoveringClickable, setHoveringClickable] = useState(false);

  useEffect(() => {
    const cursor = cursorRef.current;
    if (!cursor) return;

    const xTo = gsap.quickTo(cursor, 'x', { duration: 0.1, ease: 'power3' });
    const yTo = gsap.quickTo(cursor, 'y', { duration: 0.1, ease: 'power3' });

    const moveCursor = (e: MouseEvent) => {
      xTo(e.clientX);
      yTo(e.clientY);
    };

    const handlePointerOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (
        target.tagName === 'BUTTON' ||
        target.tagName === 'A' ||
        target.onclick ||
        target.closest('button') ||
        target.closest('a') ||
        target.style.cursor === 'pointer'
      ) {
        setHoveringClickable(true);
      } else {
        setHoveringClickable(false);
      }
    };

    window.addEventListener('mousemove', moveCursor);
    window.addEventListener('mouseover', handlePointerOver);

    // Hide default cursor
    document.body.style.cursor = 'none';

    return () => {
      window.removeEventListener('mousemove', moveCursor);
      window.removeEventListener('mouseover', handlePointerOver);
      document.body.style.cursor = 'auto';
    };
  }, []);

  const theme = activeAlien ? themes[activeAlien] : null;
  const glowColor = theme ? theme.colors.glow : '#00FF41';
  
  // Custom SVG Reticle per alien
  const renderCursorSvg = () => {
    const size = hoveringClickable ? 42 : 32;
    const color = glowColor;

    switch (activeAlien) {
      case 'heatblast':
        // Flame shape
        return (
          <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
            <path d="M12 2C12 2 7 7 7 11.5C7 14.5 9.2 17 12 17C14.8 17 17 14.5 17 11.5C17 7 12 2 12 2ZM12 15C10.3 15 9 13.7 9 12C9 10.3 10.3 9 12 9C13.7 9 15 10.3 15 12C15 13.7 13.7 15 12 15Z" />
          </svg>
        );
      case 'xlr8':
        // Lightning bolt / charging arrow
        return (
          <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2">
            <polygon points="13 2 3 14 12 14 11 22 21 10 12 10" fill={color} />
          </svg>
        );
      case 'ghostfreak':
        // Wobbly concentric rings
        return (
          <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" className="animate-spin" style={{ animationDuration: '6s' }}>
            <circle cx="12" cy="12" r="10" strokeDasharray="4 4" />
            <circle cx="12" cy="12" r="6" />
            <circle cx="12" cy="12" r="2" fill={color} />
          </svg>
        );
      case 'diamondhead':
        // Sharp diamond polygon
        return (
          <svg width={size} height={size} viewBox="0 0 24 24" fill={color} stroke="#FFFFFF" strokeWidth="1">
            <polygon points="12 2 20 12 12 22 4 12" />
          </svg>
        );
      case 'upgrade':
        // Cyber square crosshair
        return (
          <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2">
            <rect x="3" y="3" width="18" height="18" rx="2" />
            <line x1="12" y1="3" x2="12" y2="7" />
            <line x1="12" y1="17" x2="12" y2="21" />
            <line x1="3" y1="12" x2="7" y2="12" />
            <line x1="17" y1="12" x2="21" y2="12" />
            <circle cx="12" cy="12" r="2" fill={color} />
          </svg>
        );
      case 'four_arms':
        // Chevron shields
        return (
          <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
            <path d="M12 2L4 5V11C4 16.1 7.4 20.8 12 22C16.6 20.8 20 16.1 20 11V5L12 2Z" opacity="0.3" />
            <path d="M12 5L6 7.2V11.5C6 15.3 8.6 18.8 12 19.8C15.4 18.8 18 15.3 18 11.5V7.2L12 5Z" />
          </svg>
        );
      case 'wildmutt':
        // Sonar sweeping wave
        return (
          <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" className="animate-ping" style={{ animationDuration: '2s' }}>
            <circle cx="12" cy="12" r="8" />
            <circle cx="12" cy="12" r="3" fill={color} />
          </svg>
        );
      case 'grey_matter':
        // Neural network hub / blueprint target
        return (
          <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5">
            <circle cx="12" cy="12" r="10" />
            <line x1="2" y1="12" x2="22" y2="12" />
            <line x1="12" y1="2" x2="12" y2="22" />
            <circle cx="12" cy="12" r="4" fill="#000000" strokeWidth="2" />
          </svg>
        );
      case 'stinkfly':
        // Glowing insectoid shape
        return (
          <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
            <path d="M12 2L2 9L12 16L22 9L12 2Z" />
            <path d="M12 16L7 22L12 20L17 22L12 16Z" opacity="0.7" />
          </svg>
        );
      case 'ripjaws':
        // Aquatic wave / trident tip
        return (
          <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2">
            <path d="M12 2V22M6 5V12C6 15.3 8.7 18 12 18C15.3 18 18 15.3 18 12V5" />
          </svg>
        );
      default:
        // Default glowing Omnitrix circular target reticle
        return (
          <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5">
            <circle cx="12" cy="12" r="9" strokeWidth="2" />
            <line x1="12" y1="2" x2="12" y2="6" />
            <line x1="12" y1="18" x2="12" y2="22" />
            <line x1="2" y1="12" x2="6" y2="12" />
            <line x1="18" y1="12" x2="22" y2="12" />
            <circle cx="12" cy="12" r="2" fill={color} />
          </svg>
        );
    }
  };

  return (
    <div
      ref={cursorRef}
      className="fixed top-0 left-0 pointer-events-none z-[100] transform -translate-x-1/2 -translate-y-1/2 flex items-center justify-center transition-all duration-300"
      style={{
        width: hoveringClickable ? '56px' : '44px',
        height: hoveringClickable ? '56px' : '44px',
        filter: `drop-shadow(0 0 8px ${glowColor})`,
      }}
    >
      {renderCursorSvg()}
    </div>
  );
}
