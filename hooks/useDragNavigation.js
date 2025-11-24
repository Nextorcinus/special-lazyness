import { useEffect } from 'react'

export default function useDragNavigation(ref, onNext, onPrev, enabled = true) {
  useEffect(() => {
    if (!ref.current || !enabled) return

    let isDragging = false
    let startX = 0
    let diff = 0

    const handleMouseDown = (e) => {
      isDragging = true
      startX = e.pageX
    }

    const handleMouseMove = (e) => {
      if (!isDragging) return
      diff = e.pageX - startX
    }

    const handleMouseUp = () => {
      if (!isDragging) return
      isDragging = false
      if (Math.abs(diff) > 50) {
        diff < 0 ? onNext() : onPrev()
      }
      diff = 0
    }

    const node = ref.current
    node.addEventListener('mousedown', handleMouseDown)
    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseup', handleMouseUp)

    return () => {
      node.removeEventListener('mousedown', handleMouseDown)
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseup', handleMouseUp)
    }
  }, [ref, onNext, onPrev, enabled])
}
