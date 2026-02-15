"use client"

import { Canvas } from "@react-three/fiber"
import { Suspense, useRef, useMemo } from "react"
import { useFrame, useThree } from "@react-three/fiber"
import * as THREE from "three"

function Sun({ scrollProgress }: { scrollProgress: number }) {
  const sunRef = useRef<THREE.Group>(null)
  const glowRef = useRef<THREE.Mesh>(null)
  const raysRef = useRef<THREE.Group>(null)
  const haloRef = useRef<THREE.Mesh>(null)

  useFrame((state) => {
    if (!sunRef.current) return
    const t = state.clock.elapsedTime

    // Slow rotation
    sunRef.current.rotation.z = t * 0.05
    sunRef.current.rotation.y = Math.sin(t * 0.03) * 0.1

    // Breathing / pulsation
    const pulse = 1 + Math.sin(t * 0.8) * 0.03
    sunRef.current.scale.setScalar(pulse)

    // Glow pulsation
    if (glowRef.current) {
      const mat = glowRef.current.material as THREE.MeshBasicMaterial
      mat.opacity = 0.15 + Math.sin(t * 0.5) * 0.05
    }

    // Halo pulsation
    if (haloRef.current) {
      const mat = haloRef.current.material as THREE.MeshBasicMaterial
      mat.opacity = 0.08 + Math.sin(t * 0.3) * 0.03
      haloRef.current.rotation.z = -t * 0.02
    }

    // Rays rotation
    if (raysRef.current) {
      raysRef.current.rotation.z = t * 0.015
    }

    // Scroll-based camera pull
    sunRef.current.position.y = 0.5 - scrollProgress * 2
  })

  const rayCount = 12
  const rays = useMemo(() => {
    return Array.from({ length: rayCount }, (_, i) => {
      const angle = (i / rayCount) * Math.PI * 2
      return { angle, length: 2.5 + Math.random() * 1.5, width: 0.04 + Math.random() * 0.03 }
    })
  }, [])

  return (
    <group ref={sunRef} position={[0, 0.5, 0]}>
      {/* Core sun sphere */}
      <mesh>
        <sphereGeometry args={[0.8, 64, 64]} />
        <meshStandardMaterial
          color="#e8a840"
          emissive="#d4922a"
          emissiveIntensity={2}
          roughness={0.3}
          metalness={0.1}
        />
      </mesh>

      {/* Inner glow */}
      <mesh ref={glowRef} scale={1.3}>
        <sphereGeometry args={[0.8, 32, 32]} />
        <meshBasicMaterial
          color="#f0c060"
          transparent
          opacity={0.15}
          side={THREE.BackSide}
        />
      </mesh>

      {/* Outer halo */}
      <mesh ref={haloRef} scale={2.2}>
        <sphereGeometry args={[0.8, 32, 32]} />
        <meshBasicMaterial
          color="#e8a840"
          transparent
          opacity={0.08}
          side={THREE.BackSide}
        />
      </mesh>

      {/* Volumetric rays */}
      <group ref={raysRef}>
        {rays.map((ray, i) => (
          <mesh
            key={i}
            position={[
              Math.cos(ray.angle) * (ray.length / 2 + 0.8),
              Math.sin(ray.angle) * (ray.length / 2 + 0.8),
              0,
            ]}
            rotation={[0, 0, ray.angle]}
          >
            <planeGeometry args={[ray.length, ray.width]} />
            <meshBasicMaterial
              color="#f0c060"
              transparent
              opacity={0.06}
              side={THREE.DoubleSide}
            />
          </mesh>
        ))}
      </group>

      {/* Point light from sun */}
      <pointLight color="#e8a840" intensity={4} distance={20} />
    </group>
  )
}

function Ship({ scrollProgress }: { scrollProgress: number }) {
  const shipRef = useRef<THREE.Group>(null)

  useFrame((state) => {
    if (!shipRef.current) return
    const t = state.clock.elapsedTime

    // Slow horizontal movement
    shipRef.current.position.x = -3 + t * 0.03
    if (shipRef.current.position.x > 5) {
      shipRef.current.position.x = -5
    }

    // Gentle bobbing on water
    shipRef.current.position.y = -1.8 + Math.sin(t * 0.5) * 0.05
    shipRef.current.rotation.z = Math.sin(t * 0.4) * 0.02

    // Scroll parallax
    shipRef.current.position.y -= scrollProgress * 1.5
  })

  return (
    <group ref={shipRef} position={[-3, -1.8, -2]} scale={0.15}>
      {/* Hull */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[8, 1.2, 2]} />
        <meshStandardMaterial color="#1a1a2e" roughness={0.8} metalness={0.3} />
      </mesh>
      {/* Bridge/superstructure */}
      <mesh position={[2.5, 1.2, 0]}>
        <boxGeometry args={[2, 1.8, 1.5]} />
        <meshStandardMaterial color="#252540" roughness={0.7} metalness={0.2} />
      </mesh>
      {/* Funnel */}
      <mesh position={[2.5, 2.5, 0]}>
        <cylinderGeometry args={[0.2, 0.3, 0.8, 8]} />
        <meshStandardMaterial color="#2a2a3a" roughness={0.6} metalness={0.4} />
      </mesh>
      {/* Deck structures */}
      <mesh position={[-1, 0.9, 0]}>
        <boxGeometry args={[4, 0.4, 1.8]} />
        <meshStandardMaterial color="#1e1e35" roughness={0.9} metalness={0.2} />
      </mesh>
    </group>
  )
}

