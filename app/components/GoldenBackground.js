'use client'
import '../globals.css'

export default function GoldenBackground() {
  return (
    <div 
      style={{
        width: 'auto',
        height: 'auto',
        position: 'fixed',
        inset: 0,
        overflow: 'hidden',
        zIndex: -1,
        backgroundImage: "url('/icon/bg-all.jpg')",
        backgroundSize: 'cover',
        backgroundPosition: 'center top',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed',
      }}
    />
  )
}
