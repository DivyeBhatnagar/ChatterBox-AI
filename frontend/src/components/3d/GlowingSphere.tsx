import { Canvas, useFrame } from '@react-three/fiber';
import { useRef } from 'react';
import * as THREE from 'three';

function GlowingSphere() {
  const sphereRef = useRef<THREE.Mesh>(null);

  useFrame(() => {
    if (sphereRef.current) {
      sphereRef.current.rotation.x += 0.001;
      sphereRef.current.rotation.y += 0.002;
    }
  });

  return (
    <>
      <mesh ref={sphereRef}>
        <sphereGeometry args={[2, 64, 64]} />
        <meshPhongMaterial
          color="#0099ff"
          emissive="#00d9ff"
          emissiveIntensity={0.4}
          wireframe={false}
        />
      </mesh>
      
      {/* Glow effect */}
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[2.1, 64, 64]} />
        <meshBasicMaterial
          color="#00d9ff"
          transparent
          opacity={0.15}
        />
      </mesh>
    </>
  );
}

export function GlowingSphereVisualization() {
  return (
    <Canvas
      camera={{ position: [0, 0, 5.5] }}
      style={{ width: '100%', height: '100%' }}
      dpr={[1, 2]}
    >
      <color attach="background" args={['#000000']} />
      <ambientLight intensity={0.3} color="#ffffff" />
      <directionalLight position={[5, 5, 5]} intensity={0.6} color="#ffffff" />
      <pointLight position={[0, 0, 3]} intensity={0.5} color="#0099ff" />
      <pointLight position={[-5, -5, 5]} intensity={0.3} color="#00ffaa" />
      <GlowingSphere />
    </Canvas>
  );
}
