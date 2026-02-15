"use client"

import { useRef, useMemo, useEffect, useState } from "react"
import { Canvas, useFrame, useThree } from "@react-three/fiber"
import * as THREE from "three"

/* ── Glowing Sun ── */
function Sun({ scrollProgress }: { scrollProgress: number }) {
  const meshRef = useRef<THREE.Mesh>(null)
  const glowRef = useRef<THREE.Mesh>(null)
  const haloRef = useRef<THREE.Mesh>(null)

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    const pulse = 1 + Math.sin(t * 0.8) * 0.04
    if (meshRef.current) {
      meshRef.current.scale.setScalar(pulse)
    }
    if (glowRef.current) {
      glowRef.current.scale.setScalar(pulse * 1.6)
      const mat = glowRef.current.material as THREE.MeshBasicMaterial
      mat.opacity = 0.12 + Math.sin(t * 0.5) * 0.03
    }
    if (haloRef.current) {
      haloRef.current.scale.setScalar(pulse * 3.5)
      const mat = haloRef.current.material as THREE.MeshBasicMaterial
      mat.opacity = 0.04 + Math.sin(t * 0.3) * 0.01
    }
  })

  const yOffset = -scrollProgress * 4

  return (
    <group position={[0, 2.2 + yOffset, -8]}>
      {/* Outer halo */}
      <mesh ref={haloRef}>
        <sphereGeometry args={[1.2, 32, 32]} />
        <meshBasicMaterial color="#e8a840" transparent opacity={0.04} side={THREE.FrontSide} />
      </mesh>
      {/* Mid glow */}
      <mesh ref={glowRef}>
        <sphereGeometry args={[1.2, 32, 32]} />
        <meshBasicMaterial color="#f0c860" transparent opacity={0.12} />
      </mesh>
      {/* Core */}
      <mesh ref={meshRef}>
        <sphereGeometry args={[1.2, 64, 64]} />
        <meshBasicMaterial color="#f5d070" />
      </mesh>
      {/* Bright center */}
      <mesh scale={0.7}>
        <sphereGeometry args={[1.2, 32, 32]} />
        <meshBasicMaterial color="#fff5d0" transparent opacity={0.5} />
      </mesh>
      {/* Sun rays as a point light */}
      <pointLight color="#e8a840" intensity={8} distance={30} decay={2} />
      <pointLight color="#f0c860" intensity={3} distance={50} decay={1.5} />
    </group>
  )
}

/* ── Volumetric Rays ── */
function SunRays({ scrollProgress }: { scrollProgress: number }) {
  const groupRef = useRef<THREE.Group>(null)
  const raysCount = 16

  const rayData = useMemo(() => {
    return Array.from({ length: raysCount }, (_, i) => ({
      angle: (i / raysCount) * Math.PI * 2,
      length: 3 + Math.random() * 4,
      width: 0.03 + Math.random() * 0.05,
      speed: 0.02 + Math.random() * 0.03,
    }))
  }, [])

  useFrame(({ clock }) => {
    if (groupRef.current) {
      groupRef.current.rotation.z = clock.getElapsedTime() * 0.01
    }
  })

  const yOffset = -scrollProgress * 4

  return (
    <group ref={groupRef} position={[0, 2.2 + yOffset, -7.9]}>
      {rayData.map((ray, i) => (
        <mesh
          key={i}
          rotation={[0, 0, ray.angle]}
          position={[
            Math.cos(ray.angle) * (ray.length / 2 + 1.2),
            Math.sin(ray.angle) * (ray.length / 2 + 1.2),
            0,
          ]}
        >
          <planeGeometry args={[ray.length, ray.width]} />
          <meshBasicMaterial
            color="#f0c860"
            transparent
            opacity={0.06}
            side={THREE.DoubleSide}
            depthWrite={false}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
      ))}
    </group>
  )
}

