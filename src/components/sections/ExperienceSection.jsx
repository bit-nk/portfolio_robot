import { useRef, useState, useEffect, useCallback } from 'react'
import { useFrame } from '@react-three/fiber'
import { Html, Float } from '@react-three/drei'
import { experience } from '../../utils/data'
import * as THREE from 'three'

const PANEL_W = 3.4
const PANEL_H = 2.4

function StackGhost({ cardsAhead, color = '#818cf8', offset = 0.05 }) {
  const layers = Math.min(cardsAhead, 3)
  if (layers <= 0) return null
  return (
    <>
      {Array.from({ length: layers }).map((_, i) => {
        const layer = i + 1
        return (
          <group key={layer} position={[offset * layer, 0, -0.15 * layer]}>
            <mesh>
              <planeGeometry args={[PANEL_W * 0.85, PANEL_H * 0.85]} />
              <meshStandardMaterial color="#2d2b55" transparent opacity={0.3 - i * 0.07} side={THREE.DoubleSide} />
            </mesh>
            <mesh>
              <planeGeometry args={[PANEL_W * 0.85 + 0.04, PANEL_H * 0.85 + 0.04]} />
              <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.8 - i * 0.15} transparent opacity={0.4 - i * 0.1} side={THREE.DoubleSide} toneMapped={false} />
            </mesh>
          </group>
        )
      })}
    </>
  )
}

