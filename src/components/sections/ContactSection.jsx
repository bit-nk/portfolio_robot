import { useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { Html, Float } from '@react-three/drei'
import { contacts } from '../../utils/data'
import * as THREE from 'three'

function lerp(a, b, t) { return a + (b - a) * t }

const ICONS = {
  linkedin: <svg viewBox="0 0 24 24" fill="currentColor" width="22" height="22"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>,
  gmail: <svg viewBox="0 0 24 24" fill="currentColor" width="22" height="22"><path d="M24 5.457v13.909c0 .904-.732 1.636-1.636 1.636h-3.819V11.73L12 16.64l-6.545-4.91v9.273H1.636A1.636 1.636 0 010 19.366V5.457c0-2.023 2.309-3.178 3.927-1.964L5.455 4.64 12 9.548l6.545-4.91 1.528-1.145C21.69 2.28 24 3.434 24 5.457z"/></svg>,
  github: <svg viewBox="0 0 24 24" fill="currentColor" width="22" height="22"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/></svg>,
}

const COLORS = ['#0a66c2', '#ea4335', '#e4e4e7']
const POSITIONS_DESKTOP = [[-1.2, 0, 0], [0, 0, 0.3], [1.2, 0, 0]]
const POSITIONS_MOBILE = [[-0.5, 0, 0], [0, 0, 0.15], [0.5, 0, 0]]

function ContactOrb({ data, color, pos, index, targetScale, isMobile }) {
  const groupRef = useRef()
  const meshRef = useRef()
  const hovered = useRef(false)
  const [showTooltip, setShowTooltip] = useState(false)
  const isGmail = data.icon === 'gmail'
  const scaleVal = useRef(0)

  useFrame(({ clock }) => {
    if (!groupRef.current) return
    const t = clock.getElapsedTime()

    // Smooth scale in/out
    scaleVal.current = THREE.MathUtils.lerp(scaleVal.current, targetScale, 0.06)
    groupRef.current.scale.setScalar(scaleVal.current)
    groupRef.current.visible = scaleVal.current > 0.01

    if (meshRef.current) {
      meshRef.current.rotation.y = t * 0.3
      const s = hovered.current ? 1.25 : 1
      meshRef.current.scale.setScalar(THREE.MathUtils.lerp(meshRef.current.scale.x, s, 0.08))
      meshRef.current.position.y = pos[1] + Math.sin(t + index * 2) * 0.06
    }
  })

  return (
    <group ref={groupRef} position={pos} scale={0}>
      <Float speed={1.5} rotationIntensity={0.05} floatIntensity={0.1}>
        <mesh
          ref={meshRef}
          onPointerEnter={() => { hovered.current = true; setShowTooltip(true); document.body.style.cursor = 'pointer' }}
          onPointerLeave={() => { hovered.current = false; setShowTooltip(false); document.body.style.cursor = 'auto' }}
          onClick={() => window.open(data.href, data.href.startsWith('mailto') ? '_self' : '_blank')}
        >
          <icosahedronGeometry args={[isMobile ? 0.2 : 0.3, 1]} />
          <meshStandardMaterial
            color={color}
            emissive={color}
            emissiveIntensity={1.5}
            wireframe
            transparent
            opacity={0.8}
            toneMapped={false}
          />
        </mesh>
      </Float>

      {/* Label */}
      <Html position={[0, isGmail ? (isMobile ? 0.35 : 0.5) : (isMobile ? -0.38 : -0.55), 0]} center style={{ pointerEvents: 'auto' }}>
        <a
          className="contact-orb-label"
          onClick={(e) => e.stopPropagation()}
          onPointerDown={(e) => e.stopPropagation()}
          onMouseEnter={() => setShowTooltip(true)}
          onMouseLeave={() => setShowTooltip(false)}
          href={data.href}
          target={data.href.startsWith('mailto') ? '_self' : '_blank'}
          rel="noopener"
        >
          {ICONS[data.icon]}
          <span>{data.label}</span>
        </a>
      </Html>

      {/* Email tooltip — always visible on mobile, hover on desktop */}
      {isGmail && (showTooltip || isMobile) && (
        <Html position={[0, isMobile ? 0.55 : 0.75, 0]} center style={{ pointerEvents: 'none' }}>
          <div className="holo-tooltip">
            <div className="holo-tooltip-label">EMAIL</div>
            <div className="holo-tooltip-value">nirvikkc@gmail.com</div>
          </div>
        </Html>
      )}
    </group>
  )
}

export default function ContactSection({ hoveredSection, openSection, toggleSection, lockClose, vs }) {
  const isMobile = vs.isMobile
  const isHovered = useRef(false)
  const isOpen = openSection === 'contact'

  // Main hotspot globe + ring scale
  const hotspotRef = useRef()
  const hotspotScale = useRef(1)

  useFrame(() => {
    if (!hotspotRef.current) return
    const target = isOpen ? 0 : 1
    hotspotScale.current = THREE.MathUtils.lerp(hotspotScale.current, target, 0.06)
    hotspotRef.current.scale.setScalar(hotspotScale.current)
    hotspotRef.current.visible = hotspotScale.current > 0.01
  })

  return (
    <group position={[0, lerp(1.2, 1.5, vs.vw), lerp(8, 7, vs.vw)]}>
      {/* Hotspot orb + label — scales down when open */}
      <group ref={hotspotRef}>
        <Float speed={2} rotationIntensity={0.1} floatIntensity={0.15}>
          <mesh
            onPointerEnter={() => { isHovered.current = true; hoveredSection.current = 'contact'; document.body.style.cursor = 'pointer' }}
            onPointerLeave={() => { isHovered.current = false; hoveredSection.current = 'none'; document.body.style.cursor = 'auto' }}
            onClick={(e) => { e.stopPropagation(); toggleSection('contact') }}
          >
            <icosahedronGeometry args={[0.25, 2]} />
            <meshStandardMaterial color="#a78bfa" emissive="#a78bfa" emissiveIntensity={1.5} wireframe transparent opacity={0.7} toneMapped={false} />
          </mesh>
          <mesh visible={false}
            onPointerEnter={() => { isHovered.current = true; hoveredSection.current = 'contact'; document.body.style.cursor = 'pointer' }}
            onPointerLeave={() => { isHovered.current = false; hoveredSection.current = 'none'; document.body.style.cursor = 'auto' }}
            onClick={(e) => { e.stopPropagation(); toggleSection('contact') }}
          >
            <sphereGeometry args={[0.8, 12, 12]} />
            <meshBasicMaterial />
          </mesh>
        </Float>

        <Html position={[0, -0.8, 0]} center style={{ pointerEvents: 'none' }}>
          <div className="hotspot-label">CONTACT</div>
        </Html>
      </group>

      {/* 3 orbs — only rendered when open */}
      {isOpen && (
        <group position={[0, isMobile ? 0.3 : 0.6, 0.5]}>
          {contacts.map((c, i) => (
            <ContactOrb
              key={c.id}
              data={c}
              color={COLORS[i]}
              pos={isMobile ? POSITIONS_MOBILE[i] : POSITIONS_DESKTOP[i]}
              index={i}
              targetScale={1}
              isMobile={isMobile}
            />
          ))}
        </group>
      )}
    </group>
  )
}
