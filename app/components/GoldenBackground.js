'use client'
import '../globals.css'

export default function GoldenBackground() {
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        position: 'fixed',
        inset: 0,
        overflow: 'hidden',
        zIndex: -1,
        backgroundImage: "url('/icon/bg-all.jpg')",
        backgroundSize: 'cover',
        backgroundPosition: 'bottom bottom',
        backgroundRepeat: 'no-repeat',
      }}
    />
  )
}
