import { Html } from '@react-three/drei'
import { experience } from '../../utils/data'
import { useCardSlider } from '../../hooks/useCardSlider'

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

export default function ExperienceSection({ openSection, lockClose, vs }) {
  const t = vs.vw
  const isOpen = openSection === 'experience'
  const total = experience.length
  const cardGap = 3 + t // 3 on mobile, 4 on desktop
  const { sliderRef, activeIndex } = useCardSlider({ isOpen, total, cardGap, lockClose, isMobile: vs.isMobile })

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
