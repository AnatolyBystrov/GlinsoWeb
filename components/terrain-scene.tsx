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
    sandParticles: null as THREE.Points | null,
    windParticles: null as THREE.Points | null,
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
    setIsMobile(window.innerWidth < 768 || "ontouchstart" in window)
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
    scene.fog = new THREE.FogExp2(0x1a120a, 0.025)
    S.scene = scene

    const camera = new THREE.PerspectiveCamera(50, container.offsetWidth / container.offsetHeight, 0.1, 200)
    camera.position.set(0, 3, 12)
    camera.lookAt(0, 0.5, 0)
    S.camera = camera

    /* Warm desert lighting */
    scene.add(new THREE.AmbientLight(0xd4a574, 0.3))
    const sunLight = new THREE.DirectionalLight(0xffd699, 0.9)
    sunLight.position.set(3, 10, 5)
    scene.add(sunLight)
    const rimLight = new THREE.DirectionalLight(0xff9933, 0.2)
    rimLight.position.set(-5, 3, -3)
    scene.add(rimLight)
    scene.add(new THREE.HemisphereLight(0xffd699, 0x3d2b1f, 0.35))

    /* Dune noise function */
    const duneNoise = (x: number, z: number): number => {
      const b1 = Math.sin(x * 0.09 + 0.5) * Math.cos(z * 0.06) * 4.5
      const b2 = Math.sin(x * 0.16 + 1.8) * Math.cos(z * 0.12 + 0.3) * 2.2
      const ridge = Math.abs(Math.sin(x * 0.11 + z * 0.07 + 0.7)) * 2.0
      const ripple = Math.sin(x * 0.65 + 2.0) * Math.cos(z * 0.5 + 1.0) * 0.25
      const dist = Math.sqrt(x * x + (z + 2) * (z + 2))
      const central = Math.max(0, 6 - dist * 0.35) * Math.exp(-dist * 0.025)
      return (b1 + b2 + ridge + ripple + central) * 0.55
    }

    /* Back dunes (horizon silhouette) -- positioned lower to let video show above */
    const backGeo = new THREE.PlaneGeometry(90, 50, 160, 100)
    backGeo.rotateX(-Math.PI / 2)
    const backPos = backGeo.getAttribute("position")
    const backHeights = new Float32Array(backPos.count)
    for (let i = 0; i < backPos.count; i++) {
      const x = backPos.getX(i)
      const z = backPos.getZ(i)
      const h = duneNoise(x * 0.7 + 10, z * 0.7 + 5) * 1.1 + 0.5
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
    terrainBack.position.set(0, -5, -14)
    scene.add(terrainBack)
    S.terrainBack = terrainBack

    /* Front dunes (foreground, frames the bottom of screen) */
    const frontGeo = new THREE.PlaneGeometry(80, 40, 180, 120)
    frontGeo.rotateX(-Math.PI / 2)
    const frontPos = frontGeo.getAttribute("position")
    const baseHeights = new Float32Array(frontPos.count)
    for (let i = 0; i < frontPos.count; i++) {
      const x = frontPos.getX(i)
      const z = frontPos.getZ(i)
      baseHeights[i] = duneNoise(x, z)
      frontPos.setY(i, baseHeights[i])
    }
    frontGeo.computeVertexNormals()
    S.baseHeights = baseHeights

    const frontMat = new THREE.MeshStandardMaterial({
      color: 0xc4952a,
      metalness: 0.05,
      roughness: 0.92,
      flatShading: true,
    })
    const terrain = new THREE.Mesh(frontGeo, frontMat)
    terrain.position.set(0, -4.5, -3)
    scene.add(terrain)
    S.terrain = terrain

    /* Sand particles */
    const spCount = 150
    const spGeo = new THREE.BufferGeometry()
    const spArr = new Float32Array(spCount * 3)
    for (let i = 0; i < spCount; i++) {
      spArr[i * 3] = (Math.random() - 0.5) * 50
      spArr[i * 3 + 1] = Math.random() * 10
      spArr[i * 3 + 2] = (Math.random() - 0.5) * 30
    }
    spGeo.setAttribute("position", new THREE.Float32BufferAttribute(spArr, 3))
    const spMat = new THREE.PointsMaterial({ color: 0xffd699, size: 0.035, transparent: true, opacity: 0.25, sizeAttenuation: true })
    const sandParts = new THREE.Points(spGeo, spMat)
    scene.add(sandParts)
    S.sandParticles = sandParts

    /* Wind particles */
    const wCount = 300
    const wGeo = new THREE.BufferGeometry()
    const wArr = new Float32Array(wCount * 3)
    for (let i = 0; i < wCount; i++) {
      wArr[i * 3] = (Math.random() - 0.5) * 60
      wArr[i * 3 + 1] = Math.random() * 7 - 1
      wArr[i * 3 + 2] = (Math.random() - 0.5) * 30
    }
    wGeo.setAttribute("position", new THREE.Float32BufferAttribute(wArr, 3))
    const wMat = new THREE.PointsMaterial({ color: 0xd4a06a, size: 0.02, transparent: true, opacity: 0, sizeAttenuation: true })
    const windParts = new THREE.Points(wGeo, wMat)
    scene.add(windParts)
    S.windParticles = windParts

    /* Animation */
    const animate = () => {
      S.time += 0.005
      const t = S.time
      const sp = S.scroll

      /* Camera -- scroll moves us closer and lower into the dunes */
      camera.position.x = S.mx * 1.2
      camera.position.y = 3 - sp * 2.5 + S.my * 0.3
      camera.position.z = 12 - sp * 5
      camera.lookAt(S.mx * 0.15, 0.5 + sp * 1.5, -4)

      /* Animate front dune vertices -- wind ripples */
      const fPos = frontGeo.getAttribute("position")
      for (let i = 0; i < fPos.count; i++) {
        const x = fPos.getX(i)
        const z = fPos.getZ(i)
        const base = baseHeights[i]
        const wave = Math.sin(x * 0.3 + t * 1.0) * Math.cos(z * 0.2 + t * 0.7) * 0.12
        const breathe = Math.sin(t * 0.35 + x * 0.04) * 0.06
        fPos.setY(i, (base + wave + breathe) * (1 - sp * 0.25))
      }
      fPos.needsUpdate = true
      frontGeo.computeVertexNormals()

      /* Back dunes animate slower */
      const bPos = backGeo.getAttribute("position")
      for (let i = 0; i < bPos.count; i++) {
        const x = bPos.getX(i)
        const base = backHeights[i]
        const wave = Math.sin(x * 0.18 + t * 0.5) * 0.1
        bPos.setY(i, (base + wave) * (1 - sp * 0.15))
      }
      bPos.needsUpdate = true
      backGeo.computeVertexNormals()

      /* Color transitions: warm gold -> amber -> dusky -> twilight */
      const lerpC = (a: number, b: number, v: number) => a + (b - a) * v
      let fR: number, fG: number, fB: number
      let bR: number, bG: number, bB: number
      if (sp < 0.3) {
        const v = sp / 0.3
        fR = lerpC(0.77, 0.65, v); fG = lerpC(0.58, 0.42, v); fB = lerpC(0.16, 0.12, v)
        bR = lerpC(0.55, 0.45, v); bG = lerpC(0.41, 0.28, v); bB = lerpC(0.08, 0.08, v)
      } else if (sp < 0.6) {
        const v = (sp - 0.3) / 0.3
        fR = lerpC(0.65, 0.48, v); fG = lerpC(0.42, 0.28, v); fB = lerpC(0.12, 0.22, v)
        bR = lerpC(0.45, 0.32, v); bG = lerpC(0.28, 0.18, v); bB = lerpC(0.08, 0.18, v)
      } else {
        const v = (sp - 0.6) / 0.4
        fR = lerpC(0.48, 0.22, v); fG = lerpC(0.28, 0.15, v); fB = lerpC(0.22, 0.32, v)
        bR = lerpC(0.32, 0.14, v); bG = lerpC(0.18, 0.09, v); bB = lerpC(0.18, 0.25, v)
      }
      ;(terrain.material as THREE.MeshStandardMaterial).color.setRGB(fR, fG, fB)
      ;(terrainBack.material as THREE.MeshStandardMaterial).color.setRGB(bR, bG, bB)

      /* Sand particles float upward */
      const spp = spGeo.getAttribute("position")
      for (let i = 0; i < spCount; i++) {
        let y = spp.getY(i) + 0.004
        if (y > 10) y = 0
        spp.setY(i, y)
        spp.setX(i, spp.getX(i) + Math.sin(t + i * 0.3) * 0.001)
      }
      spp.needsUpdate = true

      /* Wind particles: intensity tied to scroll */
      const windStrength = Math.min(1, sp * 2.5)
      ;(wMat as THREE.PointsMaterial).opacity = windStrength * 0.3
      const wp = wGeo.getAttribute("position")
      for (let i = 0; i < wCount; i++) {
        let x = wp.getX(i) + (0.12 + windStrength * 0.25 + Math.sin(i * 0.7) * 0.04)
        if (x > 30) x = -30
        wp.setX(i, x)
        wp.setY(i, wp.getY(i) + Math.sin(t * 3 + i * 0.5) * 0.008)
      }
      wp.needsUpdate = true

      /* Fog */
      const fog = scene.fog as THREE.FogExp2
      fog.density = 0.025 - sp * 0.008
      fog.color.setRGB(lerpC(0.1, 0.05, sp), lerpC(0.07, 0.03, sp), lerpC(0.04, 0.07, sp))

      sunLight.intensity = 0.9 - sp * 0.35
      rimLight.intensity = 0.2 + sp * 0.15

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
      ;[frontGeo, frontMat, backGeo, backMat, spGeo, spMat, wGeo, wMat].forEach(d => d.dispose())
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
