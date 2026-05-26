'use client';

import { useEffect, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Environment } from '@react-three/drei';
import { useOmnitrixStore } from '@/lib/store/useOmnitrixStore';
import { WheelSlot } from './WheelSlot';
import { BIG_10_NAMES } from '@/lib/api/ben10';
import { synth } from '@/lib/utils/WebAudioSynth';
import gsap from 'gsap';
import { EffectComposer, Bloom, Noise, Vignette } from '@react-three/postprocessing';
import * as THREE from 'three';

function DriftingWheel({ children, rotation }: { children: React.ReactNode, rotation: number }) {
  const ref = useRef<THREE.Group>(null);
  useFrame((state) => {
    if (!ref.current) return;
    // Gentle breathing drift Y left and right
    ref.current.rotation.y = rotation + Math.sin(state.clock.getElapsedTime() * 0.3) * 0.05;
  });
  return <group ref={ref}>{children}</group>;
}

export function AlienWheel() {
  const wheelRotation = useOmnitrixStore((state) => state.wheelRotation);
  const setWheelRotation = useOmnitrixStore((state) => state.setWheelRotation);
  const setActiveAlien = useOmnitrixStore((state) => state.setActiveAlien);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const startX = useRef(0);
  const isMounted = useRef(false);
  const snapTween = useRef<gsap.core.Tween | null>(null);
  const wheelTimeout = useRef<NodeJS.Timeout | null>(null);

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
      const latestRotation = useOmnitrixStore.getState().wheelRotation;
      let targetRotation = latestRotation;

      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        targetRotation = latestRotation - slotAngle;
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        targetRotation = latestRotation + slotAngle;
      } else if (e.key === 'Enter') {
        const currentRot = useOmnitrixStore.getState().wheelRotation;
        const currentActiveIndex = (Math.round((-currentRot) / ((2 * Math.PI) / 10)) % 10 + 10) % 10;
        const formattedId = BIG_10_NAMES[currentActiveIndex].toLowerCase().replace(' ', '_');
        setActiveAlien(formattedId);
        return;
      } else {
        return;
      }

      e.preventDefault();

      if (snapTween.current) {
        snapTween.current.kill();
      }

      // Smoothly animate rotation to snapped target
      snapTween.current = gsap.to({ val: latestRotation }, {
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
  }, [setWheelRotation, setActiveAlien]);

  // Pointer drag event handlers
  const handlePointerDown = (e: React.PointerEvent) => {
    isDragging.current = true;
    startX.current = e.clientX;
    if (containerRef.current) {
      containerRef.current.style.cursor = 'grabbing';
    }
    if (snapTween.current) {
      snapTween.current.kill();
      snapTween.current = null;
    }
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging.current) return;
    if (snapTween.current) {
      snapTween.current.kill();
      snapTween.current = null;
    }
    const currentX = e.clientX;
    const deltaX = currentX - startX.current;
    
    const latestRotation = useOmnitrixStore.getState().wheelRotation;
    // Accumulate rotation continuously based on differential movement delta
    setWheelRotation(latestRotation + deltaX * 0.006);
    
    // Prevent screen limits by updating start position to current position
    startX.current = currentX;
  };

  const handlePointerUp = () => {
    if (!isDragging.current) return;
    isDragging.current = false;
    if (containerRef.current) {
      containerRef.current.style.cursor = 'grab';
    }

    const latestRotation = useOmnitrixStore.getState().wheelRotation;
    // Snap to the nearest slot smoothly
    const slotAngle = (2 * Math.PI) / 10;
    const snapped = Math.round(latestRotation / slotAngle) * slotAngle;
    
    snapTween.current = gsap.to({ val: latestRotation }, {
      val: snapped,
      duration: 0.4,
      ease: 'power3.out',
      onUpdate: function() {
        setWheelRotation(this.targets()[0].val);
      }
    });
  };

  // Setup direct mouse wheel event listener on container to allow scrolling
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleWheelEvent = (e: WheelEvent) => {
      e.preventDefault();
      
      if (isDragging.current) return;

      if (snapTween.current) {
        snapTween.current.kill();
        snapTween.current = null;
      }

      const deltaY = e.deltaY;
      const latestRotation = useOmnitrixStore.getState().wheelRotation;
      
      // Rotate the wheel based on deltaY
      const newRotation = latestRotation - deltaY * 0.002;
      setWheelRotation(newRotation);

      // Debounce the snap to the nearest slot
      if (wheelTimeout.current) {
        clearTimeout(wheelTimeout.current);
      }

      wheelTimeout.current = setTimeout(() => {
        const slotAngle = (2 * Math.PI) / 10;
        const currentRot = useOmnitrixStore.getState().wheelRotation;
        const snapped = Math.round(currentRot / slotAngle) * slotAngle;

        snapTween.current = gsap.to({ val: currentRot }, {
          val: snapped,
          duration: 0.4,
          ease: 'power3.out',
          onUpdate: function() {
            setWheelRotation(this.targets()[0].val);
          }
        });
      }, 150);
    };

    container.addEventListener('wheel', handleWheelEvent, { passive: false });
    return () => {
      container.removeEventListener('wheel', handleWheelEvent);
      if (wheelTimeout.current) clearTimeout(wheelTimeout.current);
    };
  }, [setWheelRotation]);

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
        
        <DriftingWheel rotation={wheelRotation}>
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
        </DriftingWheel>

        {/* Hologram Ring effect */}
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <ringGeometry args={[4.8, 5.2, 64]} />
          <meshBasicMaterial color="#00FF41" transparent opacity={0.2} side={2} />
        </mesh>

        <Environment preset="city" />

        {/* High-Fidelity Cinematic Post-Processing */}
        <EffectComposer>
          <Bloom luminanceThreshold={0.15} intensity={1.3} mipmapBlur />
          <Noise opacity={0.04} />
          <Vignette eskil={false} offset={0.3} darkness={0.8} />
        </EffectComposer>
      </Canvas>
    </div>
  );
}
