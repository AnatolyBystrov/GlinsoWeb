"use client"

import TerrainScene from "./terrain-scene"

export default function Scene3D(props: {
  scrollProgress: number
  mouseX: number
  mouseY: number
}) {
  return <TerrainScene {...props} />
}
