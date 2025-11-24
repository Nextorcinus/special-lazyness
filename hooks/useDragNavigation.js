import { useEffect, useRef } from 'react'

export default function useDragNavigation(ref, onNext, onPrev, enabled = true) {
  const swipeLocked = useRef(false)

  useEffect(() => {
    if (!ref.current || !enabled) return

    let isDragging = false
    let startX = 0
    let diff = 0

    const threshold = 90 // lebih tinggi supaya tidak terlalu sensitif

    const startDrag = (x) => {
      isDragging = true
      swipeLocked.current = false
      startX = x
      diff = 0
    }

    const moveDrag = (x) => {
      if (!isDragging) return
      diff = x - startX

      if (!swipeLocked.current && Math.abs(diff) > threshold) {
        swipeLocked.current = true
        diff < 0 ? onNext() : onPrev()
      }
    }

    const endDrag = () => {
      isDragging = false
      swipeLocked.current = false
      diff = 0
    }

    const node = ref.current

    // mouse events
    const handleMouseDown = (e) => startDrag(e.pageX)
    const handleMouseMove = (e) => moveDrag(e.pageX)
    const handleMouseUp = endDrag

    // touch events
    const handleTouchStart = (e) => startDrag(e.touches[0].pageX)
    const handleTouchMove = (e) => moveDrag(e.touches[0].pageX)
    const handleTouchEnd = endDrag

    node.addEventListener('mousedown', handleMouseDown)
    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseup', handleMouseUp)

    node.addEventListener('touchstart', handleTouchStart, { passive: true })
    node.addEventListener('touchmove', handleTouchMove, { passive: true })
    node.addEventListener('touchend', handleTouchEnd)

    return () => {
      node.removeEventListener('mousedown', handleMouseDown)
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseup', handleMouseUp)

      node.removeEventListener('touchstart', handleTouchStart)
      node.removeEventListener('touchmove', handleTouchMove)
      node.removeEventListener('touchend', handleTouchEnd)
    }
  }, [ref, onNext, onPrev, enabled])
}
