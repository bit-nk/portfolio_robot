import { useEffect, useRef } from 'react'
import Spline from '@splinetool/react-spline'

// CSS transform per section: [translateX, translateY, scale]
const TRANSFORMS = {
  experience:  { x: '-15%', y: '-6%', s: 1.45 },
  education:   { x: '15%',  y: '-6%', s: 1.45 },
  skills:      { x: '-10%', y: '6%',  s: 1.4 },
  contact:     { x: '12%',  y: '0%',  s: 1.35 },
}

export default function SplineRobot({ openSection }) {
  const containerRef = useRef(null)
  const innerRef = useRef(null)

  useEffect(() => {
    const el = containerRef.current
    if (!el) return

    function passClick(e) {
      el.style.pointerEvents = 'none'
      const below = document.elementFromPoint(e.clientX, e.clientY)
      if (below) {
        below.dispatchEvent(new PointerEvent(e.type, e))
      }
      requestAnimationFrame(() => {
        if (el) el.style.pointerEvents = 'auto'
      })
    }

    el.addEventListener('pointerdown', passClick, true)
    el.addEventListener('pointerup', passClick, true)
    el.addEventListener('click', passClick, true)

    return () => {
      el.removeEventListener('pointerdown', passClick, true)
      el.removeEventListener('pointerup', passClick, true)
      el.removeEventListener('click', passClick, true)
    }
  }, [])

  // Apply zoom/pan transform based on which section is open
  const t = TRANSFORMS[openSection]
  const transform = t
    ? `translate(${t.x}, ${t.y}) scale(${t.s})`
    : 'translate(0%, 0%) scale(1)'

  return (
    <div className="spline-layer" ref={containerRef}>
      <div
        ref={innerRef}
        style={{
          width: '100%',
          height: '100%',
          transform,
          transition: 'transform 0.9s cubic-bezier(0.22, 1, 0.36, 1)',
          transformOrigin: 'center center',
          willChange: 'transform',
        }}
      >
        <Spline scene="https://prod.spline.design/xOEybNMgp4wulbDZ/scene.splinecode" />
      </div>
    </div>
  )
}
