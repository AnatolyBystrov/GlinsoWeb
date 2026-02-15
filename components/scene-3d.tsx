"use client"

import { useRef, useEffect, useCallback } from "react"
import * as THREE from "three"
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js"
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js"
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js"

interface Scene3DProps {
  scrollProgress: number
  mouseX: number
  mouseY: number
}

/* ── Phoenix wing shape (line-based silhouette) ── */
function createPhoenixGeometry(): THREE.BufferGeometry {
  const points: THREE.Vector3[] = []

  // Body centerline
  for (let i = 0; i <= 40; i++) {
    const t = i / 40
    const x = (t - 0.5) * 0.6
    const y = Math.sin(t * Math.PI) * 0.15 + 0.1
    const z = 0
    points.push(new THREE.Vector3(x, y, z))
  }

  // Left wing - upper arc
  for (let i = 0; i <= 30; i++) {
    const t = i / 30
    const angle = t * Math.PI * 0.7 + Math.PI * 0.15
    const r = 0.5 + t * 1.2
    const x = -Math.cos(angle) * r * 0.6
    const y = Math.sin(angle) * r * 0.5 + 0.2
    const z = Math.sin(t * Math.PI) * 0.15
    points.push(new THREE.Vector3(x, y, z))
  }

  // Left wing - lower arc
  for (let i = 0; i <= 20; i++) {
    const t = i / 20
    const angle = t * Math.PI * 0.5 + Math.PI * 0.15
    const r = 0.3 + t * 0.9
    const x = -Math.cos(angle) * r * 0.55
    const y = Math.sin(angle) * r * 0.35 + 0.05
    const z = Math.sin(t * Math.PI) * 0.1
    points.push(new THREE.Vector3(x, y, z))
  }

  // Right wing - upper arc (mirror)
  for (let i = 0; i <= 30; i++) {
    const t = i / 30
    const angle = t * Math.PI * 0.7 + Math.PI * 0.15
    const r = 0.5 + t * 1.2
    const x = Math.cos(angle) * r * 0.6
    const y = Math.sin(angle) * r * 0.5 + 0.2
    const z = Math.sin(t * Math.PI) * 0.15
    points.push(new THREE.Vector3(x, y, z))
  }

  // Right wing - lower arc (mirror)
  for (let i = 0; i <= 20; i++) {
    const t = i / 20
    const angle = t * Math.PI * 0.5 + Math.PI * 0.15
    const r = 0.3 + t * 0.9
    const x = Math.cos(angle) * r * 0.55
    const y = Math.sin(angle) * r * 0.35 + 0.05
    const z = Math.sin(t * Math.PI) * 0.1
    points.push(new THREE.Vector3(x, y, z))
  }

  // Tail feathers
  for (let f = 0; f < 5; f++) {
    for (let i = 0; i <= 15; i++) {
      const t = i / 15
      const spread = (f - 2) * 0.08
      const x = -0.3 - t * 0.4 + spread * t
      const y = 0.05 - t * 0.3 + Math.sin(t * Math.PI) * 0.05
      const z = spread * t * 0.5
      points.push(new THREE.Vector3(x, y, z))
    }
  }

  // Head crest
  for (let i = 0; i <= 10; i++) {
    const t = i / 10
    const x = 0.3 + t * 0.12
    const y = 0.2 + t * 0.25
    const z = 0
    points.push(new THREE.Vector3(x, y, z))
  }

  const geometry = new THREE.BufferGeometry().setFromPoints(points)
  return geometry
}

