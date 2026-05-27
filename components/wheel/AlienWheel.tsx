'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { Canvas, useFrame, useThree, ThreeEvent } from '@react-three/fiber';
import { Environment, useTexture, Sparkles } from '@react-three/drei';
import { useOmnitrixStore } from '@/lib/store/useOmnitrixStore';
import { WheelSlot } from './WheelSlot';
import { BIG_10_NAMES } from '@/lib/api/ben10';
import { synth } from '@/lib/utils/WebAudioSynth';
import gsap from 'gsap';
import { PostProcessing } from '@/components/three/PostProcessing';
import * as THREE from 'three';
import { AnimatePresence } from 'framer-motion';
import { AccessDenied } from '@/components/ui/AccessDenied';

function CameraShake() {
  const { camera } = useThree();
  const isMalfunctioning = useOmnitrixStore((state) => state.isMalfunctioning);

  useEffect(() => {
    if (isMalfunctioning) {
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (prefersReducedMotion) return;

      const initialX = camera.position.x;
      const initialY = camera.position.y;
      const initialZ = camera.position.z;

      const shakeTween = gsap.to(camera.position, {
        x: '+=0.15',
        y: '+=0.15',
        z: '+=0.05',
        duration: 0.05,
        repeat: -1,
        yoyo: true,
        ease: 'power1.inOut'
      });

      return () => {
        shakeTween.kill();
        camera.position.set(initialX, initialY, initialZ);
      };
    }
  }, [isMalfunctioning, camera]);

  return null;
}

// Vertical Hologram silhouette projection rising out of the watch face
interface HologramProps {
  alienId: string;
}

function CentralHologram({ alienId }: HologramProps) {
  const texture = useTexture(`/aliens/${alienId}.png`);
  const hologramRef = useRef<THREE.Group>(null);
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const elapsed = state.clock.getElapsedTime();
    
    // Slow float and twist animation
    if (hologramRef.current) {
      hologramRef.current.position.y = 0.2 + Math.sin(elapsed * 2.5) * 0.05;
      hologramRef.current.rotation.y = Math.sin(elapsed * 1.2) * 0.08;
    }
  });

  return (
    <group ref={hologramRef}>
      {/* Light cylinder projection beam */}
      <mesh position={[0, 0.7, 0]}>
        <cylinderGeometry args={[0.7, 1.0, 1.4, 32, 1, true]} />
        <meshBasicMaterial 
          color="#00FF41" 
          transparent 
          opacity={0.06} 
          side={THREE.DoubleSide} 
          wireframe
        />
      </mesh>

      {/* Hologram Card display */}
      <mesh ref={meshRef} position={[0, 1.2, 0]} rotation={[0, Math.PI, 0]}>
        <planeGeometry args={[1.35, 1.8]} />
        <meshBasicMaterial 
          map={texture} 
          transparent 
          opacity={0.7} 
          color="#00FF41" 
          side={THREE.DoubleSide}
          toneMapped={false}
        />
      </mesh>

      {/* Sparkles ascending around the hologram */}
      <Sparkles 
        count={20} 
        position={[0, 1.0, 0]} 
        scale={[1.2, 1.8, 1.2]} 
        size={2.5} 
        speed={0.4} 
        color="#00FF41" 
      />
    </group>
  );
}

interface OmnitrixWatchFaceProps {
  activeIndex: number;
  formattedId: string;
  isLocked: boolean;
  onLockedClick: () => void;
  wheelRotation: number;
  isTransforming: boolean;
}

