'use client';

import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sparkles, Line, Grid } from '@react-three/drei';
import { useOmnitrixStore } from '@/lib/store/useOmnitrixStore';
import { themes } from '@/lib/themes';
import * as THREE from 'three';

// 1. Heatblast - Lava Fire Particles rising
function FireParticles() {
  return (
    <Sparkles
      count={250}
      scale={8}
      size={4}
      speed={1.5}
      opacity={1}
      color="#FF4500"
      noise={0.5}
    />
  );
}

// 2. XLR8 - Hyperspeed cyan horizontal streaks
function SpeedStreaks() {
  const count = 15;
  const lines = useMemo(() => {
    return Array.from({ length: count }).map(() => {
      const y = (Math.random() - 0.5) * 6;
      const z = (Math.random() - 0.5) * 4;
      const length = 2 + Math.random() * 4;
      const speed = 0.1 + Math.random() * 0.15;
      return { y, z, length, speed, x: (Math.random() - 0.5) * 10 };
    });
  }, []);

  const groupRef = useRef<THREE.Group>(null);

  useFrame(() => {
    if (!groupRef.current) return;
    groupRef.current.children.forEach((child, i) => {
      const lineData = lines[i];
      child.position.x += lineData.speed;
      if (child.position.x > 8) {
        child.position.x = -8;
      }
    });
  });

  return (
    <group ref={groupRef}>
      {lines.map((line, i) => (
        <group key={i} position={[line.x, line.y, line.z]}>
          <Line
            points={[[-line.length / 2, 0, 0], [line.length / 2, 0, 0]]}
            color="#00BFFF"
            lineWidth={2}
            transparent
            opacity={0.6}
          />
        </group>
      ))}
    </group>
  );
}

// 3. Ghostfreak - Wobbly wisp spheres
function SpectralWisps() {
  const count = 8;
  const wisps = useMemo(() => {
    return Array.from({ length: count }).map(() => ({
      position: [
        (Math.random() - 0.5) * 6,
        (Math.random() - 0.5) * 4,
        (Math.random() - 0.5) * 3,
      ] as [number, number, number],
      scale: 0.2 + Math.random() * 0.4,
      speed: 0.5 + Math.random() * 1.5,
      seed: Math.random() * 100,
    }));
  }, []);

  return (
    <group>
      {wisps.map((wisp, i) => {
        const ref = useRef<THREE.Mesh>(null);
        useFrame((state) => {
          if (!ref.current) return;
          const t = state.clock.getElapsedTime() * wisp.speed + wisp.seed;
          ref.current.position.y = wisp.position[1] + Math.sin(t) * 0.3;
          ref.current.position.x = wisp.position[0] + Math.cos(t * 0.7) * 0.3;
          ref.current.scale.setScalar(wisp.scale + Math.sin(t * 2) * 0.05);
        });

        return (
          <mesh key={i} ref={ref} position={wisp.position}>
            <sphereGeometry args={[1, 16, 16]} />
            <meshBasicMaterial
              color="#7B00FF"
              transparent
              opacity={0.25}
              wireframe
            />
          </mesh>
        );
      })}
    </group>
  );
}

// 4. Diamondhead - Rotating floating low-poly crystals
function CrystalShards() {
  const count = 12;
  const shards = useMemo(() => {
    return Array.from({ length: count }).map(() => ({
      position: [
        (Math.random() - 0.5) * 8,
        (Math.random() - 0.5) * 5,
        (Math.random() - 0.5) * 3,
      ] as [number, number, number],
      scale: 0.15 + Math.random() * 0.25,
      rotSpeed: [Math.random() * 0.02, Math.random() * 0.02, Math.random() * 0.02] as [number, number, number],
    }));
  }, []);

  return (
    <group>
      {shards.map((shard, i) => {
        const ref = useRef<THREE.Mesh>(null);
        useFrame(() => {
          if (!ref.current) return;
          ref.current.rotation.x += shard.rotSpeed[0];
          ref.current.rotation.y += shard.rotSpeed[1];
          ref.current.rotation.z += shard.rotSpeed[2];
        });

        return (
          <mesh key={i} ref={ref} position={shard.position} scale={shard.scale}>
            <octahedronGeometry args={[1, 0]} />
            <meshStandardMaterial
              color="#00FFCC"
              emissive="#00FFCC"
              emissiveIntensity={0.6}
              transparent
              opacity={0.7}
              roughness={0.1}
              metalness={0.9}
            />
          </mesh>
        );
      })}
    </group>
  );
}

