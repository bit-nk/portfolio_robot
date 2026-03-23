import { useState, useEffect } from 'react'

export function useIsMobile(breakpoint = 768) {
  const [isMobile, setIsMobile] = useState(
    typeof window !== 'undefined' ? window.innerWidth <= breakpoint : false
  )

  useEffect(() => {
    function onResize() {
      setIsMobile(window.innerWidth <= breakpoint)
    }
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [breakpoint])

  return isMobile
}

// Returns a 0-1 scale factor based on viewport width
// 1 = desktop (1200px+), 0 = smallest mobile (320px)
// Also returns aspect ratio for layout decisions
export function useViewportScale() {
  const [scale, setScale] = useState(() => {
    if (typeof window === 'undefined') return { vw: 1, vh: 1, aspect: 16 / 9, isPortrait: false, isMobile: false, isTablet: false }
    return calc()
  })

  function calc() {
    const w = window.innerWidth
    const h = window.innerHeight
    const aspect = w / h
    // vw: 0 at 320px, 1 at 1200px+
    const vw = Math.min(1, Math.max(0, (w - 320) / (1200 - 320)))
    // vh: 0 at 500px, 1 at 900px+
    const vh = Math.min(1, Math.max(0, (h - 500) / (900 - 500)))
    return {
      vw,
      vh,
      aspect,
      isPortrait: aspect < 1,
      isMobile: w <= 768,
      isTablet: w > 768 && w <= 1024,
    }
  }

  useEffect(() => {
    function onResize() { setScale(calc()) }
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  return scale
}
