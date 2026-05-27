'use client';

import { useEffect, useRef, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Environment } from '@react-three/drei';
import { useOmnitrixStore } from '@/lib/store/useOmnitrixStore';
import { WheelSlot } from './WheelSlot';
import { BIG_10_NAMES } from '@/lib/api/ben10';
import { synth } from '@/lib/utils/WebAudioSynth';
import gsap from 'gsap';
import { PostProcessing } from '@/components/three/PostProcessing';
import * as THREE from 'three';

function CenterButton({ activeIndex, formattedId }: { activeIndex: number, formattedId: string }) {
  const [hovered, setHovered] = useState(false);
  const buttonRef = useRef<THREE.Group>(null);
  const { camera } = useThree();
  const setActiveAlien = useOmnitrixStore((state) => state.setActiveAlien);
  const setIsTransforming = useOmnitrixStore((state) => state.setIsTransforming);

  const handlePointerOver = (e: any) => {
    e.stopPropagation();
    setHovered(true);
    document.body.style.cursor = 'pointer';
    synth.playClick();
  };

  const handlePointerOut = (e: any) => {
    e.stopPropagation();
    setHovered(false);
    document.body.style.cursor = 'auto';
  };

  const handleClick = (e: any) => {
    e.stopPropagation();
    
    // Trigger transformation audio/visual effects
    synth.playTransform();
    setIsTransforming(true);

    // Z-press spring animation (dipping down)
    if (buttonRef.current) {
      gsap.to(buttonRef.current.position, {
        y: -0.15,
        duration: 0.08,
        yoyo: true,
        repeat: 1,
        ease: 'power2.inOut',
        onComplete: () => {
          const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
          if (prefersReducedMotion) {
            setActiveAlien(formattedId);
            setIsTransforming(false);
            return;
          }

          // Panoramic dolly push towards focused card slot
          const angle = (activeIndex / 10) * Math.PI * 2;
          const radius = 5;
          const targetX = Math.sin(angle) * radius;
          const targetZ = Math.cos(angle) * radius;

          // Animate camera to focused slot
          gsap.to(camera.position, {
            x: targetX * 0.45,
            y: 0.6,
            z: targetZ * 0.45,
            duration: 0.4,
            ease: 'power2.in',
            onComplete: () => {
              setActiveAlien(formattedId);
              camera.position.set(0, 2, 8); // reset for subsequent loads
            }
          });
        }
      });
    }
  };

  return (
    <group 
      ref={buttonRef}
      position={[0, 0.1, 0]}
    >
      {/* Outer button cap */}
      <mesh
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
        onClick={handleClick}
      >
        <cylinderGeometry args={[1.2, 1.2, 0.25, 32]} />
        <meshStandardMaterial 
          color={hovered ? "#00FF41" : "#112211"} 
          emissive={hovered ? "#00FF41" : "#003308"}
          emissiveIntensity={hovered ? 1.4 : 0.6}
          roughness={0.2}
          metalness={0.8}
        />
      </mesh>
      
      {/* Dynamic Inner core hourglass logo - background */}
      <mesh position={[0, 0.13, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0, 0.85, 3]} />
        <meshBasicMaterial 
          color="#000000" 
          side={THREE.DoubleSide} 
        />
      </mesh>
      
      {/* Dynamic Inner core hourglass logo - foreground green triangles */}
      <mesh position={[0, 0.14, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.5, 0.8, 3]} />
        <meshBasicMaterial 
          color={hovered ? "#00FF41" : "#00AA22"} 
          side={THREE.DoubleSide} 
        />
      </mesh>
    </group>
  );
}

function DriftingWheel({ children, rotation, isDragging }: { children: React.ReactNode, rotation: number, isDragging: React.RefObject<boolean> }) {
  const ref = useRef<THREE.Group>(null);
  const drift = useRef(0);
  
  useFrame((state, delta) => {
    if (!ref.current) return;
    
    // Slow continuous drift rotation when not actively dragging
    // 0.18 rad per second (~0.003 rad per frame at 60fps)
    if (!isDragging.current) {
      drift.current += 0.18 * delta;
    }
    
    // Combine state rotation, sinus breathing, and continuous drift
    ref.current.rotation.y = rotation + drift.current + Math.sin(state.clock.getElapsedTime() * 0.3) * 0.04;
  });
  
  return <group ref={ref}>{children}</group>;
}

export function AlienWheel() {
  const wheelRotation = useOmnitrixStore((state) => state.wheelRotation);
  const setWheelRotation = useOmnitrixStore((state) => state.setWheelRotation);
  const setActiveAlien = useOmnitrixStore((state) => state.setActiveAlien);
  const isTransforming = useOmnitrixStore((state) => state.isTransforming);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const startX = useRef(0);
  const isMounted = useRef(false);
  const snapTween = useRef<gsap.core.Tween | null>(null);
  const wheelTimeout = useRef<NodeJS.Timeout | null>(null);
  const dragVelocity = useRef(0);

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
    dragVelocity.current = 0;
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
    
    // Store drag velocity as scaled deltaX
    dragVelocity.current = deltaX * 0.006;
    
    const latestRotation = useOmnitrixStore.getState().wheelRotation;
    // Accumulate rotation continuously based on differential movement delta
    setWheelRotation(latestRotation + dragVelocity.current);
    
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
    let velocity = dragVelocity.current;
    const decay = 0.94; // PRD spec: MOMENTUM_DECAY = 0.94

    const tick = () => {
      if (isDragging.current) return; // Stop momentum if user starts dragging again

      velocity *= decay;

      if (Math.abs(velocity) > 0.0001) {
        const currentRot = useOmnitrixStore.getState().wheelRotation;
        setWheelRotation(currentRot + velocity);
        requestAnimationFrame(tick);
      } else {
        // Snap smoothly to closest alien slot after momentum decay
        const finalRotation = useOmnitrixStore.getState().wheelRotation;
        const slotAngle = (2 * Math.PI) / 10;
        const snapped = Math.round(finalRotation / slotAngle) * slotAngle;

        snapTween.current = gsap.to({ val: finalRotation }, {
          val: snapped,
          duration: 0.4,
          ease: 'power3.out',
          onUpdate: function() {
            setWheelRotation(this.targets()[0].val);
          }
        });
      }
    };

    if (Math.abs(velocity) > 0.001) {
      requestAnimationFrame(tick);
    } else {
      // Direct snapping for click releases
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
    }
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
        
        <DriftingWheel rotation={wheelRotation} isDragging={isDragging}>
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

        {/* Dynamic Glowing Center Press Button */}
        <CenterButton 
          activeIndex={activeIndex} 
          formattedId={BIG_10_NAMES[activeIndex].toLowerCase().replace(' ', '_')} 
        />

        <Environment preset="city" />

        {/* High-Fidelity Cinematic Post-Processing */}
        <PostProcessing isTransforming={isTransforming} />
      </Canvas>
    </div>
  );
}
