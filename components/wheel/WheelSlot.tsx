'use client';

import { useState, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text, Sparkles, Float } from '@react-three/drei';
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

  const active = hovered || isFocused;

  useFrame((state, delta) => {
    if (!meshRef.current) return;
    const targetScale = active ? 1.3 : 0.95;
    meshRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.15);
  });

  const handleClick = (e: any) => {
    e.stopPropagation();
    // Convert 'Heatblast' to 'heatblast', 'Four Arms' to 'four_arms'
    const formattedId = name.toLowerCase().replace(' ', '_');
    setActiveAlien(formattedId);
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
