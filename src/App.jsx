import { Canvas } from '@react-three/fiber'
import { AdaptiveDpr, AdaptiveEvents } from '@react-three/drei'
import { Component, useRef, useState, useCallback, useEffect } from 'react'
import Scene from './components/canvas/Scene'
import { useMouseParallax } from './hooks/useMouseParallax'
import { useViewportScale } from './hooks/useIsMobile'
import * as THREE from 'three'

class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { error: null }
  }
  static getDerivedStateFromError(error) {
    return { error }
  }
  render() {
    if (this.state.error) {
      return (
        <div style={{ padding: 40, color: 'red', fontFamily: 'monospace' }}>
          <h2>Render Error</h2>
          <pre>{this.state.error.message}</pre>
          <pre>{this.state.error.stack}</pre>
        </div>
      )
    }
    return this.props.children
  }
}

export default function App() {
  const mouseParallax = useMouseParallax()
  const hoveredSection = useRef('none')
  const [openSection, setOpenSection] = useState(null)
  const closeLock = useRef(0)
  const vs = useViewportScale()

  const fov = 65 - vs.vw * 15

  const toggleSection = useCallback((key) => {
    closeLock.current = Date.now() + 1200
    setOpenSection((prev) => (prev === key ? null : key))
  }, [])

  const lockClose = useCallback(() => {
    closeLock.current = Date.now() + 1200
  }, [])

  const closeSection = useCallback(() => {}, [])

  useEffect(() => {
    function handleClick(e) {
      if (e.target.tagName !== 'CANVAS') return
      if (Date.now() < closeLock.current) return
      setOpenSection(null)
    }
    window.addEventListener('click', handleClick)
    return () => window.removeEventListener('click', handleClick)
  }, [])

  return (
    <ErrorBoundary>
      <div className="canvas-wrapper">
        <Canvas
          camera={{ fov, near: 0.1, far: 100, position: [0, 3, 12] }}
          gl={{
            antialias: vs.vw > 0.5,
            alpha: false,
            powerPreference: 'default',
            failIfMajorPerformanceCaveat: false,
          }}
          eventPrefix="client"
          dpr={vs.isMobile ? 1 : [1, 2]}
          fallback={<div style={{ width: '100vw', height: '100vh', background: '#f0f0f0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Inter, sans-serif', color: '#64748b' }}>Loading 3D scene...</div>}
          onCreated={({ gl }) => {
            // Force WebGL1 compatibility on mobile
            gl.outputColorSpace = THREE.SRGBColorSpace
          }}
        >
          <color attach="background" args={['#f0f0f0']} />
          <AdaptiveDpr pixelated />
          <AdaptiveEvents />
          <Scene
            mouseParallax={mouseParallax}
            hoveredSection={hoveredSection}
            openSection={openSection}
            toggleSection={toggleSection}
            closeSection={closeSection}
            lockClose={lockClose}
            vs={vs}
          />
        </Canvas>

        {openSection && (
          <div className="close-overlay">
            <div className="close-hint">{vs.isMobile ? 'tap anywhere to go back' : 'click anywhere to go back'}</div>
          </div>
        )}
      </div>
    </ErrorBoundary>
  )
}
