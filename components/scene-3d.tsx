"use client"

import { useRef, useMemo, useEffect, useState } from "react"
import { Canvas, useFrame, useThree } from "@react-three/fiber"
import * as THREE from "three"

/* ── Wireframe Planet / Globe ── */
function Planet({ scrollProgress }: { scrollProgress: number }) {
  const groupRef = useRef<THREE.Group>(null)
  const wireRef = useRef<THREE.Mesh>(null)
  const innerRef = useRef<THREE.Mesh>(null)
  const ringRef1 = useRef<THREE.Mesh>(null)
  const ringRef2 = useRef<THREE.Mesh>(null)
  const ringRef3 = useRef<THREE.Mesh>(null)

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    if (groupRef.current) {
      groupRef.current.rotation.y = t * 0.08
      groupRef.current.rotation.x = Math.sin(t * 0.05) * 0.1
    }
    if (wireRef.current) {
      wireRef.current.rotation.y = t * 0.12
    }
    if (innerRef.current) {
      const mat = innerRef.current.material as THREE.MeshBasicMaterial
      mat.opacity = 0.06 + Math.sin(t * 0.4) * 0.02
    }
    if (ringRef1.current) {
      ringRef1.current.rotation.x = Math.PI / 2 + Math.sin(t * 0.2) * 0.1
      ringRef1.current.rotation.z = t * 0.05
    }
    if (ringRef2.current) {
      ringRef2.current.rotation.x = Math.PI / 3 + Math.cos(t * 0.15) * 0.1
      ringRef2.current.rotation.z = -t * 0.04
    }
    if (ringRef3.current) {
      ringRef3.current.rotation.x = Math.PI / 4.5 + Math.sin(t * 0.12) * 0.15
      ringRef3.current.rotation.z = t * 0.03
    }
  })

  const yOffset = -scrollProgress * 3

  return (
    <group ref={groupRef} position={[0, 0.3 + yOffset, 0]}>
      {/* Inner filled sphere - subtle dark glass */}
      <mesh ref={innerRef}>
        <sphereGeometry args={[1.85, 48, 48]} />
        <meshBasicMaterial
          color="#c8a050"
          transparent
          opacity={0.06}
          side={THREE.BackSide}
        />
      </mesh>

      {/* Wireframe globe */}
      <mesh ref={wireRef}>
        <sphereGeometry args={[1.9, 32, 24]} />
        <meshBasicMaterial
          color="#c8a050"
          wireframe
          transparent
          opacity={0.18}
        />
      </mesh>

      {/* Second wireframe, finer grid, slightly larger */}
      <mesh>
        <sphereGeometry args={[1.92, 48, 36]} />
        <meshBasicMaterial
          color="#d4b060"
          wireframe
          transparent
          opacity={0.06}
        />
      </mesh>

      {/* Orbital rings */}
      <mesh ref={ringRef1}>
        <torusGeometry args={[2.6, 0.008, 8, 120]} />
        <meshBasicMaterial color="#c8a050" transparent opacity={0.3} />
      </mesh>
      <mesh ref={ringRef2}>
        <torusGeometry args={[2.9, 0.006, 8, 120]} />
        <meshBasicMaterial color="#c8a050" transparent opacity={0.2} />
      </mesh>
      <mesh ref={ringRef3}>
        <torusGeometry args={[3.3, 0.005, 8, 120]} />
        <meshBasicMaterial color="#c8a050" transparent opacity={0.12} />
      </mesh>

      {/* Central glow point */}
      <pointLight color="#d4a840" intensity={2} distance={12} decay={2} />
    </group>
  )
}

