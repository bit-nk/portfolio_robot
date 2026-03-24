import CameraRig from './CameraRig'
import Particles from './Particles'
import HexGrid from './HexGrid'
import Robot from './Robot'
import GearCluster from '../decorations/GearCluster'
import CircuitLines from '../decorations/CircuitLines'
import EnergyRing from '../decorations/EnergyRing'
import FloatingParts from '../decorations/FloatingParts'
import IntroSection from '../sections/IntroSection'
import ExperienceSection from '../sections/ExperienceSection'
import EducationSection from '../sections/EducationSection'
import SkillsSection from '../sections/SkillsSection'
import ContactSection from '../sections/ContactSection'

function lerp(a, b, t) { return a + (b - a) * t }

export default function Scene({ mouseParallax, hoveredSection, openSection, toggleSection, closeSection, lockClose, vs }) {
  const t = vs.vw

  return (
    <>
      <ambientLight intensity={lerp(1.2, 0.8, t)} />
      <directionalLight position={[10, 10, 5]} intensity={1.2} color="#ffffff" />
      <directionalLight position={[-5, 8, -10]} intensity={0.5} color="#c4b5fd" />
      <directionalLight position={[0, 5, 8]} intensity={0.4} color="#ffffff" />
      <hemisphereLight args={['#f0f0ff', '#e0e0e8', 0.5]} />

      <fog attach="fog" args={['#f0f0f0', lerp(18, 15, t), lerp(45, 40, t)]} />

      <CameraRig mouseParallax={mouseParallax} hoveredSection={hoveredSection} openSection={openSection} vs={vs} />

      <Robot
        position={[0, lerp(-2.8, -3.5, t), lerp(3, 1, t)]}
        mouseParallax={mouseParallax}
        hoveredSection={hoveredSection}
        vs={vs}
      />

      <HexGrid />
      <Particles count={t > 0.5 ? 400 : 200} />

      <GearCluster position={[8, -1, -2]} />
      {t > 0.5 && <GearCluster position={[-8, -1, -8]} />}
      <CircuitLines position={[4, 0, 3]} />
      {t > 0.5 && <CircuitLines position={[-3, 0, -6]} color="#06b6d4" />}

      {/* Energy rings — 4 sections now */}
      <EnergyRing position={[lerp(1, 5, t), lerp(3.2, 3, t), lerp(4, 1, t)]} radius={lerp(0.8, 1.0, t)} color="#818cf8" speed={0.3} />
      <EnergyRing position={[lerp(-1, -5, t), lerp(3.2, 3, t), lerp(4, 2, t)]} radius={lerp(0.7, 0.9, t)} color="#06b6d4" speed={0.25} />
      <EnergyRing position={[lerp(1, 2, t), lerp(0.5, 1, t), lerp(5, 4, t)]} radius={lerp(0.85, 0.8, t)} color="#f59e0b" speed={0.35} />
      {openSection !== 'contact' && (
        <EnergyRing position={[lerp(-1, -3, t), lerp(1, 1, t), lerp(6, 6, t)]} radius={lerp(0.6, 0.7, t)} color="#a78bfa" speed={0.2} />
      )}

      <FloatingParts count={15} isMobile={t < 0.5} />

      <IntroSection vs={vs} />

      <ExperienceSection hoveredSection={hoveredSection} openSection={openSection} toggleSection={toggleSection} lockClose={lockClose} vs={vs} />
      <EducationSection hoveredSection={hoveredSection} openSection={openSection} toggleSection={toggleSection} lockClose={lockClose} vs={vs} />
      <SkillsSection hoveredSection={hoveredSection} openSection={openSection} toggleSection={toggleSection} lockClose={lockClose} vs={vs} />
      <ContactSection hoveredSection={hoveredSection} openSection={openSection} toggleSection={toggleSection} lockClose={lockClose} vs={vs} />
    </>
  )
}
