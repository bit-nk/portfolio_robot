import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

// Procedural hex grid floor
export default function HexGrid() {
  const ref = useRef()

  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry()
    const vertices = []
    const radius = 0.5
    const gap = 0.08
    const cols = 40
    const rows = 20

    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const x = (col - cols / 2) * (radius * 1.75 + gap)
        const z = (row - rows / 2) * (radius * 1.5 + gap) + (col % 2 === 0 ? 0 : radius * 0.75)

        // Draw hex outline (6 line segments)
        for (let i = 0; i < 6; i++) {
          const angle1 = (Math.PI / 3) * i
          const angle2 = (Math.PI / 3) * ((i + 1) % 6)
          vertices.push(
            x + Math.cos(angle1) * radius, 0, z + Math.sin(angle1) * radius,
            x + Math.cos(angle2) * radius, 0, z + Math.sin(angle2) * radius,
          )
        }
      }
    }

    geo.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3))
    return geo
  }, [])

  useFrame(({ camera }) => {
    if (!ref.current) return
    // Subtle pulse based on camera distance
    const dist = camera.position.length()
    ref.current.material.opacity = THREE.MathUtils.lerp(0.08, 0.2, 1 - dist / 20)
  })

  return (
    <lineSegments ref={ref} geometry={geometry} position={[0, -0.5, 0]}>
      <lineBasicMaterial color="#818cf8" transparent opacity={0.12} />
    </lineSegments>
  )
}
