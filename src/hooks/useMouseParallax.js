import { useEffect, useRef } from 'react'

// Returns a ref with { x, y } normalized from -1 to 1
// Works with both mouse (desktop) and touch drag (mobile)
export function useMouseParallax() {
  const mouse = useRef({ x: 0, y: 0 })
  const touch = useRef({ startX: 0, startY: 0 })

  useEffect(() => {
    function onMouseMove(e) {
      mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1
      mouse.current.y = (e.clientY / window.innerHeight) * 2 - 1
    }

    function onTouchStart(e) {
      const t = e.touches[0]
      touch.current.startX = t.clientX
      touch.current.startY = t.clientY
    }

    function onTouchMove(e) {
      const t = e.touches[0]
      // Map drag delta to -1..1 range (200px full range)
      mouse.current.x = Math.max(-1, Math.min(1, (t.clientX - touch.current.startX) / 100))
      mouse.current.y = Math.max(-1, Math.min(1, (t.clientY - touch.current.startY) / 100))
    }

    function onTouchEnd() {
      // Spring back to center
      mouse.current.x = 0
      mouse.current.y = 0
    }

    window.addEventListener('mousemove', onMouseMove)
    window.addEventListener('touchstart', onTouchStart, { passive: true })
    window.addEventListener('touchmove', onTouchMove, { passive: true })
    window.addEventListener('touchend', onTouchEnd)

    return () => {
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('touchstart', onTouchStart)
      window.removeEventListener('touchmove', onTouchMove)
      window.removeEventListener('touchend', onTouchEnd)
    }
  }, [])

  return mouse
}
