import { useState, useEffect, useCallback } from 'react'

// Only vw (0..1 viewport-width scale) and isMobile are consumed anywhere.
function calcScale() {
  const w = window.innerWidth
  return {
    vw: Math.min(1, Math.max(0, (w - 320) / (1200 - 320))),
    isMobile: w <= 768,
  }
}

export function useViewportScale() {
  const [scale, setScale] = useState(() =>
    typeof window === 'undefined' ? { vw: 1, isMobile: false } : calcScale()
  )

  const update = useCallback(() => {
    setScale((prev) => {
      const next = calcScale()
      // Skip no-op state updates to avoid re-rendering the whole scene on every pixel
      if (prev.vw === next.vw && prev.isMobile === next.isMobile) return prev
      return next
    })
  }, [])

  useEffect(() => {
    window.addEventListener('resize', update)
    window.addEventListener('orientationchange', update)
    return () => {
      window.removeEventListener('resize', update)
      window.removeEventListener('orientationchange', update)
    }
  }, [update])

  return scale
}
