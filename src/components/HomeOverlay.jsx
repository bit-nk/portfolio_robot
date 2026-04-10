import { useState, useEffect, useRef } from 'react'

const ABOUT_TEXT = "Software Engineer with 5+ years shipping production systems across React, C#/.NET, AWS, and Microsoft Power Platform. I design automated pipelines, optimize end-to-end performance, and architect cloud-native solutions that scale. MS in Computer Science, 4.0 GPA."

function TypeWriter({ text, speed = 18, delay = 300 }) {
  const [displayed, setDisplayed] = useState('')
  const [cursor, setCursor] = useState(true)
  const [done, setDone] = useState(false)
  const [glitchChar, setGlitchChar] = useState('')
  const idx = useRef(0)
  const glitchChars = '!@#$%^&*()_+-=[]{}|;:<>?/~`01'

  useEffect(() => {
    idx.current = 0
    setDisplayed('')
    setDone(false)

    const startTimer = setTimeout(() => {
      const interval = setInterval(() => {
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
      return () => clearInterval(interval)
    }, delay)

    const cursorBlink = setInterval(() => setCursor(c => !c), 400)
    return () => { clearTimeout(startTimer); clearInterval(cursorBlink) }
  }, [text, speed, delay])

  return (
    <span className="typewriter-text">
      {displayed}
      {!done && glitchChar && <span className="typewriter-glitch">{glitchChar}</span>}
      <span className={`typewriter-cursor ${cursor ? '' : 'off'}`}>_</span>
    </span>
  )
}

function TagTypeWriter({ text, speed = 40, delay = 0 }) {
  const [displayed, setDisplayed] = useState('')
  const idx = useRef(0)

  useEffect(() => {
    idx.current = 0
    setDisplayed('')
    const timer = setTimeout(() => {
      const interval = setInterval(() => {
        if (idx.current >= text.length) { clearInterval(interval); return }
        setDisplayed(text.slice(0, idx.current + 1))
        idx.current++
      }, speed)
      return () => clearInterval(interval)
    }, delay)
    return () => clearTimeout(timer)
  }, [text, speed, delay])

  return <span>{displayed}</span>
}

export default function HomeOverlay({ onNavigate, visible }) {
  return (
    <div className={`home-overlay ${visible ? 'visible' : ''}`}>
      {/* Scan line sweep */}
      <div className="home-scanline"></div>

      {/* Grid pattern */}
      <div className="home-grid"></div>

      {/* Left side status readout */}
      <div className="home-status-left">
        <span>SYS_ONLINE</span>
        <span className="home-status-dot"></span>
        <span>PORTFOLIO_V2.0</span>
      </div>


      {/* Left side — mini radar + data bars */}
      <div className="home-left-decor">
        {/* Mini radar */}
        <div className="mini-radar">
          <div className="mini-radar-ring"></div>
          <div className="mini-radar-ring inner"></div>
          <div className="mini-radar-sweep"></div>
          <div className="mini-radar-dot" style={{ top: '30%', left: '60%' }}></div>
          <div className="mini-radar-dot" style={{ top: '55%', left: '35%' }}></div>
          <div className="mini-radar-dot" style={{ top: '70%', left: '65%' }}></div>
        </div>

        {/* System bars */}
        <div className="sys-bars">
          <div className="sys-bar-row"><span className="sys-bar-label">NET</span><div className="sys-bar-track"><div className="sys-bar-fill" style={{ '--w': '78%' }}></div></div></div>
          <div className="sys-bar-row"><span className="sys-bar-label">CPU</span><div className="sys-bar-track"><div className="sys-bar-fill" style={{ '--w': '45%' }}></div></div></div>
          <div className="sys-bar-row"><span className="sys-bar-label">MEM</span><div className="sys-bar-track"><div className="sys-bar-fill" style={{ '--w': '62%' }}></div></div></div>
        </div>

        <div className="sys-uptime">UPTIME 2847:03:12</div>
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
        <div className="scope-ring scope-ring-1"></div>
        <div className="scope-ring scope-ring-2"></div>
        <div className="scope-ring scope-ring-3"></div>
        <div className="scope-cross-h"></div>
        <div className="scope-cross-v"></div>
        <button className="home-cta" onClick={() => onNavigate('contact')}>
          GET_IN_TOUCH
        </button>
      </div>

      {/* Top-right — game HUD stats */}
      <div className="home-hud">
        <div className="hud-row">
          <div className="hud-row-header">
            <span className="hud-label">SYNC</span>
            <span className="hud-val">98</span>
          </div>
          <div className="hud-bar-track">
            <div className="hud-bar-fill hp"></div>
            <div className="hud-bar-scanline"></div>
          </div>
        </div>

        <div className="hud-row">
          <div className="hud-row-header">
            <span className="hud-label">SIGNAL</span>
            <span className="hud-val">74</span>
          </div>
          <div className="hud-bar-track">
            <div className="hud-bar-fill mp"></div>
            <div className="hud-bar-scanline"></div>
          </div>
        </div>

        <div className="hud-row">
          <div className="hud-row-header">
            <span className="hud-label">DEV EXP</span>
            <span className="hud-val">LV5</span>
          </div>
          <div className="hud-bar-track">
            <div className="hud-bar-fill xp"></div>
            <div className="hud-bar-scanline"></div>
          </div>
        </div>

        {/* Health packs */}
        <div className="hud-ammo">
          <div className="hud-bullets">
            {[1,2,3,4,5,6].map(i => (
              <svg key={i} className={`hud-bullet ${i > 4 ? 'spent' : ''}`} viewBox="0 0 18 18" width="18" height="18">
                <rect x="1" y="1" width="16" height="16" rx="2" fill="none" stroke="currentColor" strokeWidth="1.2" />
                <rect x="7.5" y="4" width="3" height="10" rx="0.5" fill="currentColor" />
                <rect x="4" y="7.5" width="10" height="3" rx="0.5" fill="currentColor" />
              </svg>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
