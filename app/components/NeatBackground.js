'use client'

import { useEffect, useRef } from "react"
import { NeatGradient } from "@firecms/neat"

const config = {
    colors: [
        {
            color: '#0b3954',
            enabled: true,
        },
        {
            color: '#087e8b',
            enabled: true,
        },
        {
            color: '#439C9C',
            enabled: true,
        },
        {
            color: '#20397F',
            enabled: true,
        },
        {
            color: '#c81d25',
            enabled: false,
        },
    ],
    speed: 7,
    horizontalPressure: 4,
    verticalPressure: 3,
    waveFrequencyX: 0,
    waveFrequencyY: 0,
    waveAmplitude: 0,
    shadows: 2,
    highlights: 7,
    colorBrightness: 1,
    colorSaturation: -1,
    wireframe: false,
    colorBlending: 5,
    backgroundColor: '#FF0000',
    backgroundAlpha: 1,
    grainScale: 3,
    grainSparsity: 0.08,
    grainIntensity: 0.275,
    grainSpeed: 1.8,
    resolution: 0.2,
    yOffset: 1112,
}



export default function NeatBackground() {
  const canvasRef = useRef(null)

  useEffect(() => {
    if (!canvasRef.current) return

    const neat = new NeatGradient({
      ref: canvasRef.current,
      ...config
    })

    neat.speed = 6

    return () => neat.destroy()
  }, [])

  return (
    <div
      className="
        fixed inset-0 
        w-screen h-screen 
        overflow-hidden 
        -z-10
        pointer-events-none text-color-transparent
      "
    >
      <canvas
        ref={canvasRef}
        id="gradient"
        className="absolute inset-0 w-[100%] h-[100%] "
      />
    </div>
  )
}