function OmnitrixWatchFace({ 
  formattedId, 
  isLocked, 
  onLockedClick, 
  wheelRotation,
}: OmnitrixWatchFaceProps) {
  const [hovered, setHovered] = useState(false);
  const watchRef = useRef<THREE.Group>(null);
  const screenMatRef = useRef<THREE.MeshStandardMaterial>(null);
  const wedge1Ref = useRef<THREE.Mesh>(null);
  const wedge2Ref = useRef<THREE.Mesh>(null);
  const lastRotation = useRef(0);
  
  const { camera } = useThree();
  const setActiveAlien = useOmnitrixStore((state) => state.setActiveAlien);
  const setIsTransforming = useOmnitrixStore((state) => state.setIsTransforming);

  useFrame((state) => {
    // 1. Glowing Screen Pulse
    if (screenMatRef.current) {
      const elapsed = state.clock.getElapsedTime();
      screenMatRef.current.emissiveIntensity = 0.45 + Math.sin(elapsed * 2.5) * 0.15;
    }

    // 2. Hourglass Wedges Animation (rotating on Y-axis for 3D cylinders)
    if (wedge1Ref.current && wedge2Ref.current) {
      const elapsed = state.clock.getElapsedTime();
      const deltaRot = Math.abs(wheelRotation - lastRotation.current);
      lastRotation.current = wheelRotation;

      // Slow mechanical idle breathing wobble
      const idleWobble = Math.sin(elapsed * 1.5) * 0.035;

      // Dynamic reactive twist responding to wheel rotation speed
      const twist = deltaRot * 1.8;

      wedge1Ref.current.rotation.y = idleWobble + twist;
      wedge2Ref.current.rotation.y = -idleWobble - twist;
    }
  });

  const handlePointerOver = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    setHovered(true);
    document.body.style.cursor = 'pointer';
    synth.playClick();
  };

  const handlePointerOut = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    setHovered(false);
    document.body.style.cursor = 'auto';
  };

  const handleClick = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    
    if (isLocked) {
      onLockedClick();
      return;
    }
    
    // Trigger transformation audio/visual effects
    synth.playTransform();
    setIsTransforming(true);

    // Spring plunge mechanical dial action
    if (watchRef.current) {
      gsap.to(watchRef.current.position, {
        y: -0.18,
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

          // Panoramic dolly push directly into the watch center screen
          gsap.to(camera.position, {
            x: 0,
            y: 1.8,
            z: 2.2,
            duration: 0.45,
            ease: 'power2.in',
            onComplete: () => {
              setActiveAlien(formattedId);
              camera.position.set(0, 5.5, 6.2); // reset for subsequent loads
            }
          });
        }
      });
    }
  };

  return (
    <group ref={watchRef} position={[0, 0.08, 0]}>
      {/* Matte Black Armor watch casing / base straps */}
      <group position={[0, -0.4, 0]}>
        <mesh>
          <boxGeometry args={[4.4, 0.6, 4.4]} />
          <meshStandardMaterial color="#0c0c0c" roughness={0.8} metalness={0.1} />
        </mesh>
        
        {/* Armored strap grooves */}
        <mesh position={[0, 0.05, 2.25]}>
          <boxGeometry args={[1.8, 0.52, 0.15]} />
          <meshStandardMaterial color="#1a1a1a" roughness={0.7} />
        </mesh>
        <mesh position={[0, 0.05, -2.25]}>
          <boxGeometry args={[1.8, 0.52, 0.15]} />
          <meshStandardMaterial color="#1a1a1a" roughness={0.7} />
        </mesh>
      </group>

      {/* Silver mechanical dial outer bezel (rotates with manual selector dial) */}
      <group rotation={[0, wheelRotation, 0]}>
        {/* Main Silver bezel ring */}
        <mesh 
          onPointerOver={handlePointerOver}
          onPointerOut={handlePointerOut}
          onClick={handleClick}
        >
          <cylinderGeometry args={[1.5, 1.5, 0.24, 64]} />
          <meshStandardMaterial 
            color={hovered ? "#e5e5e5" : "#b8b8b8"} 
            roughness={0.12} 
            metalness={0.95} 
          />
        </mesh>

        {/* Outer bezel rivets (detailed micro-mechanical finish) */}
        {[...Array(8)].map((_, i) => {
          const rivetAngle = (i / 8) * Math.PI * 2;
          const rx = Math.sin(rivetAngle) * 1.32;
          const rz = Math.cos(rivetAngle) * 1.32;
          return (
            <mesh key={i} position={[rx, 0.12, rz]}>
              <sphereGeometry args={[0.045, 16, 16]} />
              <meshStandardMaterial color="#8a8a8a" metalness={0.9} roughness={0.15} />
            </mesh>
          );
        })}

        {/* 4 classic green bezel triangular markings at 90-deg intervals */}
        {[0, 1, 2, 3].map((idx) => {
          const markAngle = (idx / 4) * Math.PI * 2;
          const mx = Math.sin(markAngle) * 1.48;
          const mz = Math.cos(markAngle) * 1.48;
          return (
            <mesh key={idx} position={[mx, 0, mz]} rotation={[0, markAngle, 0]}>
              <boxGeometry args={[0.18, 0.26, 0.08]} />
              <meshBasicMaterial color="#00FF41" />
            </mesh>
          );
        })}
      </group>

      {/* Torus curved pipes linking casing and bezel */}
      {/* Corner Pipes - Top Right */}
      <group position={[1.2, -0.22, 1.2]} rotation={[0, -Math.PI / 4, 0]}>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.55, 0.08, 16, 32, Math.PI / 2]} />
          <meshStandardMaterial color="#c8c8c8" metalness={0.95} roughness={0.1} />
        </mesh>
      </group>
      {/* Corner Pipes - Top Left */}
      <group position={[-1.2, -0.22, 1.2]} rotation={[0, Math.PI / 4, 0]}>
        <mesh rotation={[Math.PI / 2, 0, Math.PI / 2]}>
          <torusGeometry args={[0.55, 0.08, 16, 32, Math.PI / 2]} />
          <meshStandardMaterial color="#c8c8c8" metalness={0.95} roughness={0.1} />
        </mesh>
      </group>
      {/* Corner Pipes - Bottom Right */}
      <group position={[1.2, -0.22, -1.2]} rotation={[0, -3 * Math.PI / 4, 0]}>
        <mesh rotation={[Math.PI / 2, 0, -Math.PI / 2]}>
          <torusGeometry args={[0.55, 0.08, 16, 32, Math.PI / 2]} />
          <meshStandardMaterial color="#c8c8c8" metalness={0.95} roughness={0.1} />
        </mesh>
      </group>
      {/* Corner Pipes - Bottom Left */}
      <group position={[-1.2, -0.22, -1.2]} rotation={[0, 3 * Math.PI / 4, 0]}>
        <mesh rotation={[Math.PI / 2, 0, Math.PI]}>
          <torusGeometry args={[0.55, 0.08, 16, 32, Math.PI / 2]} />
          <meshStandardMaterial color="#c8c8c8" metalness={0.95} roughness={0.1} />
        </mesh>
      </group>

      {/* Black inner display well */}
      <mesh position={[0, 0.02, 0]}>
        <cylinderGeometry args={[1.2, 1.2, 0.18, 32]} />
        <meshStandardMaterial color="#080808" roughness={0.7} />
      </mesh>

      {/* Screen Lens with glowing green core */}
      <mesh position={[0, 0.08, 0]}>
        <cylinderGeometry args={[1.15, 1.15, 0.05, 32]} />
        <meshStandardMaterial 
          ref={screenMatRef}
          color="#00881b" 
          emissive="#00ff41" 
          emissiveIntensity={0.45} 
          roughness={0.25} 
        />
      </mesh>

      {/* Animated Hourglass Wedges (Solid 3D cylindrical mechanical plates) */}
      {/* Hourglass Wedge 1 (Top / Bottom Sector) */}
      <mesh ref={wedge1Ref} position={[0, 0.13, 0]}>
        <cylinderGeometry args={[1.13, 1.13, 0.12, 32, 1, false, -Math.PI / 4, Math.PI / 2]} />
        <meshStandardMaterial color="#0c0c0c" roughness={0.7} metalness={0.2} />
      </mesh>
      {/* Hourglass Wedge 2 (Opposing Sector) */}
      <mesh ref={wedge2Ref} position={[0, 0.13, 0]}>
        <cylinderGeometry args={[1.13, 1.13, 0.12, 32, 1, false, 3 * Math.PI / 4, Math.PI / 2]} />
        <meshStandardMaterial color="#0c0c0c" roughness={0.7} metalness={0.2} />
      </mesh>
    </group>
  );
}

