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
}

export function WheelSlot({ name, position, rotation, isFocused }: WheelSlotProps) {
  const [hovered, setHovered] = useState(false);
  const meshRef = useRef<THREE.Mesh>(null);
  const setActiveAlien = useOmnitrixStore((state) => state.setActiveAlien);
  const setIsTransforming = useOmnitrixStore((state) => state.setIsTransforming);
  const { camera } = useThree();

  const active = hovered || isFocused;
  
  // Format alien ID to match the image name (e.g., 'heatblast.png', 'four_arms.png')
  const formattedId = name.toLowerCase().replace(' ', '_');
  const texture = useTexture(`/aliens/${formattedId}.png`);

  useFrame((state, delta) => {
    if (!meshRef.current) return;
    const targetScale = active ? 1.3 : 0.95;
    meshRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.15);
  });

  const handleClick = (e: any) => {
    e.stopPropagation();

    // Trigger transformation audio/visual effects
    synth.playTransform();
    setIsTransforming(true);

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) {
      // Skip camera zoom for reduced motion
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
            synth.playClick();
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
            color={active ? "#00FF41" : "#114411"} 
            emissive={active ? "#00FF41" : "#000000"}
            emissiveIntensity={active ? 0.9 : 0}
            wireframe
          />

          {/* Floating Holographic Image Texture */}
          <mesh position={[0, 0, 0.11]} rotation={[0, Math.PI, 0]}>
            <planeGeometry args={[0.9, 1.35]} />
            <meshBasicMaterial 
              map={texture} 
              transparent 
              opacity={active ? 0.95 : 0.5} 
              toneMapped={false}
              side={THREE.DoubleSide}
            />
          </mesh>

          {active && (
            <Sparkles count={25} scale={2} size={3} speed={0.6} opacity={1} color="#00FF41" />
          )}

          <Text
            position={[0, -1.2, 0]}
            rotation={[0, Math.PI, 0]}
            fontSize={0.3}
            color={active ? "#FFFFFF" : "#00FF41"}
            anchorX="center"
            anchorY="middle"
          >
            {name}
          </Text>
        </mesh>
      </Float>
    </group>
  );
}
