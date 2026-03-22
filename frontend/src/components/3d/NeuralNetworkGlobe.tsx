import { Canvas, useFrame } from '@react-three/fiber';
import { Icosahedron } from '@react-three/drei';
import { useRef, useMemo } from 'react';
import * as THREE from 'three';

function NeuralGlobeScene() {
  const groupRef = useRef<THREE.Group>(null);
  const sphereRef = useRef<THREE.Mesh>(null);

  const nodes = useMemo(() => {
    const positions = [];
    for (let i = 0; i < 12; i++) {
      const phi = Math.acos(-1 + (2 * i) / 12);
      const theta = Math.sqrt(12 * Math.PI) * phi;
      positions.push(
        new THREE.Vector3(
          2.5 * Math.cos(theta) * Math.sin(phi),
          2.5 * Math.sin(theta) * Math.sin(phi),
          2.5 * Math.cos(phi)
        )
      );
    }
    return positions;
  }, []);

  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.rotation.x += 0.0002;
      groupRef.current.rotation.y += 0.0003;
    }
    if (sphereRef.current) {
      sphereRef.current.rotation.z += 0.0001;
    }
  });

  return (
    <group ref={groupRef}>
      <mesh ref={sphereRef} position={[0, 0, 0]}>
        <sphereGeometry args={[1.8, 64, 64]} />
        <meshPhongMaterial
          color="#00d9ff"
          emissive="#0099ff"
          emissiveIntensity={0.5}
          wireframe={true}
        />
      </mesh>
      {nodes.map((pos, i) => (
        <mesh key={i} position={[pos.x, pos.y, pos.z]}>
          <sphereGeometry args={[0.15, 16, 16]} />
          <meshPhongMaterial
            color="#00d9ff"
            emissive="#0099ff"
            emissiveIntensity={0.8}
          />
        </mesh>
      ))}
      <Icosahedron args={[3.2, 4]} position={[0, 0, 0]}>
        <meshBasicMaterial
          color="#0099ff"
          transparent
          opacity={0.05}
          wireframe={true}
        />
      </Icosahedron>
    </group>
  );
}

export function NeuralNetworkGlobe() {
  return (
    <Canvas
      camera={{ position: [0, 0, 6], fov: 50 }}
      style={{ width: '100%', height: '100%' }}
      dpr={[1, 2]}
      onCreated={(state) => {
        state.gl.setClearColor('#000000');
      }}
    >
      <color attach="background" args={['#000000']} />
      <ambientLight intensity={0.4} color="#ffffff" />
      <directionalLight position={[5, 5, 5]} intensity={0.6} color="#ffffff" />
      <pointLight position={[-5, 5, 5]} intensity={0.4} color="#0099ff" />
      <NeuralGlobeScene />
    </Canvas>
  );
}
