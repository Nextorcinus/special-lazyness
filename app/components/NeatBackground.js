'use client'

import { useEffect, useRef } from "react"
import { NeatGradient } from "@firecms/neat"

const config = {
    colors: [
        {
            color: '#005F73',
            enabled: true,
        },
        {
            color: '#0A9396',
            enabled: true,
        },
        {
            color: '#94D2BD',
            enabled: true,
        },
        {
            color: '#E9D8A6',
            enabled: true,
        },
        {
            color: '#EE9B00',
            enabled: false,
        },
    ],
    speed: 3,
    horizontalPressure: 3,
    verticalPressure: 7,
    waveFrequencyX: 1,
    waveFrequencyY: 2,
    waveAmplitude: 0,
    shadows: 10,
    highlights: 4,
    colorBrightness: 1.05,
    colorSaturation: -5,
    wireframe: false,
    colorBlending: 10,
    backgroundColor: '#004E64',
    backgroundAlpha: 1,
    grainScale: 3,
    grainSparsity: 0,
    grainIntensity: 0.3,
    grainSpeed: 1,
    resolution: 2,
    yOffset: 0,
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
        pointer-events-none
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
