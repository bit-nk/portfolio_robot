import { useRef, useState, useEffect, useCallback } from 'react'
import { useFrame } from '@react-three/fiber'
import { Html } from '@react-three/drei'
import { experience } from '../../utils/data'
import * as THREE from 'three'

// Horizontal spacing between cards — will be scaled by viewport

function SliderCard({ data, index, total, activeIndex, cardGap }) {
  const isActive = index === activeIndex
  const stepDist = Math.abs(index - activeIndex)

  return (
    <group position={[index * cardGap, 0, 0]}>
      {stepDist <= 1 && (
        <Html transform distanceFactor={2.8} position={[0, 0, 0]}
          style={{ pointerEvents: isActive ? 'auto' : 'none', width: '460px', display: 'flex', alignItems: 'flex-start' }}>
          <div className={`holo-screen ${isActive ? '' : 'holo-inactive'}`}
            onClick={(e) => e.stopPropagation()} onPointerDown={(e) => e.stopPropagation()}>
            <div className="holo-header">
              <span className="holo-counter">{String(index + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}</span>
              <div className="holo-dots">
                {Array.from({ length: total }).map((_, i) => (
                  <span key={i} className={`holo-dot ${i === activeIndex ? 'active' : ''}`} />
                ))}
              </div>
            </div>
            <div className="holo-body">
              <div className="holo-date">{data.date}</div>
              <div className="holo-role">{data.role}</div>
              <div className="holo-company">{data.company}</div>
              <ul className="holo-details">
                {data.details.map((d, i) => <li key={i}>{d}</li>)}
              </ul>
            </div>
            {isActive && (
              <div className="holo-footer">
                <span className="holo-scroll-label">
                  <span className="scroll-icon">⟳</span>
                  <span className="desktop-hint">scroll or drag to switch</span>
                  <span className="mobile-hint">swipe to switch</span>
                </span>
              </div>
            )}
          </div>
        </Html>
      )}
    </group>
  )
}

export default function ExperienceSection({ hoveredSection, openSection, toggleSection, lockClose, vs }) {
  const t = vs.vw
  const isHovered = useRef(false)
  const [activeIndex, setActiveIndex] = useState(0)
  const isOpen = openSection === 'experience'

  const sliderRef = useRef()
  const labelRef = useRef()
  const targetX = useRef(0)
  const currentX = useRef(0)
  const labelX = useRef(0)
  const labelY = useRef(-0.8)

  const total = experience.length
  const cardGap = 3 + t * 1 // 3 on mobile, 4 on desktop

  useEffect(() => {
    if (isOpen) {
      setActiveIndex(0)
      targetX.current = 0
      currentX.current = 0
    }
  }, [isOpen])

  useEffect(() => {
    targetX.current = -activeIndex * cardGap
  }, [activeIndex])

  useFrame(() => {
    // Slider animation
    if (sliderRef.current && isOpen) {
      currentX.current = THREE.MathUtils.lerp(currentX.current, targetX.current, 0.1)
      if (Math.abs(currentX.current - targetX.current) < 0.01) {
        currentX.current = targetX.current
      }
      sliderRef.current.position.x = currentX.current
    }

    // Label position animation — less movement on mobile
    if (labelRef.current) {
      const targetLabelX = isOpen ? (-0.8 - t * 1.2) : 0
      const targetLabelY = isOpen ? -1.5 : -0.8
      labelX.current = THREE.MathUtils.lerp(labelX.current, targetLabelX, 0.04)
      labelY.current = THREE.MathUtils.lerp(labelY.current, targetLabelY, 0.04)
      labelRef.current.position.x = labelX.current
      labelRef.current.position.y = labelY.current
    }
  })

  const scrollCooldown = useRef(false)

  const goNext = useCallback(() => {
    if (scrollCooldown.current) return
    scrollCooldown.current = true
    setTimeout(() => { scrollCooldown.current = false }, 400)
    lockClose()
    setActiveIndex((prev) => Math.min(prev + 1, total - 1))
  }, [total, lockClose])

  const goPrev = useCallback(() => {
    if (scrollCooldown.current) return
    scrollCooldown.current = true
    setTimeout(() => { scrollCooldown.current = false }, 400)
    lockClose()
    setActiveIndex((prev) => Math.max(prev - 1, 0))
  }, [lockClose])

  const wheelCooldown = useRef(false)
  const onWheel = useCallback((e) => {
    if (!isOpen || wheelCooldown.current) return
    if (Math.abs(e.deltaY) > 10) {
      wheelCooldown.current = true
      setTimeout(() => { wheelCooldown.current = false }, 500)
      if (e.deltaY > 0) goNext()
      else goPrev()
    }
  }, [isOpen, goNext, goPrev])

  const isDragging = useRef(false)
  const dragStartX = useRef(0)
  const onMouseDown = useCallback((e) => {
    if (!isOpen) return
    isDragging.current = true
    dragStartX.current = e.clientX
  }, [isOpen])

  const onMouseMove = useCallback((e) => {
    if (!isOpen || !isDragging.current) return
    const dx = e.clientX - dragStartX.current
    if (dx < -80) { dragStartX.current = e.clientX; lockClose(); goNext() }
    else if (dx > 80) { dragStartX.current = e.clientX; lockClose(); goPrev() }
  }, [isOpen, goNext, goPrev, lockClose])

  const onMouseUp = useCallback(() => { isDragging.current = false }, [])

  const touchStart = useRef({ x: 0 })
  const onTouchStart = useCallback((e) => {
    if (!isOpen) return
    touchStart.current = { x: e.touches[0].clientX }
  }, [isOpen])

  const onTouchEnd = useCallback((e) => {
    if (!isOpen) return
    const dx = e.changedTouches[0].clientX - touchStart.current.x
    if (dx < -40) { lockClose(); goNext() }
    else if (dx > 40) { lockClose(); goPrev() }
  }, [isOpen, goNext, goPrev, lockClose])

  useEffect(() => {
    if (!isOpen) return
    window.addEventListener('wheel', onWheel)
    window.addEventListener('mousedown', onMouseDown)
    window.addEventListener('mousemove', onMouseMove)
    window.addEventListener('mouseup', onMouseUp)
    window.addEventListener('touchstart', onTouchStart, { passive: true })
    window.addEventListener('touchend', onTouchEnd)
    return () => {
      window.removeEventListener('wheel', onWheel)
      window.removeEventListener('mousedown', onMouseDown)
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('mouseup', onMouseUp)
      window.removeEventListener('touchstart', onTouchStart)
      window.removeEventListener('touchend', onTouchEnd)
    }
  }, [isOpen, onWheel, onMouseDown, onMouseMove, onMouseUp, onTouchStart, onTouchEnd])


  return (
    <group position={[1 + t * 4, 3.2 - t * 0.2, 4 - t * 3]}>
      {isOpen && (
        <group position={[0 + t * 1, -0.5, -0.3 - t * 0.2]} scale={0.75 + t * 0.0}>
          <group ref={sliderRef}>
            {experience.map((exp, i) => (
              <SliderCard
                key={exp.id}
                data={exp}
                index={i}
                total={total}
                activeIndex={activeIndex}
                cardGap={cardGap}
              />
            ))}
          </group>
        </group>
      )}
    </group>
  )
}
