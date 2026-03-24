import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Html, Float } from '@react-three/drei'

function lerp(a, b, t) { return a + (b - a) * t }

export default function IntroSection({ vs }) {
  const ringRef = useRef()
  const ring2Ref = useRef()
  const t = vs.vw

  useFrame(({ clock }) => {
    const time = clock.getElapsedTime()
    if (ringRef.current) ringRef.current.rotation.z = time * 0.1
    if (ring2Ref.current) ring2Ref.current.rotation.z = -time * 0.08
  })

  return (
    <group position={[0, lerp(5.2, 5, t), 2]}>
      <Float speed={1.2} rotationIntensity={0.03} floatIntensity={0.15}>
        <Html transform distanceFactor={lerp(2.2, 2, t)} center>
          <div className="intro-title-card">
            <div className="intro-name">NIRVIK KC</div>
            <div className="intro-divider"></div>
            <div className="intro-role">SOFTWARE ENGINEER</div>
          </div>
        </Html>
      </Float>

      {/* Decorative rings */}
      <mesh ref={ringRef} rotation={[Math.PI / 2, 0, 0]} position={[0, -0.3, 0]}>
        <torusGeometry args={[lerp(1.2, 1.8, t), 0.01, 16, 128]} />
        <meshStandardMaterial color="#818cf8" emissive="#818cf8" emissiveIntensity={2} transparent opacity={0.35} toneMapped={false} />
      </mesh>
      <mesh ref={ring2Ref} rotation={[Math.PI / 2, 0, 0.4]} position={[0, -0.3, 0]}>
        <torusGeometry args={[lerp(1.5, 2.2, t), 0.006, 16, 128]} />
        <meshStandardMaterial color="#06b6d4" emissive="#06b6d4" emissiveIntensity={1.5} transparent opacity={0.2} toneMapped={false} />
      </mesh>
    </group>
  )
}
