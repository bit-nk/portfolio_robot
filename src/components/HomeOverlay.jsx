import { useState, useEffect, useRef } from 'react'
import { prefersReducedMotion } from '../utils/motion'

const ABOUT_TEXT = "Software Engineer with 5+ years shipping production systems across React, C#/.NET, AWS, and Microsoft Power Platform. I design automated pipelines, optimize end-to-end performance, and architect cloud-native solutions that scale. MS in Computer Science, 4.0 GPA."

function TypeWriter({ text, speed = 18, delay = 300 }) {
  const [displayed, setDisplayed] = useState('')
  const [done, setDone] = useState(false)
  const [glitchChar, setGlitchChar] = useState('')
  const idx = useRef(0)
  const glitchChars = '!@#$%^&*()_+-=[]{}|;:<>?/~`01'

  useEffect(() => {
    // Reduced motion: show the whole paragraph at once, no typing/glitch.
    if (prefersReducedMotion()) { setDisplayed(text); setDone(true); return }
    idx.current = 0
    setDisplayed('')
    setDone(false)

    let interval
    const startTimer = setTimeout(() => {
      interval = setInterval(() => {
        if (idx.current >= text.length) {
          clearInterval(interval)
          setDone(true)
          setGlitchChar('')
          return
        }
        // Show random glitch char briefly before the real char
        setGlitchChar(glitchChars[Math.floor(Math.random() * glitchChars.length)])
        setTimeout(() => {
          setDisplayed(text.slice(0, idx.current + 1))
          setGlitchChar('')
          idx.current++
        }, speed / 3)
      }, speed)
    }, delay)

    return () => { clearTimeout(startTimer); clearInterval(interval) }
  }, [text, speed, delay])

  return (
    <span className="typewriter-text">
      {displayed}
      {!done && glitchChar && <span className="typewriter-glitch">{glitchChar}</span>}
      <span className="typewriter-cursor">_</span>
    </span>
  )
}

function TagTypeWriter({ text, speed = 40, delay = 0 }) {
  const [displayed, setDisplayed] = useState('')
  const idx = useRef(0)

  useEffect(() => {
    if (prefersReducedMotion()) { setDisplayed(text); return }
    idx.current = 0
    setDisplayed('')
    let interval
    const timer = setTimeout(() => {
      interval = setInterval(() => {
        if (idx.current >= text.length) { clearInterval(interval); return }
        setDisplayed(text.slice(0, idx.current + 1))
        idx.current++
      }, speed)
    }, delay)
    return () => { clearTimeout(timer); clearInterval(interval) }
  }, [text, speed, delay])

  return <span>{displayed}</span>
}

export default function HomeOverlay({ onNavigate, visible }) {
  return (
    <div className={`home-overlay ${visible ? 'visible' : ''}`}>
      {/* Scan line sweep */}
      <div className="home-scanline" aria-hidden="true"></div>

      {/* Grid pattern */}
      <div className="home-grid" aria-hidden="true"></div>

      {/* Left side — mini radar */}
      <div className="home-left-decor" aria-hidden="true">
        <div className="mini-radar">
          <div className="mini-radar-ring"></div>
          <div className="mini-radar-ring inner"></div>
          <div className="mini-radar-sweep"></div>
          <div className="mini-radar-dot" style={{ top: '30%', left: '60%' }}></div>
          <div className="mini-radar-dot" style={{ top: '55%', left: '35%' }}></div>
          <div className="mini-radar-dot" style={{ top: '70%', left: '65%' }}></div>
        </div>
      </div>

      {/* Bottom-left info panel */}
      <div className="home-info-panel">
        <div className="home-info-tag">
          <span className="home-info-tag-bracket">[</span>
          <TagTypeWriter text="ABOUT_ME" speed={50} delay={100} />
          <span className="home-info-tag-bracket">]</span>
        </div>
        <p className="home-info-text">
          <TypeWriter text={ABOUT_TEXT} speed={18} delay={600} />
        </p>
        <button className="home-info-link" onClick={() => onNavigate('experience')}>
          Explore work <span className="home-arrow">→</span>
        </button>
      </div>

      {/* Bottom-right CTA with circular scope */}
      <div className="home-cta-wrapper">
        <div className="scope-ring scope-ring-1" aria-hidden="true"></div>
        <div className="scope-ring scope-ring-2" aria-hidden="true"></div>
        <div className="scope-ring scope-ring-3" aria-hidden="true"></div>
        <div className="scope-cross-h" aria-hidden="true"></div>
        <div className="scope-cross-v" aria-hidden="true"></div>
        <button className="home-cta" onClick={() => onNavigate('contact')}>
          GET_IN_TOUCH
        </button>
      </div>
    </div>
  )
}
