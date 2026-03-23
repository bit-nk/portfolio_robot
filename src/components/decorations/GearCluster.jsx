import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'

function Gear({ position, radius = 1, tubeRadius = 0.05, speed = 0.5, color = '#c4c4cc' }) {
  const ref = useRef()

  useFrame(({ clock }) => {
    if (ref.current) ref.current.rotation.z = clock.getElapsedTime() * speed
  })

  return (
    <mesh ref={ref} position={position}>
      <torusGeometry args={[radius, tubeRadius, 8, 32]} />
      <meshStandardMaterial color={color} metalness={0.8} roughness={0.2} />
    </mesh>
  )
}

export default function GearCluster({ position = [0, 0, 0] }) {
  return (
    <group position={position}>
      <Gear position={[0, 0, 0]} radius={1.2} speed={0.3} />
      <Gear position={[2, 0.5, -0.5]} radius={0.8} speed={-0.45} />
      <Gear position={[-1.5, -0.8, 0.3]} radius={0.6} speed={0.6} />
      <Gear position={[0.8, 1.5, -0.3]} radius={0.5} speed={-0.7} color="#a5a5b0" />
    </group>
  )
}
