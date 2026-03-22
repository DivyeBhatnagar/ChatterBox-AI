import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface Particle {
  position: THREE.Vector3;
  velocity: THREE.Vector3;
  age: number;
  life: number;
}

function ParticleSystemInner() {
  const particlesRef = useRef<Particle[]>([]);
  const geometryRef = useRef<THREE.BufferGeometry | null>(null);
  const meshRef = useRef<THREE.Points | null>(null);
  const particleCountRef = useRef(500);

  useFrame((state) => {
    const deltaTime = state.clock.getDelta();
    const particles = particlesRef.current;

    // Update existing particles
    for (let i = particles.length - 1; i >= 0; i--) {
      const particle = particles[i];
      particle.age += deltaTime;
      particle.position.add(particle.velocity.clone().multiplyScalar(deltaTime));

      if (particle.age > particle.life) {
        particles.splice(i, 1);
      }
    }

    // Add new particles
    if (particles.length < particleCountRef.current) {
      for (let i = 0; i < 10; i++) {
        const angle = Math.random() * Math.PI * 2;
        const radius = Math.random() * 0.5;
        
        particles.push({
          position: new THREE.Vector3(
            Math.cos(angle) * radius,
            Math.random() - 0.5,
            Math.sin(angle) * radius
          ),
          velocity: new THREE.Vector3(
            (Math.random() - 0.5) * 2,
            Math.random() * 3,
            (Math.random() - 0.5) * 2
          ),
          age: 0,
          life: 3 + Math.random() * 2,
        });
      }
    }

    // Update geometry
    if (meshRef.current && particles.length > 0) {
      const positions = new Float32Array(particles.length * 3);
      const colors = new Float32Array(particles.length * 3);

      particles.forEach((particle, i) => {
        positions[i * 3] = particle.position.x;
        positions[i * 3 + 1] = particle.position.y;
        positions[i * 3 + 2] = particle.position.z;

        // Fade color as particle ages
        const alpha = 1 - particle.age / particle.life;
        colors[i * 3] = 0; // R
        colors[i * 3 + 1] = 0.85 * alpha; // G
        colors[i * 3 + 2] = 1 * alpha; // B
      });

      if (meshRef.current.geometry) {
        (meshRef.current.geometry as THREE.BufferGeometry).setAttribute(
          'position',
          new THREE.BufferAttribute(positions, 3)
        );
        (meshRef.current.geometry as THREE.BufferGeometry).setAttribute(
          'color',
          new THREE.BufferAttribute(colors, 3)
        );
      }
    }
  });

  return (
    <points ref={meshRef}>
      <bufferGeometry ref={geometryRef} />
      <pointsMaterial
        size={0.05}
        sizeAttenuation
        transparent
        vertexColors
        color="#00d9ff"
      />
    </points>
  );
}

export const ParticleSystem = () => {
  return (
    <Canvas
      camera={{ position: [0, 0, 4] }}
      style={{ width: '100%', height: '100%' }}
      dpr={[1, 2]}
    >
      <color attach="background" args={['#000000']} />
      <ambientLight intensity={0.3} />
      <ParticleSystemInner />
    </Canvas>
  );
};
