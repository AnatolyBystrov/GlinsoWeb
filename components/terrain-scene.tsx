"use client"

import { useRef, useEffect, useState } from "react"
import * as THREE from "three"

interface TerrainSceneProps {
  scrollProgress: number
  mouseX: number
  mouseY: number
}

export default function TerrainScene({ scrollProgress, mouseX, mouseY }: TerrainSceneProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const stateRef = useRef({
    renderer: null as THREE.WebGLRenderer | null,
    scene: null as THREE.Scene | null,
    camera: null as THREE.PerspectiveCamera | null,
    terrain: null as THREE.Mesh | null,
    globe: null as THREE.Group | null,
    particles: null as THREE.Points | null,
    rings: [] as THREE.Line[],
    animId: 0,
    scroll: 0,
    mx: 0,
    my: 0,
    time: 0,
  })
  const [isMobile, setIsMobile] = useState(false)

  /* keep scroll/mouse in sync without re-creating the effect */
  useEffect(() => { stateRef.current.scroll = scrollProgress }, [scrollProgress])
  useEffect(() => { stateRef.current.mx = mouseX; stateRef.current.my = mouseY }, [mouseX, mouseY])

  useEffect(() => {
    const touch = window.innerWidth < 768 || "ontouchstart" in window
    setIsMobile(touch)
    if (touch) return
  }, [])

  useEffect(() => {
    if (isMobile) return
    const container = containerRef.current
    if (!container) return
    const S = stateRef.current

    /* ── Renderer ── */
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setSize(container.offsetWidth, container.offsetHeight)
    renderer.setClearColor(0x000000, 0)
    container.appendChild(renderer.domElement)
    S.renderer = renderer

    /* ── Scene + Fog ── */
    const scene = new THREE.Scene()
    scene.fog = new THREE.FogExp2(0x080c18, 0.06)
    S.scene = scene

    /* ── Camera ── */
    const camera = new THREE.PerspectiveCamera(55, container.offsetWidth / container.offsetHeight, 0.1, 200)
    camera.position.set(0, 3, 12)
    camera.lookAt(0, 1, 0)
    S.camera = camera

    /* ── Lights ── */
    scene.add(new THREE.AmbientLight(0x1a2040, 0.5))
    const dirLight = new THREE.DirectionalLight(0xe8a840, 0.6)
    dirLight.position.set(5, 10, 5)
    scene.add(dirLight)
    const pointLight = new THREE.PointLight(0xe8a840, 1.5, 30)
    pointLight.position.set(0, 5, 0)
    scene.add(pointLight)

    /* ── Terrain (mountain landscape like mont-fort) ── */
    const terrainGeo = new THREE.PlaneGeometry(60, 40, 200, 140)
    terrainGeo.rotateX(-Math.PI / 2)
    const posAttr = terrainGeo.getAttribute("position")
    const baseHeights = new Float32Array(posAttr.count)

    for (let i = 0; i < posAttr.count; i++) {
      const x = posAttr.getX(i)
      const z = posAttr.getZ(i)
      /* Multi-octave noise for mountain terrain */
      const h1 = Math.sin(x * 0.15) * Math.cos(z * 0.12) * 4
      const h2 = Math.sin(x * 0.4 + 1.3) * Math.cos(z * 0.35 + 0.7) * 1.5
      const h3 = Math.sin(x * 0.8 + 2.1) * Math.cos(z * 0.75 + 1.4) * 0.5
      /* Central peak */
      const distFromCenter = Math.sqrt(x * x + z * z)
      const peak = Math.max(0, 6 - distFromCenter * 0.35) * Math.exp(-distFromCenter * 0.04)
      const height = (h1 + h2 + h3 + peak) * 0.8
      baseHeights[i] = height
      posAttr.setY(i, height)
    }
    terrainGeo.computeVertexNormals()

    const terrainMat = new THREE.MeshStandardMaterial({
      color: 0x0d1a2f,
      metalness: 0.3,
      roughness: 0.85,
      wireframe: false,
      flatShading: true,
    })
    const terrain = new THREE.Mesh(terrainGeo, terrainMat)
    terrain.position.set(0, -3, -5)
    scene.add(terrain)
    S.terrain = terrain

    /* ── Wireframe overlay on terrain ── */
    const wireGeo = terrainGeo.clone()
    const wireMat = new THREE.MeshBasicMaterial({
      color: 0xe8a840,
      wireframe: true,
      transparent: true,
      opacity: 0.04,
    })
    const wire = new THREE.Mesh(wireGeo, wireMat)
    wire.position.copy(terrain.position)
    wire.position.y += 0.02
    scene.add(wire)

    /* ── Globe (wireframe icosphere) ── */
    const globeGroup = new THREE.Group()
    const sphereGeo = new THREE.IcosahedronGeometry(1.8, 4)
    const sphereWire = new THREE.MeshBasicMaterial({
      color: 0xe8a840,
      wireframe: true,
      transparent: true,
      opacity: 0.12,
    })
    const sphere = new THREE.Mesh(sphereGeo, sphereWire)
    globeGroup.add(sphere)

    /* Inner glow sphere */
    const innerGeo = new THREE.IcosahedronGeometry(1.6, 2)
    const innerMat = new THREE.MeshBasicMaterial({
      color: 0xe8a840,
      transparent: true,
      opacity: 0.03,
    })
    globeGroup.add(new THREE.Mesh(innerGeo, innerMat))

    /* Orbital rings */
    const ringRadii = [2.6, 3.2]
    const ringTilts = [0.3, -0.5]
    ringRadii.forEach((r, idx) => {
      const ringGeo = new THREE.BufferGeometry()
      const ringPts: number[] = []
      for (let i = 0; i <= 128; i++) {
        const a = (i / 128) * Math.PI * 2
        ringPts.push(Math.cos(a) * r, Math.sin(a) * r * 0.35, Math.sin(a) * r * 0.15)
      }
      ringGeo.setAttribute("position", new THREE.Float32BufferAttribute(ringPts, 3))
      const ringLine = new THREE.Line(
        ringGeo,
        new THREE.LineBasicMaterial({ color: 0xe8a840, transparent: true, opacity: 0.12 })
      )
      ringLine.rotation.x = ringTilts[idx]
      ringLine.rotation.z = idx * 0.4
      globeGroup.add(ringLine)
      S.rings.push(ringLine)
    })

    globeGroup.position.set(0, 4, 0)
    globeGroup.visible = false
    scene.add(globeGroup)
    S.globe = globeGroup

    /* ── Particles ── */
    const pCount = 300
    const pGeo = new THREE.BufferGeometry()
    const pPos = new Float32Array(pCount * 3)
    for (let i = 0; i < pCount; i++) {
      pPos[i * 3] = (Math.random() - 0.5) * 40
      pPos[i * 3 + 1] = Math.random() * 15
      pPos[i * 3 + 2] = (Math.random() - 0.5) * 30
    }
    pGeo.setAttribute("position", new THREE.Float32BufferAttribute(pPos, 3))
    const pMat = new THREE.PointsMaterial({
      color: 0xe8a840,
      size: 0.04,
      transparent: true,
      opacity: 0.35,
      sizeAttenuation: true,
    })
    const particles = new THREE.Points(pGeo, pMat)
    scene.add(particles)
    S.particles = particles

    /* ── Animate ── */
    const animate = () => {
      S.time += 0.008
      const t = S.time
      const sp = S.scroll

      /* ── Camera: scroll drives the journey ── */
      /* Start: high & far looking down at terrain
         Middle: come closer, terrain sinks, globe rises
         End: orbit around globe */
      const camY = 3 + sp * 5
      const camZ = 12 - sp * 8
      const lookY = 1 + sp * 3
      camera.position.x = S.mx * 1.2
      camera.position.y = camY + S.my * 0.5
      camera.position.z = camZ
      camera.lookAt(S.mx * 0.3, lookY, -2)

      /* ── Terrain: animate vertices with time + scroll ── */
      const tPos = terrainGeo.getAttribute("position")
      for (let i = 0; i < tPos.count; i++) {
        const x = tPos.getX(i)
        const z = tPos.getZ(i)
        const base = baseHeights[i]
        const wave = Math.sin(x * 0.2 + t * 0.8) * Math.cos(z * 0.15 + t * 0.6) * 0.3
        /* Terrain sinks as scroll increases (globe takes over) */
        const sinkFactor = 1 - sp * 0.5
        tPos.setY(i, (base + wave) * sinkFactor)
      }
      tPos.needsUpdate = true
      terrainGeo.computeVertexNormals()

      /* Terrain color shift: blue -> purple -> dark as scroll progresses */
      const r = 0.05 + sp * 0.08
      const g = 0.1 - sp * 0.04
      const b = 0.18 + sp * 0.12
      ;(terrain.material as THREE.MeshStandardMaterial).color.setRGB(r, g, b)

      /* Wireframe overlay fades in/out */
      ;(wire.material as THREE.MeshBasicMaterial).opacity = 0.04 + sp * 0.06

      /* ── Globe: appears from scroll 15%, fully visible by 40% ── */
      const globeFade = Math.min(1, Math.max(0, (sp - 0.15) / 0.25))
      globeGroup.visible = globeFade > 0.01
      if (globeGroup.visible) {
        /* Scale up as it appears */
        const s = globeFade * (0.6 + sp * 0.4)
        globeGroup.scale.setScalar(s)
        /* Globe rises from behind the terrain */
        globeGroup.position.y = -2 + globeFade * 6
        /* SCROLL drives the rotation */
        globeGroup.rotation.y = sp * Math.PI * 4
        globeGroup.rotation.x = Math.sin(t * 0.5) * 0.1 + S.my * 0.15
        /* Wireframe opacity pulses */
        ;(sphere.material as THREE.MeshBasicMaterial).opacity = 0.08 + Math.sin(t * 2) * 0.04

        /* Rings rotation driven by scroll */
        S.rings.forEach((ring, idx) => {
          ring.rotation.y = sp * Math.PI * 2 + idx * 1.2
        })
      }

      /* ── Particles drift upward ── */
      const pp = particles.geometry.getAttribute("position")
      for (let i = 0; i < pCount; i++) {
        let y = pp.getY(i) + 0.01
        if (y > 15) y = 0
        pp.setY(i, y)
        pp.setX(i, pp.getX(i) + Math.sin(t + i) * 0.002)
      }
      pp.needsUpdate = true
      ;(particles.material as THREE.PointsMaterial).opacity = 0.2 + sp * 0.15

      /* Fog density decreases as we scroll (reveals more) */
      ;(scene.fog as THREE.FogExp2).density = 0.06 - sp * 0.03

      renderer.render(scene, camera)
      S.animId = requestAnimationFrame(animate)
    }

    S.animId = requestAnimationFrame(animate)

    /* ── Resize ── */
    const onResize = () => {
      const w = container.offsetWidth
      const h = container.offsetHeight
      camera.aspect = w / h
      camera.updateProjectionMatrix()
      renderer.setSize(w, h)
    }
    window.addEventListener("resize", onResize)

    return () => {
      cancelAnimationFrame(S.animId)
      window.removeEventListener("resize", onResize)
      renderer.dispose()
      terrainGeo.dispose()
      terrainMat.dispose()
      wireGeo.dispose()
      wireMat.dispose()
      sphereGeo.dispose()
      sphereWire.dispose()
      innerGeo.dispose()
      innerMat.dispose()
      pGeo.dispose()
      pMat.dispose()
      container.removeChild(renderer.domElement)
    }
  }, [isMobile])

  if (isMobile) return null

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[1] pointer-events-none hidden md:block"
      aria-hidden="true"
    />
  )
}