function DriftingWheel({ children, rotation }: { children: React.ReactNode, rotation: number }) {
  const ref = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (!ref.current) return;
    // Slow continuous micro breathing, maintaining perfect alignment with selection
    ref.current.rotation.y = rotation + Math.sin(state.clock.getElapsedTime() * 0.3) * 0.015;
  });
  
  return <group ref={ref}>{children}</group>;
}

export function AlienWheel() {
  const wheelRotation = useOmnitrixStore((state) => state.wheelRotation);
  const setWheelRotation = useOmnitrixStore((state) => state.setWheelRotation);
  const setActiveAlien = useOmnitrixStore((state) => state.setActiveAlien);
  const isTransforming = useOmnitrixStore((state) => state.isTransforming);
  const setIsTransforming = useOmnitrixStore((state) => state.setIsTransforming);
  const unlockedAliens = useOmnitrixStore((state) => state.unlockedAliens);
  const unlockAlien = useOmnitrixStore((state) => state.unlockAlien);
  const isMalfunctioning = useOmnitrixStore((state) => state.isMalfunctioning);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const startX = useRef(0);
  const isMounted = useRef(false);
  const snapTween = useRef<gsap.core.Tween | null>(null);
  const wheelTimeout = useRef<NodeJS.Timeout | null>(null);
  const dragVelocity = useRef(0);
  const [canvasReady, setCanvasReady] = useState(false);
  const [lockedErrorAlien, setLockedErrorAlien] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
      (window as Window & { requestIdleCallback?: (cb: () => void) => void }).requestIdleCallback?.(() => setCanvasReady(true));
    } else {
      const timer = setTimeout(() => setCanvasReady(true), 150);
      return () => clearTimeout(timer);
    }
  }, []);

  // Compute active focused alien index based on rotation angle
  const activeIndex = (Math.round((-wheelRotation) / ((2 * Math.PI) / 10)) % 10 + 10) % 10;
  const activeAlienName = BIG_10_NAMES[activeIndex];
  const activeFormattedId = activeAlienName.toLowerCase().replace(' ', '_');
  const isActiveLocked = !unlockedAliens.includes(activeFormattedId);

  // Play click audio feedback when active index shifts
  useEffect(() => {
    if (!isMounted.current) {
      isMounted.current = true;
      return;
    }
    synth.playClick();
  }, [activeIndex]);

  const handleLockedClick = useCallback((formattedId: string, name: string) => {
    if (lockedErrorAlien === name) {
      // Second click! Bypass and unlock DNA profile!
      setLockedErrorAlien(null);
      synth.playTransform();
      setIsTransforming(true);

      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (prefersReducedMotion) {
        unlockAlien(formattedId);
        setActiveAlien(formattedId);
        setIsTransforming(false);
        return;
      }

      unlockAlien(formattedId);
      // Wait a tiny bit for the state to register and trigger full camera dolly transition
      setTimeout(() => {
        setActiveAlien(formattedId);
      }, 50);
    } else {
      // First click! Trigger error buzzer feedback and show access denied modal
      setLockedErrorAlien(name);
      synth.playAccessDenied();
    }
  }, [lockedErrorAlien, unlockAlien, setActiveAlien, setIsTransforming]);

  // Key handlers for keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't intercept when typing or malfunctioning
      if (
        document.activeElement?.tagName === 'INPUT' || 
        document.activeElement?.tagName === 'TEXTAREA' ||
        isMalfunctioning
      ) {
        return;
      }

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
        const currentAlienName = BIG_10_NAMES[currentActiveIndex];
        const formattedId = currentAlienName.toLowerCase().replace(' ', '_');
        const isLocked = !useOmnitrixStore.getState().unlockedAliens.includes(formattedId);

        if (isLocked) {
          handleLockedClick(formattedId, currentAlienName);
        } else {
          setActiveAlien(formattedId);
        }
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
  }, [setWheelRotation, setActiveAlien, isMalfunctioning, lockedErrorAlien, handleLockedClick]);

  // Pointer drag event handlers
  const handlePointerDown = (e: React.PointerEvent) => {
    if (isMalfunctioning) return;
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
    if (!isDragging.current || isMalfunctioning) return;
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
    if (!isDragging.current || isMalfunctioning) return;
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
      
      if (isDragging.current || isMalfunctioning) return;

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
  }, [setWheelRotation, isMalfunctioning]);

  return (
    <div 
      ref={containerRef}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
      className="w-full h-screen absolute inset-0 z-10 select-none cursor-grab"
    >
      {canvasReady ? (
        <Canvas 
          camera={{ position: [0, 5.5, 6.2], fov: 45 }}
          className="pointer-events-none"
        >
          <ambientLight intensity={0.55} />
          <pointLight position={[10, 10, 10]} intensity={1} color="#00FF41" />
          
          <CameraShake />

          <DriftingWheel rotation={wheelRotation}>
            {BIG_10_NAMES.map((name, index) => {
              const angle = (index / BIG_10_NAMES.length) * Math.PI * 2;
              const radius = 5;
              const x = Math.sin(angle) * radius;
              const z = Math.cos(angle) * radius;
              const slotFormattedId = name.toLowerCase().replace(' ', '_');
              const isSlotLocked = !unlockedAliens.includes(slotFormattedId);

              return (
                <WheelSlot 
                  key={name}
                  name={name}
                  position={[x, 0, z]}
                  rotation={[0, angle, 0]} // rotate to face outward
                  isFocused={index === activeIndex}
                  isLocked={isSlotLocked}
                  onLockedClick={() => handleLockedClick(slotFormattedId, name)}
                />
              );
            })}
          </DriftingWheel>

          {/* Hologram Ring effect */}
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <ringGeometry args={[4.8, 5.2, 64]} />
            <meshBasicMaterial color="#00FF41" transparent opacity={0.2} side={2} />
          </mesh>

          {/* Glowing mechanical 3D Omnitrix Watch-Face */}
          <OmnitrixWatchFace 
            activeIndex={activeIndex} 
            formattedId={activeFormattedId}
            isLocked={isActiveLocked}
            onLockedClick={() => handleLockedClick(activeFormattedId, activeAlienName)}
            wheelRotation={wheelRotation}
            isTransforming={isTransforming}
          />

          {/* Vertical Hologram Silhouette Projector rising from central display */}
          <CentralHologram alienId={activeFormattedId} />

          <Environment preset="city" />

          {/* High-Fidelity Cinematic Post-Processing */}
          <PostProcessing isTransforming={isTransforming} />
        </Canvas>
      ) : (
        <div className="absolute inset-0 flex flex-col items-center justify-center font-mono text-[11px] text-[#00FF41]/40 uppercase tracking-[0.25em] animate-pulse pointer-events-none gap-2 select-none">
          <span>⬡ INITIALIZING 3D DNA DECK...</span>
        </div>
      )}

      {/* Access Denied Glitch Overlay */}
      <AnimatePresence>
        {lockedErrorAlien && (
          <AccessDenied 
            alienName={lockedErrorAlien} 
            onClose={() => setLockedErrorAlien(null)} 
          />
        )}
      </AnimatePresence>
    </div>
  );
}