/* ── Small orbit dots that travel along the rings ── */
function OrbitDots({ scrollProgress }: { scrollProgress: number }) {
  const dotsRef = useRef<THREE.Group>(null)

  const dots = useMemo(() => {
    return [
      { radius: 2.6, speed: 0.3, size: 0.04, tiltX: Math.PI / 2, tiltZ: 0 },
      { radius: 2.6, speed: 0.25, size: 0.03, tiltX: Math.PI / 2, tiltZ: 0 },
      { radius: 2.9, speed: -0.2, size: 0.035, tiltX: Math.PI / 3, tiltZ: 0 },
      { radius: 2.9, speed: -0.15, size: 0.03, tiltX: Math.PI / 3, tiltZ: 0 },
      { radius: 3.3, speed: 0.18, size: 0.03, tiltX: Math.PI / 4.5, tiltZ: 0 },
    ]
  }, [])

  useFrame(({ clock }) => {
    if (!dotsRef.current) return
    const t = clock.getElapsedTime()
    dotsRef.current.children.forEach((child, i) => {
      const dot = dots[i]
      const angle = t * dot.speed + i * 1.5
      const x = Math.cos(angle) * dot.radius
      const z = Math.sin(angle) * dot.radius
      // Apply tilt rotation
      const cosT = Math.cos(dot.tiltX)
      const sinT = Math.sin(dot.tiltX)
      child.position.set(x, z * sinT, z * cosT)
    })
  })

  const yOffset = -scrollProgress * 3

  return (
    <group ref={dotsRef} position={[0, 0.3 + yOffset, 0]}>
      {dots.map((dot, i) => (
        <mesh key={i}>
          <sphereGeometry args={[dot.size, 12, 12]} />
          <meshBasicMaterial color="#e8c060" transparent opacity={0.8} />
        </mesh>
      ))}
    </group>
  )
}

/* ── Ambient Particles ── */
function Particles() {
  const pointsRef = useRef<THREE.Points>(null)
  const count = 200

  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 25
      arr[i * 3 + 1] = (Math.random() - 0.5) * 16
      arr[i * 3 + 2] = (Math.random() - 0.5) * 20 - 3
    }
    return arr
  }, [])

  useFrame(({ clock }) => {
    if (!pointsRef.current) return
    const t = clock.getElapsedTime()
    const pos = pointsRef.current.geometry.attributes.position as THREE.BufferAttribute
    for (let i = 0; i < count; i++) {
      let y = pos.getY(i)
      y += 0.001 + Math.sin(t * 0.5 + i) * 0.0005
      if (y > 8) y = -8
      pos.setY(i, y)
    }
    pos.needsUpdate = true
  })

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <float32BufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        color="#d4a840"
        size={0.025}
        transparent
        opacity={0.25}
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
  const target = useRef({ x: 0, y: 0.5, z: 7 })

  useFrame(() => {
    const t = {
      x: mouseX * 0.4,
      y: 0.5 - scrollProgress * 1.5 + mouseY * 0.2,
      z: 7 + scrollProgress * 4,
    }
    target.current.x += (t.x - target.current.x) * 0.02
    target.current.y += (t.y - target.current.y) * 0.02
    target.current.z += (t.z - target.current.z) * 0.02

    camera.position.set(target.current.x, target.current.y, target.current.z)
    camera.lookAt(0, 0 - scrollProgress * 2, 0)
  })

  return null
}

/* ── Main Scene ── */
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
    <div className="fixed inset-0 z-[1]" style={{ pointerEvents: "none" }}>
      <Canvas
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: "high-performance",
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.0,
        }}
        camera={{ position: [0, 0.5, 7], fov: 50, near: 0.1, far: 100 }}
        style={{ background: "transparent" }}
        dpr={[1, 1.5]}
      >
        <ambientLight intensity={0.08} color="#a0b0c0" />

        <CameraController
          scrollProgress={scrollProgress}
          mouseX={mouseX}
          mouseY={mouseY}
        />
        <Planet scrollProgress={scrollProgress} />
        <OrbitDots scrollProgress={scrollProgress} />
        <Particles />
      </Canvas>
    </div>
  )
}
