'use client';

import { useState, useRef } from 'react';
import { useFrame, useThree, ThreeEvent } from '@react-three/fiber';
import { Text, Sparkles, Float, useTexture } from '@react-three/drei';
import gsap from 'gsap';
import * as THREE from 'three';
import { useOmnitrixStore } from '@/lib/store/useOmnitrixStore';
import { synth } from '@/lib/utils/WebAudioSynth';

interface WheelSlotProps {
  name: string;
  position: [number, number, number];
  rotation: [number, number, number];
  isFocused: boolean;
  isLocked: boolean;
  onLockedClick: () => void;
}

export function WheelSlot({ name, position, rotation, isFocused, isLocked, onLockedClick }: WheelSlotProps) {
  const [hovered, setHovered] = useState(false);
  const meshRef = useRef<THREE.Mesh>(null);
  const groupRef = useRef<THREE.Group>(null);
  const setActiveAlien = useOmnitrixStore((state) => state.setActiveAlien);
  const setIsTransforming = useOmnitrixStore((state) => state.setIsTransforming);
  const { camera } = useThree();

  const active = (hovered || isFocused) && !isLocked;
  
  // Format alien ID to match the image name (e.g., 'heatblast.png', 'four_arms.png')
  const formattedId = name.toLowerCase().replace(' ', '_');
  const texture = useTexture(`/aliens/${formattedId}.png`);

  useFrame(() => {
    if (!meshRef.current) return;
    const targetScale = (hovered || isFocused) ? (isLocked ? 1.02 : 1.15) : 0.85;
    meshRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.15);

    // Dynamic Y-lift when focused or hovered (tactile mechanical feel)
    if (groupRef.current) {
      const targetY = (hovered || isFocused) ? 0.35 : 0;
      groupRef.current.position.y = THREE.MathUtils.lerp(groupRef.current.position.y, targetY, 0.15);
    }
  });

  const handleClick = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();

    if (isLocked) {
      onLockedClick();
      return;
    }

    // Trigger transformation audio/visual effects
    synth.playTransform();
    setIsTransforming(true);

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) {
      // Force unlock the DNA profile on success
      useOmnitrixStore.getState().unlockAlien(formattedId);
      setActiveAlien(formattedId);
      setIsTransforming(false);
      return;
    }

    // Dolly camera down into the center of the watch face
    gsap.to(camera.position, {
      x: 0,
      y: 1.8,
      z: 2.2,
      duration: 0.45,
      ease: 'power2.in',
      onComplete: () => {
        // Force unlock the DNA profile on success
        useOmnitrixStore.getState().unlockAlien(formattedId);
        setActiveAlien(formattedId);
        // Reset camera positions for subsequent loads (top-down watch angle)
        camera.position.set(0, 5.5, 6.2);
      }
    });
  };

  return (
    <group position={position} rotation={rotation}>
      <group ref={groupRef}>
        <Float speed={active ? 3 : 1.2} rotationIntensity={active ? 0.2 : 0.05} floatIntensity={active ? 0.4 : 0.15}>
          <mesh 
            ref={meshRef}
            onPointerOver={(e) => {
              e.stopPropagation();
              setHovered(true);
              document.body.style.cursor = 'pointer';
              if (!isLocked) {
                synth.playClick();
              }
            }}
            onPointerOut={(e) => {
              e.stopPropagation();
              setHovered(false);
              document.body.style.cursor = 'auto';
            }}
            onClick={handleClick}
          >
            {/* Flat circular cartridge geometry lying parallel to XZ plane */}
            <cylinderGeometry args={[0.55, 0.55, 0.08, 32]} />
            <meshStandardMaterial 
              color={isLocked ? "#151515" : (active ? "#00FF41" : "#113311")} 
              emissive={isLocked ? "#000000" : (active ? "#00FF41" : "#000000")}
              emissiveIntensity={isLocked ? 0 : (active ? 0.75 : 0)}
              wireframe
            />

            {/* Floating Holographic Image Texture lying flat on cartridge top */}
            <mesh position={[0, 0.045, 0]} rotation={[-Math.PI / 2, Math.PI, 0]}>
              <planeGeometry args={[0.7, 0.7]} />
              <meshBasicMaterial 
                map={texture} 
                transparent 
                opacity={isLocked ? 0.02 : (active ? 0.9 : 0.45)} 
                toneMapped={false}
                side={THREE.DoubleSide}
                color={isLocked ? "#111111" : "#ffffff"}
              />
            </mesh>

            {/* 3D High-Fidelity Procedural Padlock Overlay (Stands up vertically) */}
            {isLocked && (
              <group position={[0, 0.12, 0]} rotation={[0, Math.PI, 0]}>
                {/* Padlock loop shackle */}
                <mesh position={[0, 0.16, 0]}>
                  <torusGeometry args={[0.12, 0.025, 8, 24, Math.PI]} />
                  <meshStandardMaterial color="#666666" metalness={0.9} roughness={0.15} />
                </mesh>
                {/* Padlock body */}
                <mesh position={[0, -0.02, 0]}>
                  <boxGeometry args={[0.3, 0.25, 0.08]} />
                  <meshStandardMaterial color="#C82333" emissive="#330000" emissiveIntensity={0.5} roughness={0.3} metalness={0.7} />
                </mesh>
                {/* Keyhole slot */}
                <mesh position={[0, -0.02, 0.045]} rotation={[Math.PI / 2, 0, 0]}>
                  <cylinderGeometry args={[0.018, 0.018, 0.01, 16]} />
                  <meshBasicMaterial color="#000000" />
                </mesh>
              </group>
            )}

            {active && !isLocked && (
              <Sparkles count={15} scale={1.2} size={2.5} speed={0.5} opacity={0.8} color="#00FF41" />
            )}

            {/* Alien Name / Text (Stands up vertically facing outward) */}
            <Text
              position={[0, 0.35, 0]}
              rotation={[0, Math.PI, 0]}
              fontSize={isLocked ? 0.16 : 0.22}
              color={isLocked ? "#444444" : (active ? "#FFFFFF" : "#00FF41")}
              anchorX="center"
              anchorY="middle"
            >
              {isLocked ? "DNA LOCKED" : name}
            </Text>
          </mesh>
        </Float>
      </group>
    </group>
  );
}
