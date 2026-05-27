'use client';

import { useState, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
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
  const setActiveAlien = useOmnitrixStore((state) => state.setActiveAlien);
  const setIsTransforming = useOmnitrixStore((state) => state.setIsTransforming);
  const { camera } = useThree();

  const active = (hovered || isFocused) && !isLocked;
  
  // Format alien ID to match the image name (e.g., 'heatblast.png', 'four_arms.png')
  const formattedId = name.toLowerCase().replace(' ', '_');
  const texture = useTexture(`/aliens/${formattedId}.png`);

  useFrame((state, delta) => {
    if (!meshRef.current) return;
    const targetScale = (hovered || isFocused) ? (isLocked ? 1.05 : 1.3) : 0.95;
    meshRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.15);
  });

  const handleClick = (e: any) => {
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

    // Dolly camera forward into card face
    gsap.to(camera.position, {
      z: 1.8,
      duration: 0.4,
      ease: 'power2.in',
      onComplete: () => {
        // Force unlock the DNA profile on success
        useOmnitrixStore.getState().unlockAlien(formattedId);
        setActiveAlien(formattedId);
        // Reset camera positions for subsequent loads
        camera.position.set(0, 2, 8);
      }
    });
  };

  return (
    <group position={position} rotation={rotation}>
      <Float speed={active ? 3 : 1.5} rotationIntensity={active ? 0.3 : 0.1} floatIntensity={active ? 0.6 : 0.3}>
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
          <boxGeometry args={[1, 1.5, 0.2]} />
          <meshStandardMaterial 
            color={isLocked ? "#222222" : (active ? "#00FF41" : "#114411")} 
            emissive={isLocked ? "#000000" : (active ? "#00FF41" : "#000000")}
            emissiveIntensity={isLocked ? 0 : (active ? 0.9 : 0)}
            wireframe
          />

          {/* Floating Holographic Image Texture */}
          <mesh position={[0, 0, 0.11]} rotation={[0, Math.PI, 0]}>
            <planeGeometry args={[0.9, 1.35]} />
            <meshBasicMaterial 
              map={texture} 
              transparent 
              opacity={isLocked ? 0.04 : (active ? 0.95 : 0.5)} 
              toneMapped={false}
              side={THREE.DoubleSide}
              color={isLocked ? "#151515" : "#ffffff"}
            />
          </mesh>

          {/* 3D High-Fidelity Procedural Padlock Overlay */}
          {isLocked && (
            <group position={[0, 0, 0.18]}>
              {/* Padlock loop shackle */}
              <mesh position={[0, 0.16, 0]}>
                <torusGeometry args={[0.16, 0.035, 8, 24, Math.PI]} />
                <meshStandardMaterial color="#888888" metalness={0.9} roughness={0.15} />
              </mesh>
              {/* Padlock body */}
              <mesh position={[0, -0.04, 0]}>
                <boxGeometry args={[0.38, 0.32, 0.11]} />
                <meshStandardMaterial color="#E63946" emissive="#550000" emissiveIntensity={0.6} roughness={0.3} metalness={0.7} />
              </mesh>
              {/* Keyhole slot */}
              <mesh position={[0, -0.04, 0.06]} rotation={[Math.PI / 2, 0, 0]}>
                <cylinderGeometry args={[0.025, 0.025, 0.01, 16]} />
                <meshBasicMaterial color="#000000" />
              </mesh>
            </group>
          )}

          {active && !isLocked && (
            <Sparkles count={25} scale={2} size={3} speed={0.6} opacity={1} color="#00FF41" />
          )}

          <Text
            position={[0, -1.2, 0]}
            rotation={[0, Math.PI, 0]}
            fontSize={isLocked ? 0.22 : 0.3}
            color={isLocked ? "#444444" : (active ? "#FFFFFF" : "#00FF41")}
            anchorX="center"
            anchorY="middle"
          >
            {isLocked ? "DNA LOCKED" : name}
          </Text>
        </mesh>
      </Float>
    </group>
  );
}
