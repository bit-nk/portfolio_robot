import { Html } from '@react-three/drei'
import { skills } from '../../utils/data'
import { useCardSlider } from '../../hooks/useCardSlider'

function SliderCard({ data, index, total, activeIndex, cardGap }) {
  const isActive = index === activeIndex
  const stepDist = Math.abs(index - activeIndex)

  return (
    <group position={[index * cardGap, 0, 0]}>
      {stepDist <= 1 && (
        <Html transform distanceFactor={2.8} position={[0, 0, 0]}
          style={{ pointerEvents: isActive ? 'auto' : 'none', width: '420px' }}>
          <div className={`holo-screen skills ${isActive ? '' : 'holo-inactive'}`}
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
              <div className="holo-skill-category">{data.category}</div>
              <div className="holo-skill-items">
                {data.items.map((item, i) => (
                  <span key={i} className="holo-skill-tag">{item}</span>
                ))}
              </div>
            </div>
            {isActive && (
              <div className="holo-footer">
                <span className="holo-scroll-label">
                  <span className="scroll-icon">⟳</span>
                  <span className="desktop-hint">scroll, drag or ← → to switch</span>
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

export default function SkillsSection({ openSection, lockClose, vs }) {
  const t = vs.vw
  const isOpen = openSection === 'skills'
  const total = skills.length
  const cardGap = 3 + t
  const { sliderRef, activeIndex } = useCardSlider({ isOpen, total, cardGap, lockClose, isMobile: vs.isMobile })

  return (
    <group position={[lerp(1, 2, t), lerp(0.5, 1, t), lerp(5, 4, t)]}>
      {isOpen && (
        <group position={[-0.2 + t * 0.7, 0, -0.3 - t * 0.2]} scale={0.75 + t * 0.0}>
          <group ref={sliderRef}>
            {skills.map((skill, i) => (
              <SliderCard
                key={skill.id}
                data={skill}
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

function lerp(a, b, t) { return a + (b - a) * t }
