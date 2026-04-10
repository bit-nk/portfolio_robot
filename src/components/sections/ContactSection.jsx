import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Html } from '@react-three/drei'
import { contacts } from '../../utils/data'
import * as THREE from 'three'

function lerp(a, b, t) { return a + (b - a) * t }

const ICONS = {
  linkedin: <svg viewBox="0 0 24 24" fill="currentColor" width="28" height="28"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>,
  gmail: <svg viewBox="0 0 24 24" fill="currentColor" width="28" height="28"><path d="M24 5.457v13.909c0 .904-.732 1.636-1.636 1.636h-3.819V11.73L12 16.64l-6.545-4.91v9.273H1.636A1.636 1.636 0 010 19.366V5.457c0-2.023 2.309-3.178 3.927-1.964L5.455 4.64 12 9.548l6.545-4.91 1.528-1.145C21.69 2.28 24 3.434 24 5.457z"/></svg>,
  github: <svg viewBox="0 0 24 24" fill="currentColor" width="28" height="28"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/></svg>,
}

const COLORS = { linkedin: '#0a66c2', gmail: '#ea4335', github: '#7c3aed' }

const CARD_POSITIONS_DESKTOP = [[1.5, 0, 0], [0, -0.2, 0.3], [-1.5, 0, 0]]
const CARD_POSITIONS_MOBILE = [[0.7, 0, 0], [0, -0.1, 0.15], [-0.7, 0, 0]]

function ContactCard({ data, pos, index }) {
  const color = COLORS[data.icon]

  return (
    <group position={pos}>
      <Html center style={{ pointerEvents: 'auto' }}>
        <a
          className="contact-card"
          href={data.href}
          target={data.href.startsWith('mailto') ? '_self' : '_blank'}
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
          onPointerDown={(e) => e.stopPropagation()}
          style={{ '--accent': color }}
        >
          <div className="contact-card-icon" style={{ color }}>
            {ICONS[data.icon]}
          </div>
          <div className="contact-card-label">{data.label}</div>
          {data.icon === 'gmail' && (
            <div className="contact-card-sub">nirvikkc@gmail.com</div>
          )}
        </a>
      </Html>
    </group>
  )
}

export default function ContactSection({ hoveredSection, openSection, toggleSection, lockClose, vs }) {
  const isMobile = vs.isMobile
  const isOpen = openSection === 'contact'
  const labelRef = useRef()
  const labelX = useRef(0)
  const labelY = useRef(-1)

  useFrame(() => {
    if (labelRef.current) {
      const targetLabelX = isOpen ? (-0.1 + vs.vw * 0.5) : 0
      const targetLabelY = isOpen ? -1.2 : -1
      labelX.current = THREE.MathUtils.lerp(labelX.current, targetLabelX, 0.04)
      labelY.current = THREE.MathUtils.lerp(labelY.current, targetLabelY, 0.04)
      labelRef.current.position.x = labelX.current
      labelRef.current.position.y = labelY.current
    }
  })

  return (
    <group position={[lerp(-1, -3, vs.vw), lerp(1, 1, vs.vw), lerp(6, 6, vs.vw)]}>

      {isOpen && (
        <group position={[0, isMobile ? 1.8 : 2.5, 0.5]}>
          {contacts.map((c, i) => (
            <ContactCard
              key={c.id}
              data={c}
              pos={isMobile ? CARD_POSITIONS_MOBILE[i] : CARD_POSITIONS_DESKTOP[i]}
              index={i}
            />
          ))}
        </group>
      )}

    </group>
  )
}
