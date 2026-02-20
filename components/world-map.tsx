"use client"

import { motion } from "framer-motion"
import dynamic from "next/dynamic"

const WorldMap = dynamic(() => import("react-svg-worldmap"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-64 flex items-center justify-center">
      <div className="text-sm text-muted-foreground">Loading map...</div>
    </div>
  )
})

interface WorldMapComponentProps {
  visible: boolean
}

export default function WorldMapComponent({ visible }: WorldMapComponentProps) {
  // Regional statistics
  const regions = [
    { name: "North America", percent: "25%", desc: "Leading insurance markets" },
    { name: "Europe", percent: "22%", desc: "Lloyd's & continental markets" },
    { name: "Middle East", percent: "14%", desc: "Regional hub operations" },
    { name: "Asia Pacific", percent: "18%", desc: "Growth markets access" },
    { name: "Latin America", percent: "15%", desc: "Emerging markets" },
    { name: "Africa", percent: "6%", desc: "Frontier markets" },
  ]

  // Data for the map - country codes with values for highlighting
  const data = [
    // North America
    { country: "us", value: 1 },
    { country: "ca", value: 1 },
    // Europe
    { country: "gb", value: 1 },
    { country: "de", value: 1 },
    { country: "fr", value: 1 },
    { country: "ch", value: 1 },
    { country: "it", value: 1 },
    { country: "es", value: 1 },
    // Middle East
    { country: "ae", value: 2 }, // UAE - HQ
    { country: "sa", value: 1 },
    { country: "qa", value: 1 },
    // Asia Pacific
    { country: "sg", value: 1 },
    { country: "hk", value: 1 },
    { country: "jp", value: 1 },
    { country: "au", value: 1 },
    // Latin America
    { country: "br", value: 1 },
    { country: "mx", value: 1 },
    { country: "ar", value: 1 },
    // Africa
    { country: "za", value: 1 },
  ]

  return (
    <div className="w-full">
      {/* Map Container */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={visible ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
        className="relative mb-12"
      >
        <div className="relative rounded-xl overflow-hidden bg-white shadow-lg border border-slate-200/50 p-8 md:p-12">
          {/* Header */}
          <div className="mb-8">
            <motion.h3
              initial={{ opacity: 0, x: -20 }}
              animate={visible ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="text-2xl md:text-3xl font-serif font-semibold tracking-wide mb-2"
              style={{ color: "hsl(220 15% 25%)" }}
            >
              Global Partner Network
            </motion.h3>
            <motion.p
              initial={{ opacity: 0, x: -20 }}
              animate={visible ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-sm md:text-base"
              style={{ color: "hsl(220 10% 45%)" }}
            >
              100+ insurance & reinsurance partners worldwide
            </motion.p>
          </div>

          {/* World Map */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={visible ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 1, delay: 0.5 }}
            className="my-8"
          >
            <WorldMap
              color="hsl(28 95% 62%)"
              size="responsive"
              data={data}
              backgroundColor="transparent"
              strokeOpacity={0.3}
              valueSuffix=" partners"
              styleFunction={(context: any) => {
                const opacityLevel = context.countryValue === 2 ? 1 : context.countryValue ? 0.6 : 0.1
                return {
                  fill: context.countryValue ? "hsl(28 95% 62%)" : "hsl(192 45% 70%)",
                  fillOpacity: opacityLevel,
                  stroke: "hsl(192 45% 60%)",
                  strokeWidth: 0.5,
                  strokeOpacity: 0.3,
                  cursor: "default",
                }
              }}
            />
          </motion.div>

          {/* Office markers overlay text */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={visible ? { opacity: 1 } : {}}
            transition={{ duration: 0.8, delay: 1 }}
            className="text-center mt-6"
          >
            <p className="text-xs md:text-sm font-mono tracking-wide" style={{ color: "hsl(220 10% 55%)" }}>
              <span style={{ color: "hsl(28 95% 62%)" }}>●</span> Headquarters: Ras Al Khaimah, UAE
              <span className="mx-4">•</span>
              <span style={{ color: "hsl(28 95% 62%)" }}>●</span> Representative Office: Dubai, UAE
            </p>
          </motion.div>
        </div>
      </motion.div>

      {/* Regional Statistics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
        {regions.map((region, i) => (
          <motion.div
            key={region.name}
            initial={{ opacity: 0, y: 20 }}
            animate={visible ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.2 }}
            className="p-4 md:p-5 rounded-lg bg-white border border-slate-200/50 hover:shadow-md transition-shadow duration-300"
          >
            <div className="flex items-baseline gap-2 mb-2">
              <span
                className="text-2xl md:text-3xl font-bold font-serif"
                style={{ color: "hsl(28 95% 62%)" }}
              >
                {region.percent}
              </span>
              <div className="h-px flex-1 bg-gradient-to-r from-slate-300 to-transparent" />
            </div>
            <h4
              className="text-sm md:text-base font-semibold mb-1"
              style={{ color: "hsl(220 15% 25%)" }}
            >
              {region.name}
            </h4>
            <p className="text-xs" style={{ color: "hsl(220 10% 55%)" }}>
              {region.desc}
            </p>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
