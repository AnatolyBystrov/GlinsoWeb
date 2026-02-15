"use client"

import { useRef, useMemo, Suspense } from "react"
import { Canvas, useFrame, useThree } from "@react-three/fiber"
import { Float, Sparkles, MeshDistortMaterial, Environment } from "@react-three/drei"
import { EffectComposer, Bloom } from "@react-three/postprocessing"
import * as THREE from "three"

/* ── Phoenix-colored wireframe globe ─────────────────────────── */
function Globe({ scrollProgress, mouseX, mouseY }: {
  scrollProgress: number
  mouseX: number
  mouseY: number
}) {
  const meshRef = useRef<THREE.Mesh>(null!)
  const wireRef = useRef<THREE.Mesh>(null!)

  useFrame((_, delta) => {
    if (!meshRef.current) return
    meshRef.current.rotation.y += delta * 0.15
    meshRef.current.rotation.x = mouseY * 0.15
    meshRef.current.rotation.z = mouseX * 0.08

    if (wireRef.current) {
      wireRef.current.rotation.y -= delta * 0.08
      wireRef.current.rotation.x = -mouseY * 0.1
    }
  })

  const scale = 1.8 - scrollProgress * 0.6

  return (
    <group scale={scale}>
      {/* Core glowing sphere */}
      <Float speed={1.5} rotationIntensity={0.3} floatIntensity={0.5}>
        <mesh ref={meshRef}>
          <icosahedronGeometry args={[1, 4]} />
          <MeshDistortMaterial
            color="#e8943a"
            emissive="#c45e1a"
            emissiveIntensity={0.6}
            roughness={0.3}
            metalness={0.8}
            distort={0.25}
            speed={2}
            transparent
            opacity={0.85}
          />
        </mesh>
      </Float>

      {/* Outer wireframe ring */}
      <mesh ref={wireRef}>
        <icosahedronGeometry args={[1.35, 2]} />
        <meshBasicMaterial
          color="#e8a840"
          wireframe
          transparent
          opacity={0.15}
        />
      </mesh>

      {/* Second outer wireframe */}
      <mesh rotation={[Math.PI / 4, 0, Math.PI / 6]}>
        <torusGeometry args={[1.6, 0.005, 16, 100]} />
        <meshBasicMaterial color="#e8a840" transparent opacity={0.3} />
      </mesh>

      <mesh rotation={[Math.PI / 3, Math.PI / 5, 0]}>
        <torusGeometry args={[1.8, 0.004, 16, 100]} />
        <meshBasicMaterial color="#c45e1a" transparent opacity={0.2} />
      </mesh>
    </group>
  )
}

/* ── Ember particles orbiting the globe ─────────────────────── */
function EmberParticles() {
  const ref = useRef<THREE.Points>(null!)
  const count = 200

  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      const r = 2 + Math.random() * 3
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)
      arr[i * 3] = r * Math.sin(phi) * Math.cos(theta)
      arr[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta)
      arr[i * 3 + 2] = r * Math.cos(phi)
    }
    return arr
  }, [])

  useFrame((_, delta) => {
    if (ref.current) {
      ref.current.rotation.y += delta * 0.03
      ref.current.rotation.x += delta * 0.01
    }
  })

  return (
    <points ref={ref}>
      <bufferGeometry>
        <float32BufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        color="#e8a840"
        size={0.02}
        transparent
        opacity={0.5}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  )
}

/* ── Camera controller ──────────────────────────────────────── */
function CameraRig({ scrollProgress, mouseX, mouseY }: {
  scrollProgress: number
  mouseX: number
  mouseY: number
}) {
  const { camera } = useThree()
  const target = useRef(new THREE.Vector3())

  useFrame(() => {
    const z = 5 + scrollProgress * 3
    const x = mouseX * 0.3
    const y = mouseY * 0.2

    target.current.set(x, y, z)
    camera.position.lerp(target.current, 0.04)
    camera.lookAt(0, 0, 0)
  })

  return null
}

/* ── Main scene export ──────────────────────────────────────── */
interface GlobeSceneProps {
  scrollProgress: number
  mouseX: number
  mouseY: number
}

export default function GlobeScene({ scrollProgress, mouseX, mouseY }: GlobeSceneProps) {
  return (
    <div
      className="fixed inset-0 z-[1]"
      style={{
        opacity: Math.max(0, 1 - scrollProgress * 1.5),
        pointerEvents: "none",
      }}
    >
      <Canvas
        camera={{ position: [0, 0, 5], fov: 45 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        style={{ background: "transparent" }}
      >
        <Suspense fallback={null}>
          {/* Lighting */}
          <ambientLight intensity={0.3} />
          <pointLight position={[5, 5, 5]} intensity={1} color="#e8a840" />
          <pointLight position={[-3, -3, 2]} intensity={0.5} color="#c45e1a" />

          {/* Globe */}
          <Globe
            scrollProgress={scrollProgress}
            mouseX={mouseX}
            mouseY={mouseY}
          />

          {/* Particles */}
          <EmberParticles />
          <Sparkles
            count={80}
            scale={6}
            size={1.5}
            speed={0.4}
            color="#e8a840"
            opacity={0.3}
          />

          {/* Camera */}
          <CameraRig
            scrollProgress={scrollProgress}
            mouseX={mouseX}
            mouseY={mouseY}
          />

          {/* Bloom */}
          <EffectComposer>
            <Bloom
              intensity={0.8}
              luminanceThreshold={0.2}
              luminanceSmoothing={0.9}
              mipmapBlur
            />
          </EffectComposer>

          <Environment preset="night" />
        </Suspense>
      </Canvas>
    </div>
  )
}
