import { Canvas } from '@react-three/fiber'
import { Component, useRef, useState, useCallback, useEffect } from 'react'
import Scene from './components/canvas/Scene'
import SplineRobot from './components/SplineRobot'
import Navbar from './components/Navbar'
import HomeOverlay from './components/HomeOverlay'
import { useMouseParallax } from './hooks/useMouseParallax'
import { useViewportScale } from './hooks/useIsMobile'

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
        <Navbar onNavigate={toggleSection} openSection={openSection} />
        <SplineRobot openSection={openSection} />

        {/* Corner frame brackets */}
        <div className="cyber-frame tl"></div>
        <div className="cyber-frame tr"></div>
        <div className="cyber-frame bl"></div>
        <div className="cyber-frame br"></div>
        <Canvas
          camera={{ fov, near: 0.1, far: 100, position: [0, 3, 12] }}
          gl={{ antialias: false, alpha: true, powerPreference: 'high-performance' }}
          eventPrefix="client"
          dpr={1}
        >
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

        <HomeOverlay onNavigate={toggleSection} visible={!openSection} />

        <div className={`close-overlay ${openSection ? 'visible' : ''}`}>
          <div className="close-hint">{vs.isMobile ? 'tap anywhere to go back' : 'click anywhere to go back'}</div>
        </div>
      </div>
    </ErrorBoundary>
  )
}
