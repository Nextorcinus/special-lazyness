import { useEffect } from 'react'

export default function useDragNavigation(ref, onNext, onPrev, enabled = true) {
  useEffect(() => {
    if (!ref.current || !enabled) return

    let isDragging = false
    let startX = 0
    let diff = 0

    const startDrag = (x) => {
      isDragging = true
      startX = x
      diff = 0
    }

    const moveDrag = (x) => {
      if (!isDragging) return
      diff = x - startX
    }

    const endDrag = () => {
      if (!isDragging) return
      isDragging = false

      // threshold drag
      if (Math.abs(diff) > 50) {
        diff < 0 ? onNext() : onPrev()
      }

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