/* ── Create particle phoenix (point cloud) ── */
function createPhoenixParticles(count: number): Float32Array {
  const positions = new Float32Array(count * 3)
  for (let i = 0; i < count; i++) {
    const t = Math.random()
    const wingChoice = Math.random()

    let x: number, y: number, z: number

    if (wingChoice < 0.35) {
      // Left wing
      const angle = t * Math.PI * 0.7 + Math.PI * 0.15
      const r = 0.4 + t * 1.3
      x = -Math.cos(angle) * r * 0.6 + (Math.random() - 0.5) * 0.08
      y = Math.sin(angle) * r * 0.5 + 0.2 + (Math.random() - 0.5) * 0.08
      z = Math.sin(t * Math.PI) * 0.15 + (Math.random() - 0.5) * 0.08
    } else if (wingChoice < 0.7) {
      // Right wing
      const angle = t * Math.PI * 0.7 + Math.PI * 0.15
      const r = 0.4 + t * 1.3
      x = Math.cos(angle) * r * 0.6 + (Math.random() - 0.5) * 0.08
      y = Math.sin(angle) * r * 0.5 + 0.2 + (Math.random() - 0.5) * 0.08
      z = Math.sin(t * Math.PI) * 0.15 + (Math.random() - 0.5) * 0.08
    } else if (wingChoice < 0.85) {
      // Body
      x = (t - 0.5) * 0.6 + (Math.random() - 0.5) * 0.05
      y = Math.sin(t * Math.PI) * 0.15 + 0.1 + (Math.random() - 0.5) * 0.05
      z = (Math.random() - 0.5) * 0.06
    } else {
      // Tail feathers
      const spread = (Math.random() - 0.5) * 0.3
      x = -0.3 - t * 0.5 + spread * t
      y = 0.05 - t * 0.35 + (Math.random() - 0.5) * 0.05
      z = spread * t * 0.4
    }

    positions[i * 3] = x
    positions[i * 3 + 1] = y
    positions[i * 3 + 2] = z
  }
  return positions
}