function PanelContent({ data, index, total, onNext, onPrev }) {
  return (
    <Html transform distanceFactor={2.8} position={[0, 0, 0.01]} style={{ pointerEvents: 'auto', width: '420px' }}>
      <div className="holo-screen" onClick={(e) => e.stopPropagation()} onPointerDown={(e) => e.stopPropagation()}>
        <div className="holo-header">
          <span className="holo-counter">{String(index + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}</span>
          <div className="holo-dots">
            {Array.from({ length: total }).map((_, i) => (
              <span key={i} className={`holo-dot ${i === index ? 'active' : ''}`} />
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
        <div className="holo-footer">
          <button className={`holo-btn ${index <= 0 ? 'disabled' : ''}`} onClick={onPrev} disabled={index <= 0}>◀ PREV</button>
          <span className="holo-scroll-label"><span className="scroll-icon">⟳</span>scroll to flip</span>
          <button className={`holo-btn ${index >= total - 1 ? 'disabled' : ''}`} onClick={onNext} disabled={index >= total - 1}>NEXT ▶</button>
        </div>
      </div>
    </Html>
  )
}

function PanelGlass({ glowRef }) {
  return (
    <>
      <mesh>
        <planeGeometry args={[PANEL_W, PANEL_H]} />
        <meshStandardMaterial color="#ffffff" transparent opacity={0.06} side={THREE.DoubleSide} />
      </mesh>
      <mesh ref={glowRef}>
        <planeGeometry args={[PANEL_W + 0.04, PANEL_H + 0.04]} />
        <meshStandardMaterial color="#818cf8" emissive="#818cf8" emissiveIntensity={0.4} transparent opacity={0.12} side={THREE.DoubleSide} toneMapped={false} />
      </mesh>
    </>
  )
}

// Peeling overlay — shows old data and animates away / pulls back in
function PeelLayer({ data, index, total, direction, onDone }) {
  const pivotRef = useRef()
  const rotY = useRef(direction === 'forward' ? 0 : -Math.PI * 0.65)

  useFrame(() => {
    if (!pivotRef.current) return
    const target = direction === 'forward' ? -Math.PI * 0.65 : 0
    rotY.current = THREE.MathUtils.lerp(rotY.current, target, 0.1)
    pivotRef.current.rotation.y = rotY.current

    // Done when close enough to target
    if (Math.abs(rotY.current - target) < 0.05 && onDone) {
      onDone()
    }
  })

  return (
    <group ref={pivotRef} position={[-PANEL_W / 2, 0, 0.02]}>
      <group position={[PANEL_W / 2, 0, 0]}>
        <PanelGlass />
        <Html transform distanceFactor={2.8} position={[0, 0, 0.01]} style={{ pointerEvents: 'none', width: '420px' }}>
          <div className="holo-screen" style={{ pointerEvents: 'none' }}>
            <div className="holo-header">
              <span className="holo-counter">{String(index + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}</span>
            </div>
            <div className="holo-body">
              <div className="holo-date">{data.date}</div>
              <div className="holo-role">{data.role}</div>
              <div className="holo-company">{data.company}</div>
              <ul className="holo-details">
                {data.details.map((d, i) => <li key={i}>{d}</li>)}
              </ul>
            </div>
          </div>
        </Html>
      </group>
    </group>
  )
}

export default function ExperienceSection({ hoveredSection, openSection, toggleSection, lockClose, vs }) {
  const isMobile = vs.isMobile
  const t = vs.vw
  const isHovered = useRef(false)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [peelData, setPeelData] = useState(null)
  const isOpen = openSection === 'experience'
  const scrollCooldown = useRef(false)
  const glowRef = useRef()

  useEffect(() => {
    if (isOpen) { setCurrentIndex(0); setPeelData(null) }
  }, [isOpen])

  const goNext = useCallback(() => {
    if (currentIndex >= experience.length - 1 || peelData) return
    lockClose()
    setPeelData({ data: experience[currentIndex], index: currentIndex, direction: 'forward' })
    setCurrentIndex(currentIndex + 1)
  }, [currentIndex, peelData, lockClose])

  const goPrev = useCallback(() => {
    if (currentIndex <= 0 || peelData) return
    lockClose()
    const prevIndex = currentIndex - 1
    setCurrentIndex(prevIndex)
    setPeelData({ data: experience[prevIndex], index: prevIndex, direction: 'backward' })
  }, [currentIndex, peelData])

  const onPeelDone = useCallback(() => {
    setPeelData(null)
  }, [])

  const onWheel = useCallback((e) => {
    if (!isOpen || scrollCooldown.current || peelData) return
    scrollCooldown.current = true
    setTimeout(() => { scrollCooldown.current = false }, 400)
    if (e.deltaY > 15) goNext()
    else if (e.deltaY < -15) goPrev()
  }, [isOpen, goNext, goPrev, peelData])

  useEffect(() => {
    if (!isOpen) return
    window.addEventListener('wheel', onWheel)
    return () => window.removeEventListener('wheel', onWheel)
  }, [isOpen, onWheel])

  const currentData = experience[currentIndex]
  const cardsAhead = experience.length - 1 - currentIndex

  return (
    <group position={[0.8 + t * 3.2, 3 - t * 1.5, 5 - t * 3]}>
      <group position={[0, 0.25, 0]}>
      <Float speed={2} rotationIntensity={0.1} floatIntensity={0.15}>
        <mesh
          onPointerEnter={() => { isHovered.current = true; hoveredSection.current = 'experience'; document.body.style.cursor = 'pointer' }}
          onPointerLeave={() => { isHovered.current = false; hoveredSection.current = 'none'; document.body.style.cursor = 'auto' }}
          onClick={(e) => { e.stopPropagation(); toggleSection('experience') }}
        >
          <icosahedronGeometry args={[0.45, 2]} />
          <meshStandardMaterial color="#818cf8" emissive="#818cf8" emissiveIntensity={1.5} wireframe transparent opacity={0.7} toneMapped={false} />
        </mesh>
        <mesh visible={false}
          onPointerEnter={() => { isHovered.current = true; hoveredSection.current = 'experience'; document.body.style.cursor = 'pointer' }}
          onPointerLeave={() => { isHovered.current = false; hoveredSection.current = 'none'; document.body.style.cursor = 'auto' }}
          onClick={(e) => { e.stopPropagation(); toggleSection('experience') }}
        >
          <sphereGeometry args={[0.8, 12, 12]} />
          <meshBasicMaterial />
        </mesh>
      </Float>
      </group>

      <Html position={[0, -0.8, 0]} center style={{ pointerEvents: 'none' }}>
        <div className="hotspot-label">EXPERIENCE</div>
      </Html>

      {isOpen && (
        <group position={[0.35 + t * 0.65, 1, -0.3 - t * 0.2]} rotation={[0, -t * 0.15, 0]}>
          {/* Stack ghosts behind */}
          <StackGhost cardsAhead={cardsAhead} offset={0.04 + t * 0.04} />

          {/* Base layer — always flat, shows CURRENT data */}
          <group>
            <PanelGlass glowRef={glowRef} />
            <PanelContent data={currentData} index={currentIndex} total={experience.length} onNext={goNext} onPrev={goPrev} />
          </group>

          {/* Peel layer — animates old card away or pulls prev card back in */}
          {peelData && (
            <PeelLayer
              data={peelData.data}
              index={peelData.index}
              total={experience.length}
              direction={peelData.direction}
              onDone={onPeelDone}
            />
          )}
        </group>
      )}
    </group>
  )
}
