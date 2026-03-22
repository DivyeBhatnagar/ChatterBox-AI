import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Sphere, Torus, Box } from '@react-three/drei';
import * as THREE from 'three';

interface FloatingShapesProps {
  count?: number;
}

interface ShapeConfig {
  position: [number, number, number];
  type: 'sphere' | 'torus' | 'box';
  rotation: [number, number, number];
  color: string;
  emissive: string;
}

function FloatingShape({ 
  config, 
  index 
}: { 
  config: ShapeConfig; 
  index: number;
}) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      const time = state.clock.getElapsedTime();
      
      // Orbital motion around center
      const radius = 2.5;
      const speed = 0.3 + index * 0.1;
      meshRef.current.position.x = Math.cos(time * speed + index) * radius;
      meshRef.current.position.z = Math.sin(time * speed + index) * radius;
      
      // Independent rotation
      meshRef.current.rotation.x += 0.003;
      meshRef.current.rotation.y += 0.002;
      meshRef.current.rotation.z += 0.001;
      
      // Subtle scale pulse
      const scale = 0.9 + 0.1 * Math.sin(time * 2 + index);
      meshRef.current.scale.set(scale, scale, scale);
    }
  });

  return (
    <group position={config.position}>
      {config.type === 'sphere' && (
        <Sphere ref={meshRef} args={[0.4, 32, 32]}>
          <meshPhongMaterial
            color={config.color}
            emissive={config.emissive}
            emissiveIntensity={0.6}
          />
        </Sphere>
      )}
      {config.type === 'torus' && (
        <Torus ref={meshRef} args={[0.4, 0.15, 16, 100]}>
          <meshPhongMaterial
            color={config.color}
            emissive={config.emissive}
            emissiveIntensity={0.6}
          />
        </Torus>
      )}
      {config.type === 'box' && (
        <Box ref={meshRef} args={[0.5, 0.5, 0.5]}>
          <meshPhongMaterial
            color={config.color}
            emissive={config.emissive}
            emissiveIntensity={0.6}
          />
        </Box>
      )}
    </group>
  );
}

function FloatingShapesInner({ shapes }: { shapes: ShapeConfig[] }) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.0001;
    }
  });

  return (
    <group ref={groupRef}>
      {shapes.map((config, index) => (
        <FloatingShape key={index} config={config} index={index} />
      ))}
    </group>
  );
}

export const FloatingShapes: React.FC<FloatingShapesProps> = ({ count = 6 }) => {
  const shapes: ShapeConfig[] = useMemo(() => {
    const types: ('sphere' | 'torus' | 'box')[] = ['sphere', 'torus', 'box'];
    const colors = ['#00d9ff', '#0099ff', '#00ffaa'];
    const emissives = ['#0099ff', '#0066ff', '#00cc88'];
    
    return Array.from({ length: count }, (_, i) => ({
      position: [0, 0, 0] as [number, number, number],
      type: types[i % types.length],
      rotation: [0, 0, 0] as [number, number, number],
      color: colors[i % colors.length],
      emissive: emissives[i % emissives.length],
    }));
  }, [count]);

  return (
    <Canvas
      camera={{ position: [0, 0, 6] }}
      style={{ width: '100%', height: '100%' }}
      dpr={[1, 2]}
      onCreated={(state) => {
        try {
          state.gl.setClearColor('#000000');
        } catch (e) {
          console.warn('Could not set clear color', e);
        }
      }}
    >
      <color attach="background" args={['#000000']} />
      
      <ambientLight intensity={0.3} color="#ffffff" />
      <directionalLight position={[5, 5, 5]} intensity={0.5} color="#ffffff" />
      <pointLight position={[-5, 5, 5]} intensity={0.4} color="#0099ff" />
      <pointLight position={[5, -5, 5]} intensity={0.3} color="#00ffaa" />
      
      <FloatingShapesInner shapes={shapes} />
    </Canvas>
  );
};