export default function Scene3D({ scrollProgress, mouseX, mouseY }: Scene3DProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const stateRef = useRef({
    scrollProgress: 0,
    mouseX: 0,
    mouseY: 0,
  })

  // Keep state ref in sync
  useEffect(() => {
    stateRef.current.scrollProgress = scrollProgress
    stateRef.current.mouseX = mouseX
    stateRef.current.mouseY = mouseY
  }, [scrollProgress, mouseX, mouseY])

  const initScene = useCallback((container: HTMLDivElement) => {
    // ── Renderer ──
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
    })
    renderer.setSize(container.clientWidth, container.clientHeight)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5))
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 1.2
    container.appendChild(renderer.domElement)

    // ── Scene & Camera ──
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(
      50,
      container.clientWidth / container.clientHeight,
      0.1,
      100
    )
    camera.position.set(0, 0.3, 7)

    // ── Post-processing (Bloom) ──
    const composer = new EffectComposer(renderer)
    const renderPass = new RenderPass(scene, camera)
    composer.addPass(renderPass)

    const bloomPass = new UnrealBloomPass(
      new THREE.Vector2(container.clientWidth, container.clientHeight),
      0.6,  // strength
      0.8,  // radius
      0.3   // threshold
    )
    composer.addPass(bloomPass)

    // ── Ambient light ──
    scene.add(new THREE.AmbientLight(0xa0b0c0, 0.15))

    // ── Globe (wireframe planet) ──
    const globeGroup = new THREE.Group()
    scene.add(globeGroup)

    // Inner glass sphere
    const innerSphere = new THREE.Mesh(
      new THREE.SphereGeometry(1.85, 48, 48),
      new THREE.MeshBasicMaterial({
        color: 0xc8a050,
        transparent: true,
        opacity: 0.04,
        side: THREE.BackSide,
      })
    )
    globeGroup.add(innerSphere)

    // Primary wireframe
    const wireframe = new THREE.Mesh(
      new THREE.SphereGeometry(1.9, 32, 24),
      new THREE.MeshBasicMaterial({
        color: 0xc8a050,
        wireframe: true,
        transparent: true,
        opacity: 0.15,
      })
    )
    globeGroup.add(wireframe)

    // Secondary finer wireframe
    const wireframe2 = new THREE.Mesh(
      new THREE.SphereGeometry(1.92, 48, 36),
      new THREE.MeshBasicMaterial({
        color: 0xd4b060,
        wireframe: true,
        transparent: true,
        opacity: 0.05,
      })
    )
    globeGroup.add(wireframe2)

    // ── Orbital rings ──
    const rings = [
      { radius: 2.6, thickness: 0.008, opacity: 0.25 },
      { radius: 2.9, thickness: 0.006, opacity: 0.18 },
      { radius: 3.3, thickness: 0.005, opacity: 0.1 },
    ]
    const ringMeshes: THREE.Mesh[] = []
    rings.forEach((r) => {
      const ring = new THREE.Mesh(
        new THREE.TorusGeometry(r.radius, r.thickness, 8, 120),
        new THREE.MeshBasicMaterial({
          color: 0xc8a050,
          transparent: true,
          opacity: r.opacity,
        })
      )
      ringMeshes.push(ring)
      globeGroup.add(ring)
    })

    // ── Orbit dot particles ──
    const dotData = [
      { radius: 2.6, speed: 0.3, size: 0.04 },
      { radius: 2.6, speed: 0.22, size: 0.03 },
      { radius: 2.9, speed: -0.18, size: 0.035 },
      { radius: 2.9, speed: -0.14, size: 0.025 },
      { radius: 3.3, speed: 0.15, size: 0.03 },
    ]
    const dots: THREE.Mesh[] = []
    dotData.forEach((d) => {
      const dot = new THREE.Mesh(
        new THREE.SphereGeometry(d.size, 10, 10),
        new THREE.MeshBasicMaterial({
          color: 0xe8c060,
          transparent: true,
          opacity: 0.8,
        })
      )
      globeGroup.add(dot)
      dots.push(dot)
    })

    // ── Central glow point ──
    const pointLight = new THREE.PointLight(0xd4a840, 2.5, 14, 2)
    globeGroup.add(pointLight)

    // ── Phoenix - line silhouette ──
    const phoenixGroup = new THREE.Group()
    phoenixGroup.scale.set(1.6, 1.6, 1.6)
    phoenixGroup.position.set(0, 0.15, 0)
    globeGroup.add(phoenixGroup)

    const phoenixLineGeo = createPhoenixGeometry()
    const phoenixLine = new THREE.Points(
      phoenixLineGeo,
      new THREE.PointsMaterial({
        color: 0xf0c050,
        size: 0.025,
        transparent: true,
        opacity: 0.7,
        sizeAttenuation: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      })
    )
    phoenixGroup.add(phoenixLine)

    // Phoenix particle cloud (denser)
    const phoenixParticleCount = 600
    const phoenixPositions = createPhoenixParticles(phoenixParticleCount)
    const phoenixParticleGeo = new THREE.BufferGeometry()
    phoenixParticleGeo.setAttribute(
      "position",
      new THREE.Float32BufferAttribute(phoenixPositions, 3)
    )
    const phoenixParticles = new THREE.Points(
      phoenixParticleGeo,
      new THREE.PointsMaterial({
        color: 0xe8a840,
        size: 0.018,
        transparent: true,
        opacity: 0.45,
        sizeAttenuation: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      })
    )
    phoenixGroup.add(phoenixParticles)

    // ── Ambient floating particles ──
    const ambientCount = 250
    const ambientPositions = new Float32Array(ambientCount * 3)
    for (let i = 0; i < ambientCount; i++) {
      ambientPositions[i * 3] = (Math.random() - 0.5) * 25
      ambientPositions[i * 3 + 1] = (Math.random() - 0.5) * 16
      ambientPositions[i * 3 + 2] = (Math.random() - 0.5) * 20 - 3
    }
    const ambientGeo = new THREE.BufferGeometry()
    ambientGeo.setAttribute(
      "position",
      new THREE.Float32BufferAttribute(ambientPositions, 3)
    )
    const ambientParticles = new THREE.Points(
      ambientGeo,
      new THREE.PointsMaterial({
        color: 0xd4a840,
        size: 0.022,
        transparent: true,
        opacity: 0.2,
        sizeAttenuation: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      })
    )
    scene.add(ambientParticles)

    // ── Camera target for smooth interpolation ──
    const cameraTarget = { x: 0, y: 0.3, z: 7 }

    // ── Animation loop ──
    const clock = new THREE.Clock()
    let animId: number

    function animate() {
      animId = requestAnimationFrame(animate)
      const t = clock.getElapsedTime()
      const s = stateRef.current

      // Globe rotation
      globeGroup.rotation.y = t * 0.06
      globeGroup.rotation.x = Math.sin(t * 0.04) * 0.08

      // Wireframe inner rotation
      wireframe.rotation.y = t * 0.1

      // Breathing glow
      const breathe = 0.04 + Math.sin(t * 0.35) * 0.015
      ;(innerSphere.material as THREE.MeshBasicMaterial).opacity = breathe

      // Orbital ring tilts
      ringMeshes[0].rotation.x = Math.PI / 2 + Math.sin(t * 0.18) * 0.08
      ringMeshes[0].rotation.z = t * 0.04
      ringMeshes[1].rotation.x = Math.PI / 3 + Math.cos(t * 0.13) * 0.08
      ringMeshes[1].rotation.z = -t * 0.035
      ringMeshes[2].rotation.x = Math.PI / 4.5 + Math.sin(t * 0.1) * 0.12
      ringMeshes[2].rotation.z = t * 0.025

      // Orbit dots
      dots.forEach((dot, i) => {
        const d = dotData[i]
        const angle = t * d.speed + i * 1.3
        const ringIdx = i < 2 ? 0 : i < 4 ? 1 : 2
        const tiltX = ringMeshes[ringIdx].rotation.x
        const cx = Math.cos(angle) * d.radius
        const cz = Math.sin(angle) * d.radius
        const cosT = Math.cos(tiltX)
        const sinT = Math.sin(tiltX)
        dot.position.set(cx, cz * sinT, cz * cosT)
      })

      // Phoenix breathing / floating
      phoenixGroup.position.y = 0.15 + Math.sin(t * 0.5) * 0.06
      phoenixGroup.rotation.y = Math.sin(t * 0.25) * 0.15

      // Animate phoenix particles shimmer
      const pPos = phoenixParticleGeo.attributes.position as THREE.BufferAttribute
      for (let i = 0; i < phoenixParticleCount; i++) {
        const baseY = phoenixPositions[i * 3 + 1]
        pPos.setY(i, baseY + Math.sin(t * 1.5 + i * 0.3) * 0.008)
      }
      pPos.needsUpdate = true

      // Ambient particles drift
      const aPos = ambientGeo.attributes.position as THREE.BufferAttribute
      for (let i = 0; i < ambientCount; i++) {
        let y = aPos.getY(i)
        y += 0.001 + Math.sin(t * 0.4 + i) * 0.0004
        if (y > 8) y = -8
        aPos.setY(i, y)
      }
      aPos.needsUpdate = true

      // Globe scroll offset
      const scrollYOff = -s.scrollProgress * 3
      globeGroup.position.y = 0.3 + scrollYOff

      // Camera smooth follow
      const tgtX = s.mouseX * 0.35
      const tgtY = 0.3 - s.scrollProgress * 1.2 + s.mouseY * 0.15
      const tgtZ = 7 + s.scrollProgress * 4
      cameraTarget.x += (tgtX - cameraTarget.x) * 0.02
      cameraTarget.y += (tgtY - cameraTarget.y) * 0.02
      cameraTarget.z += (tgtZ - cameraTarget.z) * 0.02
      camera.position.set(cameraTarget.x, cameraTarget.y, cameraTarget.z)
      camera.lookAt(0, scrollYOff, 0)

      // Bloom breathing
      bloomPass.strength = 0.5 + Math.sin(t * 0.3) * 0.15

      composer.render()
    }

    animate()

    // ── Resize ──
    function onResize() {
      const w = container.clientWidth
      const h = container.clientHeight
      camera.aspect = w / h
      camera.updateProjectionMatrix()
      renderer.setSize(w, h)
      composer.setSize(w, h)
    }
    window.addEventListener("resize", onResize)

    // ── Cleanup ──
    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener("resize", onResize)
      renderer.dispose()
      composer.dispose()
      container.removeChild(renderer.domElement)
    }
  }, [])

  useEffect(() => {
    const container = containerRef.current
    if (!container) return
    const cleanup = initScene(container)
    return cleanup
  }, [initScene])

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[1]"
      style={{ pointerEvents: "none" }}
    />
  )
}
