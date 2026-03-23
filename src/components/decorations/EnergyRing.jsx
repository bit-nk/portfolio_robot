import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'

export default function EnergyRing({ position = [0, 0, 0], radius = 2, color = '#818cf8', speed = 0.4 }) {
  const ref = useRef()

  useFrame(({ clock }) => {
    if (!ref.current) return
    const t = clock.getElapsedTime()
    ref.current.rotation.x = t * speed
    ref.current.rotation.y = t * speed * 0.6
  })

  return (
    <mesh ref={ref} position={position}>
      <torusGeometry args={[radius, 0.02, 16, 64]} />
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={2}
        transparent
        opacity={0.6}
        toneMapped={false}
      />
    </mesh>
  )
}