function Ocean({ scrollProgress }: { scrollProgress: number }) {
  const oceanRef = useRef<THREE.Mesh>(null)
  const materialRef = useRef<THREE.ShaderMaterial>(null)

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uColor1: { value: new THREE.Color("#050a18") },
      uColor2: { value: new THREE.Color("#0a1628") },
    }),
    []
  )

  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = state.clock.elapsedTime
    }
    if (oceanRef.current) {
      oceanRef.current.position.y = -2 - scrollProgress * 1
    }
  })

  return (
    <mesh ref={oceanRef} rotation={[-Math.PI / 2.2, 0, 0]} position={[0, -2, 0]}>
      <planeGeometry args={[30, 30, 64, 64]} />
      <shaderMaterial
        ref={materialRef}
        uniforms={uniforms}
        vertexShader={`
          uniform float uTime;
          varying vec2 vUv;
          varying float vElevation;
          void main() {
            vUv = uv;
            vec3 pos = position;
            float wave1 = sin(pos.x * 0.5 + uTime * 0.3) * 0.15;
            float wave2 = sin(pos.y * 0.3 + uTime * 0.2) * 0.1;
            float wave3 = sin((pos.x + pos.y) * 0.2 + uTime * 0.15) * 0.08;
            pos.z += wave1 + wave2 + wave3;
            vElevation = pos.z;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
          }
        `}
        fragmentShader={`
          uniform vec3 uColor1;
          uniform vec3 uColor2;
          uniform float uTime;
          varying vec2 vUv;
          varying float vElevation;
          void main() {
            float mixFactor = vUv.y * 0.7 + vElevation * 0.3 + 0.3;
            vec3 color = mix(uColor1, uColor2, clamp(mixFactor, 0.0, 1.0));
            // Add subtle shimmer
            float shimmer = sin(vUv.x * 40.0 + uTime * 0.5) * sin(vUv.y * 40.0 + uTime * 0.3) * 0.02;
            color += shimmer;
            gl_FragColor = vec4(color, 0.9);
          }
        `}
        transparent
      />
    </mesh>
  )
}

function Particles() {
  const particlesRef = useRef<THREE.Points>(null)
  const count = 200

  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 20
      pos[i * 3 + 1] = (Math.random() - 0.5) * 10
      pos[i * 3 + 2] = (Math.random() - 0.5) * 10
    }
    return pos
  }, [])

  useFrame((state) => {
    if (!particlesRef.current) return
    particlesRef.current.rotation.y = state.clock.elapsedTime * 0.005
  })

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        color="#e8a840"
        size={0.015}
        transparent
        opacity={0.4}
        sizeAttenuation
      />
    </points>
  )
}

function CameraController({
  scrollProgress,
  mouseX,
  mouseY,
}: {
  scrollProgress: number
  mouseX: number
  mouseY: number
}) {
  const { camera } = useThree()

  useFrame(() => {
    // Base position
    const baseZ = 6 + scrollProgress * 4
    const baseY = 0.5 - scrollProgress * 1

    // Mouse parallax
    const targetX = mouseX * 0.3
    const targetY = baseY + mouseY * 0.2

    camera.position.x += (targetX - camera.position.x) * 0.03
    camera.position.y += (targetY - camera.position.y) * 0.03
    camera.position.z += (baseZ - camera.position.z) * 0.03

    camera.lookAt(0, 0, 0)
  })

  return null
}

interface Scene3DProps {
  scrollProgress: number
  mouseX: number
  mouseY: number
}

export default function Scene3D({ scrollProgress, mouseX, mouseY }: Scene3DProps) {
  return (
    <div className="fixed inset-0 z-0" style={{ pointerEvents: "none" }}>
      <Canvas
        camera={{ position: [0, 0.5, 6], fov: 50 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: "transparent" }}
      >
        <Suspense fallback={null}>
          <ambientLight intensity={0.1} />
          <directionalLight position={[5, 5, 5]} intensity={0.3} color="#e8a840" />
          <fog attach="fog" args={["#050a14", 5, 25]} />
          <CameraController
            scrollProgress={scrollProgress}
            mouseX={mouseX}
            mouseY={mouseY}
          />
          <Sun scrollProgress={scrollProgress} />
          <Ship scrollProgress={scrollProgress} />
          <Ocean scrollProgress={scrollProgress} />
          <Particles />
        </Suspense>
      </Canvas>
    </div>
  )
}
