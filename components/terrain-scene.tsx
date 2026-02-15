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
    terrainBack: null as THREE.Mesh | null,
    globe: null as THREE.Group | null,
    sandParticles: null as THREE.Points | null,
    windParticles: null as THREE.Points | null,
    embers: null as THREE.Points | null,
    rings: [] as THREE.Line[],
    animId: 0,
    scroll: 0,
    mx: 0,
    my: 0,
    time: 0,
    baseHeights: null as Float32Array | null,
    backHeights: null as Float32Array | null,
  })
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => { stateRef.current.scroll = scrollProgress }, [scrollProgress])
  useEffect(() => { stateRef.current.mx = mouseX; stateRef.current.my = mouseY }, [mouseX, mouseY])

  useEffect(() => {
    const touch = window.innerWidth < 768 || "ontouchstart" in window
    setIsMobile(touch)
  }, [])

  useEffect(() => {
    if (isMobile) return
    const container = containerRef.current
    if (!container) return
    const S = stateRef.current

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setSize(container.offsetWidth, container.offsetHeight)
    renderer.setClearColor(0x000000, 0)
    container.appendChild(renderer.domElement)
    S.renderer = renderer

    const scene = new THREE.Scene()
    scene.fog = new THREE.FogExp2(0x1a120a, 0.035)
    S.scene = scene

    const camera = new THREE.PerspectiveCamera(55, container.offsetWidth / container.offsetHeight, 0.1, 200)
    camera.position.set(0, 4, 14)
    camera.lookAt(0, 1.5, 0)
    S.camera = camera

    /* ── Lights: warm desert sun ── */
    scene.add(new THREE.AmbientLight(0xd4a574, 0.4))
    const sunLight = new THREE.DirectionalLight(0xffd699, 1.0)
    sunLight.position.set(3, 12, 5)
    scene.add(sunLight)
    const rimLight = new THREE.DirectionalLight(0xff9933, 0.3)
    rimLight.position.set(-5, 3, -3)
    scene.add(rimLight)
    const skyLight = new THREE.HemisphereLight(0xffd699, 0x3d2b1f, 0.5)
    scene.add(skyLight)

    /* ── Helper: smooth dune noise ── */
    const duneNoise = (x: number, z: number): number => {
      /* Large sweeping barkhan shapes */
      const b1 = Math.sin(x * 0.08 + 0.5) * Math.cos(z * 0.06) * 5
      const b2 = Math.sin(x * 0.15 + 1.8) * Math.cos(z * 0.12 + 0.3) * 2.5
      /* Sharp ridges (barkhans have crescent ridges) */
      const ridge = Math.abs(Math.sin(x * 0.11 + z * 0.07 + 0.7)) * 2.5
      /* Small ripples (wind ripples on sand surface) */
      const ripple = Math.sin(x * 0.6 + 2.0) * Math.cos(z * 0.5 + 1.0) * 0.35
      /* Central dune ridge for dramatic silhouette */
      const dist = Math.sqrt(x * x + (z + 2) * (z + 2))
      const centralDune = Math.max(0, 7 - dist * 0.4) * Math.exp(-dist * 0.03)
      return (b1 + b2 + ridge + ripple + centralDune) * 0.6
    }

    /* ── Back dune layer (further, taller, forms the horizon) ── */
    const backGeo = new THREE.PlaneGeometry(80, 50, 160, 110)
    backGeo.rotateX(-Math.PI / 2)
    const backPos = backGeo.getAttribute("position")
    const backHeights = new Float32Array(backPos.count)
    for (let i = 0; i < backPos.count; i++) {
      const x = backPos.getX(i)
      const z = backPos.getZ(i)
      const h = duneNoise(x * 0.8 + 10, z * 0.8 + 5) * 1.3 + 1.5
      backHeights[i] = h
      backPos.setY(i, h)
    }
    backGeo.computeVertexNormals()
    S.backHeights = backHeights

    const backMat = new THREE.MeshStandardMaterial({
      color: 0x8b6914,
      metalness: 0.05,
      roughness: 0.95,
      flatShading: true,
    })
    const terrainBack = new THREE.Mesh(backGeo, backMat)
    terrainBack.position.set(0, -4, -12)
    scene.add(terrainBack)
    S.terrainBack = terrainBack

    /* ── Front dune layer (closer, creates silhouette over video) ── */
    const terrainGeo = new THREE.PlaneGeometry(70, 40, 180, 120)
    terrainGeo.rotateX(-Math.PI / 2)
    const posAttr = terrainGeo.getAttribute("position")
    const baseHeights = new Float32Array(posAttr.count)

    for (let i = 0; i < posAttr.count; i++) {
      const x = posAttr.getX(i)
      const z = posAttr.getZ(i)
      baseHeights[i] = duneNoise(x, z)
      posAttr.setY(i, baseHeights[i])
    }
    terrainGeo.computeVertexNormals()
    S.baseHeights = baseHeights

    const terrainMat = new THREE.MeshStandardMaterial({
      color: 0xc4952a,
      metalness: 0.05,
      roughness: 0.92,
      flatShading: true,
    })
    const terrain = new THREE.Mesh(terrainGeo, terrainMat)
    terrain.position.set(0, -4, -4)
    scene.add(terrain)
    S.terrain = terrain

    /* ── Sand ripple wireframe overlay ── */
    const wireGeo = terrainGeo.clone()
    const wireMat = new THREE.MeshBasicMaterial({
      color: 0xffd699,
      wireframe: true,
      transparent: true,
      opacity: 0.03,
    })
    const wire = new THREE.Mesh(wireGeo, wireMat)
    wire.position.copy(terrain.position)
    wire.position.y += 0.02
    scene.add(wire)

    /* ── Globe (wireframe icosphere -- rises from behind dunes) ── */
    const globeGroup = new THREE.Group()
    const sphereGeo = new THREE.IcosahedronGeometry(2.0, 4)
    const sphereWire = new THREE.MeshBasicMaterial({
      color: 0xe8a840,
      wireframe: true,
      transparent: true,
      opacity: 0.15,
    })
    globeGroup.add(new THREE.Mesh(sphereGeo, sphereWire))

    const innerGeo = new THREE.IcosahedronGeometry(1.7, 2)
    const innerMat = new THREE.MeshBasicMaterial({
      color: 0xe8a840,
      transparent: true,
      opacity: 0.04,
    })
    globeGroup.add(new THREE.Mesh(innerGeo, innerMat))

    /* Orbital rings */
    ;[2.8, 3.4].forEach((r, idx) => {
      const rGeo = new THREE.BufferGeometry()
      const pts: number[] = []
      for (let i = 0; i <= 128; i++) {
        const a = (i / 128) * Math.PI * 2
        pts.push(Math.cos(a) * r, Math.sin(a) * r * 0.35, Math.sin(a) * r * 0.15)
      }
      rGeo.setAttribute("position", new THREE.Float32BufferAttribute(pts, 3))
      const line = new THREE.Line(rGeo, new THREE.LineBasicMaterial({ color: 0xe8a840, transparent: true, opacity: 0.12 }))
      line.rotation.x = idx === 0 ? 0.3 : -0.5
      line.rotation.z = idx * 0.4
      globeGroup.add(line)
      S.rings.push(line)
    })

    globeGroup.position.set(0, -5, -2)
    globeGroup.visible = false
    scene.add(globeGroup)
    S.globe = globeGroup

    /* ── Floating sand particles (ambient) ── */
    const spCount = 200
    const spGeo = new THREE.BufferGeometry()
    const spPos = new Float32Array(spCount * 3)
    for (let i = 0; i < spCount; i++) {
      spPos[i * 3] = (Math.random() - 0.5) * 50
      spPos[i * 3 + 1] = Math.random() * 12
      spPos[i * 3 + 2] = (Math.random() - 0.5) * 30
    }
    spGeo.setAttribute("position", new THREE.Float32BufferAttribute(spPos, 3))
    const spMat = new THREE.PointsMaterial({
      color: 0xffd699,
      size: 0.04,
      transparent: true,
      opacity: 0.3,
      sizeAttenuation: true,
    })
    const sandParts = new THREE.Points(spGeo, spMat)
    scene.add(sandParts)
    S.sandParticles = sandParts

    /* ── Desert wind particles (horizontal, appear on scroll) ── */
    const wCount = 400
    const wGeo = new THREE.BufferGeometry()
    const wPos = new Float32Array(wCount * 3)
    for (let i = 0; i < wCount; i++) {
      wPos[i * 3] = (Math.random() - 0.5) * 60
      wPos[i * 3 + 1] = Math.random() * 8 - 1
      wPos[i * 3 + 2] = (Math.random() - 0.5) * 30
    }
    wGeo.setAttribute("position", new THREE.Float32BufferAttribute(wPos, 3))
    const wMat = new THREE.PointsMaterial({
      color: 0xd4a06a,
      size: 0.025,
      transparent: true,
      opacity: 0,
      sizeAttenuation: true,
    })
    const windParts = new THREE.Points(wGeo, wMat)
    scene.add(windParts)
    S.windParticles = windParts

    /* ── Ember particles (golden, near globe) ── */
    const eCount = 80
    const eGeo = new THREE.BufferGeometry()
    const ePos = new Float32Array(eCount * 3)
    for (let i = 0; i < eCount; i++) {
      ePos[i * 3] = (Math.random() - 0.5) * 6
      ePos[i * 3 + 1] = Math.random() * 8
      ePos[i * 3 + 2] = (Math.random() - 0.5) * 6
    }
    eGeo.setAttribute("position", new THREE.Float32BufferAttribute(ePos, 3))
    const eMat = new THREE.PointsMaterial({
      color: 0xe8a840,
      size: 0.06,
      transparent: true,
      opacity: 0,
      sizeAttenuation: true,
    })
    const embers = new THREE.Points(eGeo, eMat)
    scene.add(embers)
    S.embers = embers

    /* ── Animation loop ── */
    const animate = () => {
      S.time += 0.006
      const t = S.time
      const sp = S.scroll

      /* Camera journey: scroll drives everything */
      const camY = 4 - sp * 1.5
      const camZ = 14 - sp * 6
      const lookY = 1.5 + sp * 2
      camera.position.x = S.mx * 1.5
      camera.position.y = camY + S.my * 0.4
      camera.position.z = camZ
      camera.lookAt(S.mx * 0.2, lookY, -3)

      /* ── Dune animation: gentle wind-blown shifting ── */
      const tPos = terrainGeo.getAttribute("position")
      for (let i = 0; i < tPos.count; i++) {
        const x = tPos.getX(i)
        const z = tPos.getZ(i)
        const base = baseHeights[i]
        /* Wind ripples: move along surface */
        const windWave = Math.sin(x * 0.3 + t * 1.2) * Math.cos(z * 0.2 + t * 0.8) * 0.15
        /* Gentle breathing of the dunes */
        const breathe = Math.sin(t * 0.4 + x * 0.05) * 0.08
        const sinkFactor = 1 - sp * 0.3
        tPos.setY(i, (base + windWave + breathe) * sinkFactor)
      }
      tPos.needsUpdate = true
      terrainGeo.computeVertexNormals()

      /* Back dunes animate too */
      const bPos = backGeo.getAttribute("position")
      for (let i = 0; i < bPos.count; i++) {
        const x = bPos.getX(i)
        const z = bPos.getZ(i)
        const base = backHeights[i]
        const wave = Math.sin(x * 0.2 + t * 0.6) * 0.12
        bPos.setY(i, (base + wave) * (1 - sp * 0.2))
      }
      bPos.needsUpdate = true
      backGeo.computeVertexNormals()

      /* Dune color: smooth multi-stop transition through sections
         0.0 = warm golden sand (hero)
         0.3 = deep amber (divisions)
         0.6 = dusky copper-violet (ESG)
         1.0 = deep twilight blue-purple (footer) */
      const lerpC = (a: number, b: number, t: number) => a + (b - a) * t
      let fR: number, fG: number, fB: number
      let bR: number, bG: number, bB: number
      if (sp < 0.3) {
        const t = sp / 0.3
        fR = lerpC(0.77, 0.65, t); fG = lerpC(0.58, 0.42, t); fB = lerpC(0.16, 0.12, t)
        bR = lerpC(0.55, 0.45, t); bG = lerpC(0.41, 0.28, t); bB = lerpC(0.08, 0.08, t)
      } else if (sp < 0.6) {
        const t = (sp - 0.3) / 0.3
        fR = lerpC(0.65, 0.48, t); fG = lerpC(0.42, 0.28, t); fB = lerpC(0.12, 0.22, t)
        bR = lerpC(0.45, 0.32, t); bG = lerpC(0.28, 0.18, t); bB = lerpC(0.08, 0.18, t)
      } else {
        const t = (sp - 0.6) / 0.4
        fR = lerpC(0.48, 0.2, t); fG = lerpC(0.28, 0.14, t); fB = lerpC(0.22, 0.35, t)
        bR = lerpC(0.32, 0.12, t); bG = lerpC(0.18, 0.08, t); bB = lerpC(0.18, 0.28, t)
      }
      ;(terrain.material as THREE.MeshStandardMaterial).color.setRGB(fR, fG, fB)
      ;(terrainBack.material as THREE.MeshStandardMaterial).color.setRGB(bR, bG, bB)

      /* Wire overlay subtle shift */
      ;(wire.material as THREE.MeshBasicMaterial).opacity = 0.03 + sp * 0.04

      /* ── Globe: emerges from behind dunes ── */
      const globeFade = Math.min(1, Math.max(0, (sp - 0.15) / 0.25))
      globeGroup.visible = globeFade > 0.01
      if (globeGroup.visible) {
        const s = globeFade * (0.5 + sp * 0.5)
        globeGroup.scale.setScalar(s)
        globeGroup.position.y = -5 + globeFade * 7
        /* Scroll drives rotation */
        globeGroup.rotation.y = sp * Math.PI * 4
        globeGroup.rotation.x = Math.sin(t * 0.5) * 0.1 + S.my * 0.15
        ;(sphereWire as THREE.MeshBasicMaterial).opacity = 0.1 + Math.sin(t * 2) * 0.05
        S.rings.forEach((ring, idx) => {
          ring.rotation.y = sp * Math.PI * 2 + idx * 1.2
        })
      }

      /* ── Embers near globe ── */
      ;(eMat as THREE.PointsMaterial).opacity = globeFade * 0.5
      const ep = eGeo.getAttribute("position")
      for (let i = 0; i < eCount; i++) {
        let y = ep.getY(i) + 0.015
        if (y > 8) y = 0
        ep.setY(i, y)
        ep.setX(i, ep.getX(i) + Math.sin(t * 2 + i) * 0.003)
      }
      ep.needsUpdate = true

      /* ── Sand particles: ambient float ── */
      const spp = spGeo.getAttribute("position")
      for (let i = 0; i < spCount; i++) {
        let y = spp.getY(i) + 0.005
        if (y > 12) y = 0
        spp.setY(i, y)
        spp.setX(i, spp.getX(i) + Math.sin(t + i * 0.3) * 0.001)
      }
      spp.needsUpdate = true
      ;(spMat as THREE.PointsMaterial).opacity = 0.2 + sp * 0.1

      /* ── Desert wind: horizontal sand blowing (intensifies on scroll) ── */
      const windStrength = Math.min(1, sp * 2.5)
      ;(wMat as THREE.PointsMaterial).opacity = windStrength * 0.35
      const wp = wGeo.getAttribute("position")
      for (let i = 0; i < wCount; i++) {
        /* Move mostly horizontal (like wind) */
        let x = wp.getX(i) + (0.15 + windStrength * 0.3 + Math.sin(i * 0.7) * 0.05)
        const yOff = Math.sin(t * 3 + i * 0.5) * 0.01
        wp.setY(i, wp.getY(i) + yOff)
        /* Reset when going off-screen */
        if (x > 30) x = -30
        wp.setX(i, x)
        wp.setZ(i, wp.getZ(i) + Math.sin(t + i) * 0.005)
      }
      wp.needsUpdate = true

      /* Fog: transitions from warm haze to cool twilight */
      ;(scene.fog as THREE.FogExp2).density = 0.035 - sp * 0.012
      const fogR = lerpC(0.1, 0.04, sp)
      const fogG = lerpC(0.07, 0.02, sp)
      const fogB = lerpC(0.04, 0.08, sp)
      ;(scene.fog as THREE.FogExp2).color.setRGB(fogR, fogG, fogB)

      /* Light warmth shifts with scroll */
      sunLight.intensity = 1.0 - sp * 0.4
      rimLight.intensity = 0.3 + sp * 0.2

      renderer.render(scene, camera)
      S.animId = requestAnimationFrame(animate)
    }

    S.animId = requestAnimationFrame(animate)

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
      ;[terrainGeo, terrainMat, wireGeo, wireMat, backGeo, backMat,
        sphereGeo, sphereWire, innerGeo, innerMat,
        spGeo, spMat, wGeo, wMat, eGeo, eMat].forEach(d => d.dispose())
      if (container.contains(renderer.domElement)) container.removeChild(renderer.domElement)
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
