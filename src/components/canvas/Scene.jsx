import CameraRig from './CameraRig'
import Particles from './Particles'
import IntroSection from '../sections/IntroSection'
import ExperienceSection from '../sections/ExperienceSection'
import EducationSection from '../sections/EducationSection'
import SkillsSection from '../sections/SkillsSection'
import ContactSection from '../sections/ContactSection'

export default function Scene({ mouseParallax, openSection, lockClose, vs }) {
  const t = vs.vw

  return (
    <>
      <ambientLight intensity={0.3} />
      <directionalLight position={[10, 10, 5]} intensity={0.5} color="#a0c4ff" />
      <hemisphereLight args={['#0a1628', '#060c18', 0.2]} />

      <CameraRig mouseParallax={mouseParallax} openSection={openSection} vs={vs} />

      <Particles count={t > 0.5 ? 100 : 50} />

      <IntroSection vs={vs} />

      <ExperienceSection openSection={openSection} lockClose={lockClose} vs={vs} />
      <EducationSection openSection={openSection} lockClose={lockClose} vs={vs} />
      <SkillsSection openSection={openSection} lockClose={lockClose} vs={vs} />
      <ContactSection openSection={openSection} vs={vs} />
    </>
  )
}
