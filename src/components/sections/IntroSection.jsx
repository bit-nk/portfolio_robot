import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Text, Float } from '@react-three/drei'

function lerp(a, b, t) { return a + (b - a) * t }

export default function IntroSection({ vs }) {
  const ringRef = useRef()
  const t = vs.vw

  useFrame(({ clock }) => {
    if (ringRef.current) {
      ringRef.current.rotation.z = clock.getElapsedTime() * 0.1
    }
  })

  return (
    <group position={[0, lerp(4.5, 4.2, t), 2]}>
      <Float speed={1.2} rotationIntensity={0.03} floatIntensity={0.15}>
        <Text
          fontSize={lerp(0.4, 0.6, t)}
          color="#1e293b"
          anchorX="center"
          anchorY="middle"
          letterSpacing={0.08}
        >
          NIRVIK KC
        </Text>
        <Text
          fontSize={lerp(0.12, 0.18, t)}
          color="#94a3b8"
          anchorX="center"
          anchorY="middle"
          position={[0, lerp(-0.3, -0.45, t), 0]}
          letterSpacing={0.2}
        >
          SOFTWARE ENGINEER
        </Text>
      </Float>

      <mesh ref={ringRef} rotation={[Math.PI / 2, 0, 0]} position={[0, -0.15, 0]}>
        <torusGeometry args={[lerp(0.9, 1.4, t), 0.008, 16, 128]} />
        <meshStandardMaterial
          color="#818cf8"
          emissive="#818cf8"
          emissiveIntensity={2}
          transparent
          opacity={0.35}
          toneMapped={false}
        />
      </mesh>
    </group>
  )
}