/* ── Ocean Surface ── */
function Ocean({ scrollProgress }: { scrollProgress: number }) {
  const meshRef = useRef<THREE.Mesh>(null)
  const geoRef = useRef<THREE.PlaneGeometry>(null)

  const segments = 128
  const size = 40

  useFrame(({ clock }) => {
    if (!geoRef.current) return
    const t = clock.getElapsedTime()
    const pos = geoRef.current.attributes.position
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i)
      const z = pos.getZ(i)
      const y =
        Math.sin(x * 0.3 + t * 0.4) * 0.15 +
        Math.sin(z * 0.2 + t * 0.3) * 0.1 +
        Math.sin((x + z) * 0.15 + t * 0.5) * 0.08
      pos.setY(i, y)
    }
    pos.needsUpdate = true
    geoRef.current.computeVertexNormals()
  })

  const yOffset = -scrollProgress * 1

  return (
    <mesh
      ref={meshRef}
      rotation={[-Math.PI / 2, 0, 0]}
      position={[0, -1.2 + yOffset, -5]}
    >
      <planeGeometry ref={geoRef} args={[size, size, segments, segments]} />
      <meshStandardMaterial
        color="#0a1428"
        roughness={0.3}
        metalness={0.8}
        envMapIntensity={0.5}
        side={THREE.DoubleSide}
      />
    </mesh>
  )
}

/* ── Sun Reflection on Water ── */
function WaterReflection({ scrollProgress }: { scrollProgress: number }) {
  const meshRef = useRef<THREE.Mesh>(null)

  useFrame(({ clock }) => {
    if (meshRef.current) {
      const mat = meshRef.current.material as THREE.MeshBasicMaterial
      mat.opacity = 0.06 + Math.sin(clock.getElapsedTime() * 0.5) * 0.02
    }
  })

  const yOffset = -scrollProgress * 1

  return (
    <mesh
      ref={meshRef}
      rotation={[-Math.PI / 2, 0, 0]}
      position={[0, -1.15 + yOffset, -3]}
    >
      <planeGeometry args={[4, 20]} />
      <meshBasicMaterial
        color="#e8a840"
        transparent
        opacity={0.06}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </mesh>
  )
}

/* ── Tanker Ship ── */
function Ship({ scrollProgress }: { scrollProgress: number }) {
  const groupRef = useRef<THREE.Group>(null)
  const startX = useRef(-12)

  useFrame(({ clock }) => {
    if (!groupRef.current) return
    const t = clock.getElapsedTime()
    startX.current += 0.003
    if (startX.current > 14) startX.current = -14

    groupRef.current.position.x = startX.current
    groupRef.current.position.y = -1.0 + Math.sin(t * 0.5) * 0.06 - scrollProgress * 1
    groupRef.current.rotation.z = Math.sin(t * 0.4) * 0.015
  })

  return (
    <group ref={groupRef} position={[-12, -1.0, -3]} scale={0.12}>
      {/* Hull */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[8, 0.8, 2]} />
        <meshStandardMaterial color="#0f0f20" roughness={0.8} />
      </mesh>
      {/* Deck */}
      <mesh position={[0, 0.6, 0]}>
        <boxGeometry args={[6, 0.4, 1.6]} />
        <meshStandardMaterial color="#151530" roughness={0.7} />
      </mesh>
      {/* Bridge */}
      <mesh position={[1.5, 1.4, 0]}>
        <boxGeometry args={[1.5, 1.2, 1.2]} />
        <meshStandardMaterial color="#1a1a38" roughness={0.6} />
      </mesh>
      {/* Funnel */}
      <mesh position={[1.5, 2.2, 0]}>
        <boxGeometry args={[0.5, 0.6, 0.5]} />
        <meshStandardMaterial color="#1e1e40" roughness={0.7} />
      </mesh>
      {/* Funnel accent stripe */}
      <mesh position={[1.5, 2.55, 0]}>
        <boxGeometry args={[0.52, 0.1, 0.52]} />
        <meshBasicMaterial color="#e8a840" />
      </mesh>
      {/* Bridge windows */}
      {[-0.3, 0, 0.3].map((offset, i) => (
        <mesh key={i} position={[1.5, 1.5, offset * 1.3]}>
          <boxGeometry args={[0.02, 0.2, 0.2]} />
          <meshBasicMaterial color="#e8a840" transparent opacity={0.7} />
        </mesh>
      ))}
      {/* Bow */}
      <mesh position={[-4.2, 0.2, 0]}>
        <boxGeometry args={[0.8, 0.4, 1.2]} />
        <meshStandardMaterial color="#0f0f20" roughness={0.8} />
      </mesh>
    </group>
  )
}

