"use client"

interface ScrollProgressProps {
  progress: number
}

export default function ScrollProgress({ progress }: ScrollProgressProps) {
  return (
    <div className="fixed top-0 left-0 right-0 z-50 h-[2px] pointer-events-none">
      <div
        className="h-full origin-left will-change-transform"
        style={{
          transform: `scaleX(${progress})`,
          background: "linear-gradient(90deg, rgba(232,168,64,0.6) 0%, rgba(232,168,64,0.9) 50%, rgba(255,200,100,1) 100%)",
          boxShadow: "0 0 8px rgba(232,168,64,0.4), 0 0 20px rgba(232,168,64,0.15)",
        }}
      />
    </div>
  )
}
