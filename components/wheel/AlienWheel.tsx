'use client';

import { useEffect, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { Environment } from '@react-three/drei';
import { useOmnitrixStore } from '@/lib/store/useOmnitrixStore';
import { WheelSlot } from './WheelSlot';
import { BIG_10_NAMES } from '@/lib/api/ben10';
import { synth } from '@/lib/utils/WebAudioSynth';
import gsap from 'gsap';

export function AlienWheel() {
  const wheelRotation = useOmnitrixStore((state) => state.wheelRotation);
  const setWheelRotation = useOmnitrixStore((state) => state.setWheelRotation);
  const setActiveAlien = useOmnitrixStore((state) => state.setActiveAlien);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const startX = useRef(0);
  const startRotation = useRef(0);
  const isMounted = useRef(false);

  // Compute active focused alien index based on rotation angle
  const activeIndex = (Math.round((-wheelRotation) / ((2 * Math.PI) / 10)) % 10 + 10) % 10;

  // Play click audio feedback when active index shifts
  useEffect(() => {
    if (!isMounted.current) {
      isMounted.current = true;
      return;
    }
    synth.playClick();
  }, [activeIndex]);

  // Key handlers for keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const slotAngle = (2 * Math.PI) / 10;
      let targetRotation = wheelRotation;

      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        // Rotate to the next slot (decrement because wheel rotation Y is opposite)
        targetRotation = wheelRotation - slotAngle;
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        // Rotate to the previous slot
        targetRotation = wheelRotation + slotAngle;
      } else if (e.key === 'Enter') {
        const formattedId = BIG_10_NAMES[activeIndex].toLowerCase().replace(' ', '_');
        setActiveAlien(formattedId);
        return;
      } else {
        return;
      }

      e.preventDefault();

      // Smoothly animate rotation to snapped target
      gsap.to({ val: wheelRotation }, {
        val: targetRotation,
        duration: 0.4,
        ease: 'power2.out',
        onUpdate: function() {
          setWheelRotation(this.targets()[0].val);
        }
      });
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [wheelRotation, setWheelRotation, setActiveAlien, activeIndex]);

  // Pointer drag event handlers
  const handlePointerDown = (e: React.PointerEvent) => {
    isDragging.current = true;
    startX.current = e.clientX;
    startRotation.current = wheelRotation;
    if (containerRef.current) {
      containerRef.current.style.cursor = 'grabbing';
    }
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging.current) return;
    const deltaX = e.clientX - startX.current;
    // Map drag distance to wheel rotation in radians
    const newRotation = startRotation.current + deltaX * 0.005;
    setWheelRotation(newRotation);
  };

  const handlePointerUp = () => {
    if (!isDragging.current) return;
    isDragging.current = false;
    if (containerRef.current) {
      containerRef.current.style.cursor = 'grab';
    }

    // Snap to the nearest slot smoothly
    const slotAngle = (2 * Math.PI) / 10;
    const snapped = Math.round(wheelRotation / slotAngle) * slotAngle;
    
    gsap.to({ val: wheelRotation }, {
      val: snapped,
      duration: 0.4,
      ease: 'power3.out',
      onUpdate: function() {
        setWheelRotation(this.targets()[0].val);
      }
    });
  };

  return (
    <div 
      ref={containerRef}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
      className="w-full h-screen absolute inset-0 z-10 select-none cursor-grab"
    >
      <Canvas 
        camera={{ position: [0, 2, 8], fov: 45 }}
        className="pointer-events-none"
      >
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} color="#00FF41" />
        
        <group rotation={[0, wheelRotation, 0]}>
          {BIG_10_NAMES.map((name, index) => {
            const angle = (index / BIG_10_NAMES.length) * Math.PI * 2;
            const radius = 5;
            const x = Math.sin(angle) * radius;
            const z = Math.cos(angle) * radius;

            return (
              <WheelSlot 
                key={name}
                name={name}
                position={[x, 0, z]}
                rotation={[0, angle, 0]} // rotate to face outward
                isFocused={index === activeIndex}
              />
            );
          })}
        </group>

        {/* Hologram Ring effect */}
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <ringGeometry args={[4.8, 5.2, 64]} />
          <meshBasicMaterial color="#00FF41" transparent opacity={0.2} side={2} />
        </mesh>

        <Environment preset="city" />
      </Canvas>
    </div>
  );
}