// 5. Upgrade - Neon green cyberpunk grid that glitches Y height
function CyberGrid() {
  const ref = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.getElapsedTime();
    // Simulate digital scanlines glitching
    ref.current.position.y = -2 + (Math.random() > 0.98 ? (Math.random() - 0.5) * 0.2 : 0);
    ref.current.rotation.x = -Math.PI / 2.2 + Math.sin(t * 0.5) * 0.02;
  });

  return (
    <group ref={ref} position={[0, -2, -1]} rotation={[-Math.PI / 2.2, 0, 0]}>
      <Grid
        renderOrder={-1}
        position={[0, 0, 0]}
        args={[15, 15]}
        cellSize={0.5}
        cellThickness={1}
        cellColor="#00FF41"
        sectionSize={2.5}
        sectionThickness={1.5}
        sectionColor="#00FF41"
        fadeDistance={25}
        fadeStrength={1}
        infiniteGrid
      />
    </group>
  );
}

// 6. Four Arms - Shockwave circles expanding
function Shockwaves() {
  const count = 3;
  const waves = useMemo(() => {
    return Array.from({ length: count }).map((_, i) => ({
      delay: i * 1.5,
    }));
  }, []);

  return (
    <group position={[0, 0, -1]}>
      {waves.map((wave, i) => {
        const ref = useRef<THREE.Mesh>(null);
        useFrame((state) => {
          if (!ref.current) return;
          const t = (state.clock.getElapsedTime() + wave.delay) % 4.5;
          const scale = t * 2.5;
          const opacity = Math.max(0, 1 - t / 4.5);
          ref.current.scale.set(scale, scale, 1);
          if (ref.current.material) {
            (ref.current.material as any).opacity = opacity * 0.4;
          }
        });

        return (
          <mesh key={i} ref={ref}>
            <ringGeometry args={[0.98, 1, 64]} />
            <meshBasicMaterial color="#CC2200" transparent opacity={0.4} side={THREE.DoubleSide} />
          </mesh>
        );
      })}
    </group>
  );
}

// 7. Wildmutt - Radial radar sonar echo wave rings
function SonarPulse() {
  const count = 4;
  const pulses = useMemo(() => {
    return Array.from({ length: count }).map((_, i) => ({
      delay: i * 1.2,
    }));
  }, []);

  return (
    <group position={[0, 0, -2]}>
      {pulses.map((pulse, i) => {
        const ref = useRef<THREE.Mesh>(null);
        useFrame((state) => {
          if (!ref.current) return;
          const t = (state.clock.getElapsedTime() + pulse.delay) % 4.8;
          const scale = t * 2.2;
          const opacity = Math.max(0, 0.8 - t / 4.8);
          ref.current.scale.set(scale, scale, 1);
          if (ref.current.material) {
            (ref.current.material as any).opacity = opacity * 0.3;
          }
        });

        return (
          <mesh key={i} ref={ref}>
            <ringGeometry args={[0.95, 1, 32]} />
            <meshBasicMaterial color="#FF8800" transparent opacity={0.3} side={THREE.DoubleSide} wireframe />
          </mesh>
        );
      })}
    </group>
  );
}

