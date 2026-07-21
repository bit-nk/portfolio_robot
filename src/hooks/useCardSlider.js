import { useRef, useState, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'

// Shared logic for the holographic card sliders (Experience / Education / Skills).
// These three sections were hand-duplicated and had drifted — Education's drag
// direction was inverted. One implementation, one place to fix.
//
// Direction convention (same for every input): moving/scrolling toward the NEXT
// card (drag-left, swipe-left, wheel-down, ArrowRight) advances the index.
//
// Returns the group ref to attach and the current active index.
export function useCardSlider({ isOpen, total, cardGap, lockClose, isMobile }) {
  const [activeIndex, setActiveIndex] = useState(0)
  const sliderRef = useRef()
  const targetX = useRef(0)
  const currentX = useRef(0)
  const cooldown = useRef(false)

  function step(dir) {
    if (cooldown.current) return
    cooldown.current = true
    setTimeout(() => { cooldown.current = false }, 400)
    lockClose?.()
    setActiveIndex((prev) => Math.max(0, Math.min(total - 1, prev + dir)))
  }

  // Reset to first card whenever the section opens
  useEffect(() => {
    if (isOpen) { setActiveIndex(0); targetX.current = 0; currentX.current = 0 }
  }, [isOpen])

  useEffect(() => { targetX.current = -activeIndex * cardGap }, [activeIndex, cardGap])

  // Frame-rate-independent damping toward the target card position
  useFrame((_, delta) => {
    if (!sliderRef.current || !isOpen) return
    const factor = 1 - Math.exp(-(isMobile ? 5 : 7) * delta)
    currentX.current += (targetX.current - currentX.current) * factor
    if (Math.abs(currentX.current - targetX.current) < 0.02) currentX.current = targetX.current
    sliderRef.current.position.x = currentX.current
  })

  // Input handlers live entirely inside the effect (plain closures, no useCallback
  // churn) and only listen while the section is open.
  useEffect(() => {
    if (!isOpen) return
    let wheelLock = false
    let dragging = false
    let dragStartX = 0
    let touchX = 0

    const onWheel = (e) => {
      if (wheelLock || Math.abs(e.deltaY) <= 10) return
      wheelLock = true
      setTimeout(() => { wheelLock = false }, 500)
      step(e.deltaY > 0 ? 1 : -1)
    }
    const onDown = (e) => { dragging = true; dragStartX = e.clientX }
    const onMove = (e) => {
      if (!dragging) return
      const dx = e.clientX - dragStartX
      if (dx < -80) { dragStartX = e.clientX; step(1) }
      else if (dx > 80) { dragStartX = e.clientX; step(-1) }
    }
    const onUp = () => { dragging = false }
    const onTouchStart = (e) => { touchX = e.touches[0].clientX }
    const onTouchEnd = (e) => {
      const dx = e.changedTouches[0].clientX - touchX
      if (dx < -40) step(1)
      else if (dx > 40) step(-1)
    }
    const onKey = (e) => {
      if (e.key === 'ArrowRight') step(1)
      else if (e.key === 'ArrowLeft') step(-1)
    }

    window.addEventListener('wheel', onWheel, { passive: true })
    window.addEventListener('mousedown', onDown)
    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseup', onUp)
    window.addEventListener('touchstart', onTouchStart, { passive: true })
    window.addEventListener('touchend', onTouchEnd)
    window.addEventListener('keydown', onKey)
    return () => {
      window.removeEventListener('wheel', onWheel)
      window.removeEventListener('mousedown', onDown)
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseup', onUp)
      window.removeEventListener('touchstart', onTouchStart)
      window.removeEventListener('touchend', onTouchEnd)
      window.removeEventListener('keydown', onKey)
    }
    // step closes over `total` and `lockClose`; re-subscribe if they change.
  }, [isOpen, total, lockClose]) // eslint-disable-line react-hooks/exhaustive-deps

  return { sliderRef, activeIndex }
}