/* ── Ambient Particles ── */
function Particles() {
  const pointsRef = useRef<THREE.Points>(null)
  const count = 120

  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 30
      arr[i * 3 + 1] = Math.random() * 8 - 1
      arr[i * 3 + 2] = (Math.random() - 0.5) * 20 - 5
    }
    return arr
  }, [])

  useFrame(({ clock }) => {
    if (!pointsRef.current) return
    const t = clock.getElapsedTime()
    const pos = pointsRef.current.geometry.attributes.position as THREE.BufferAttribute
    for (let i = 0; i < count; i++) {
      let y = pos.getY(i)
      y += 0.002 + Math.sin(t + i) * 0.001
      if (y > 7) y = -1
      pos.setY(i, y)
      const x = pos.getX(i)
      pos.setX(i, x + Math.sin(t * 0.3 + i * 0.5) * 0.001)
    }
    pos.needsUpdate = true
  })

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <float32BufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        color="#e8a840"
        size={0.04}
        transparent
        opacity={0.35}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  )
}

/* ── Camera Controller ── */
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
  const target = useRef({ x: 0, y: 1.5, z: 6 })

  useFrame(() => {
    const t = {
      x: mouseX * 0.5,
      y: 1.5 - scrollProgress * 2 + mouseY * 0.3,
      z: 6 + scrollProgress * 3,
    }
    target.current.x += (t.x - target.current.x) * 0.02
    target.current.y += (t.y - target.current.y) * 0.02
    target.current.z += (t.z - target.current.z) * 0.02

    camera.position.set(target.current.x, target.current.y, target.current.z)
    camera.lookAt(0, 0.5 - scrollProgress * 2, -5)
  })

  return null
}

/* ── Main Scene (exported as default) ── */
interface Scene3DProps {
  scrollProgress: number
  mouseX: number
  mouseY: number
}

export default function Scene3D({ scrollProgress, mouseX, mouseY }: Scene3DProps) {
  const [ready, setReady] = useState(false)

  useEffect(() => {
    setReady(true)
  }, [])

  if (!ready) return null

  return (
    <div
      className="fixed inset-0 z-0"
      style={{ pointerEvents: "none" }}
    >
      <Canvas
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: "high-performance",
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.2,
        }}
        camera={{ position: [0, 1.5, 6], fov: 55, near: 0.1, far: 100 }}
        style={{ background: "transparent" }}
        dpr={[1, 1.5]}
      >
        {/* Ambient / Fill lights */}
        <ambientLight intensity={0.15} color="#4a6080" />
        <directionalLight position={[0, 5, -5]} intensity={0.3} color="#e8c080" />

        {/* Scene objects */}
        <CameraController
          scrollProgress={scrollProgress}
          mouseX={mouseX}
          mouseY={mouseY}
        />
        <Sun scrollProgress={scrollProgress} />
        <SunRays scrollProgress={scrollProgress} />
        <Ocean scrollProgress={scrollProgress} />
        <WaterReflection scrollProgress={scrollProgress} />
        <Ship scrollProgress={scrollProgress} />
        <Particles />

        {/* Background fog */}
        <fog attach="fog" args={["#050a14", 8, 35]} />
      </Canvas>
    </div>
  )
}