// 8. Grey Matter - Neural network graph connecting nodes
function NeuralNetwork() {
  const count = 18;
  const nodes = useMemo(() => {
    return Array.from({ length: count }).map(() => {
      const pos = new THREE.Vector3(
        (Math.random() - 0.5) * 7,
        (Math.random() - 0.5) * 5,
        (Math.random() - 0.5) * 3
      );
      const vel = new THREE.Vector3(
        (Math.random() - 0.5) * 0.015,
        (Math.random() - 0.5) * 0.015,
        (Math.random() - 0.5) * 0.015
      );
      return { pos, vel };
    });
  }, []);

  const lineRef = useRef<THREE.LineSegments>(null);

  useFrame(() => {
    // Update node positions
    nodes.forEach(node => {
      node.pos.add(node.vel);
      if (Math.abs(node.pos.x) > 4) node.vel.x *= -1;
      if (Math.abs(node.pos.y) > 3) node.vel.y *= -1;
      if (Math.abs(node.pos.z) > 2) node.vel.z *= -1;
    });

    if (!lineRef.current) return;

    // Dynamically calculate and draw lines between close nodes
    const positions: number[] = [];
    for (let i = 0; i < count; i++) {
      for (let j = i + 1; j < count; j++) {
        const dist = nodes[i].pos.distanceTo(nodes[j].pos);
        if (dist < 2.5) {
          positions.push(nodes[i].pos.x, nodes[i].pos.y, nodes[i].pos.z);
          positions.push(nodes[j].pos.x, nodes[j].pos.y, nodes[j].pos.z);
        }
      }
    }

    lineRef.current.geometry.setAttribute(
      'position',
      new THREE.Float32BufferAttribute(positions, 3)
    );
    lineRef.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <group>
      {nodes.map((node, i) => (
        <mesh key={i} position={node.pos.toArray() as [number, number, number]}>
          <sphereGeometry args={[0.08, 8, 8]} />
          <meshBasicMaterial color="#55AAFF" />
        </mesh>
      ))}
      <lineSegments ref={lineRef}>
        <bufferGeometry />
        <lineBasicMaterial color="#55AAFF" transparent opacity={0.3} />
      </lineSegments>
    </group>
  );
}

// 9. Stinkfly - Bioluminescent yellow-green floating spores
function BioSpores() {
  return (
    <Sparkles
      count={150}
      scale={7}
      size={3}
      speed={0.8}
      opacity={0.8}
      color="#AAFF00"
      noise={2}
    />
  );
}

// 10. Ripjaws - Wave ripples / deep blue ocean caustics
function WaterCaustics() {
  const count = 10;
  const ripples = useMemo(() => {
    return Array.from({ length: count }).map(() => ({
      position: [
        (Math.random() - 0.5) * 8,
        (Math.random() - 0.5) * 5,
        (Math.random() - 0.5) * 2,
      ] as [number, number, number],
      scale: 0.5 + Math.random() * 1.5,
      speed: 0.4 + Math.random() * 0.8,
      seed: Math.random() * 50,
    }));
  }, []);

  return (
    <group>
      {ripples.map((ripple, i) => {
        const ref = useRef<THREE.Mesh>(null);
        useFrame((state) => {
          if (!ref.current) return;
          const t = state.clock.getElapsedTime() * ripple.speed + ripple.seed;
          ref.current.scale.setScalar(ripple.scale + Math.sin(t) * 0.2);
          if (ref.current.material) {
            (ref.current.material as any).opacity = (0.2 + Math.sin(t * 0.8) * 0.1) * 0.6;
          }
        });

        return (
          <mesh key={i} ref={ref} position={ripple.position} rotation={[Math.PI / 2, 0, 0]}>
            <ringGeometry args={[0.8, 1, 32]} />
            <meshBasicMaterial color="#0088FF" transparent opacity={0.2} side={THREE.DoubleSide} />
          </mesh>
        );
      })}
    </group>
  );
}

export function ParticleField() {
  const activeAlien = useOmnitrixStore((state) => state.activeAlien);

  if (!activeAlien) return null;

  const theme = themes[activeAlien];
  if (!theme) return null;

  // Dynamically render custom procedural particles per alien
  switch (activeAlien) {
    case 'heatblast':
      return <FireParticles />;
    case 'xlr8':
      return <SpeedStreaks />;
    case 'ghostfreak':
      return <SpectralWisps />;
    case 'diamondhead':
      return <CrystalShards />;
    case 'upgrade':
      return <CyberGrid />;
    case 'four_arms':
      return <Shockwaves />;
    case 'wildmutt':
      return <SonarPulse />;
    case 'grey_matter':
      return <NeuralNetwork />;
    case 'stinkfly':
      return <BioSpores />;
    case 'ripjaws':
      return <WaterCaustics />;
    default:
      // High-quality fallback green sparkles
      return (
        <Sparkles
          count={100}
          scale={5}
          size={2}
          speed={0.5}
          opacity={0.8}
          color="#00FF41"
        />
      );
  }
}
