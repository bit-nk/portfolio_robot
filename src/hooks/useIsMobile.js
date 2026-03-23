import { useState, useEffect, useCallback } from 'react'

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

function calcScale() {
  const w = window.innerWidth
  const h = window.innerHeight
  const aspect = w / h
  const vw = Math.min(1, Math.max(0, (w - 320) / (1200 - 320)))
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

export function useViewportScale() {
  const [scale, setScale] = useState(() => {
    if (typeof window === 'undefined') return { vw: 1, vh: 1, aspect: 16 / 9, isPortrait: false, isMobile: false, isTablet: false }
    return calcScale()
  })

  const update = useCallback(() => {
    setScale((prev) => {
      const next = calcScale()
      // Only update if values actually changed to avoid unnecessary re-renders
      if (prev.vw === next.vw && prev.isMobile === next.isMobile && prev.aspect === next.aspect) return prev
      return next
    })
  }, [])

  useEffect(() => {
    window.addEventListener('resize', update)
    window.addEventListener('orientationchange', update)

    // Poll for DevTools responsive mode changes (no resize event fired)
    const interval = setInterval(update, 500)

    return () => {
      window.removeEventListener('resize', update)
      window.removeEventListener('orientationchange', update)
      clearInterval(interval)
    }
  }, [update])

  return scale
}
