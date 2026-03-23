import { useRef, useMemo } from 'react'
import { useFrame, extend } from '@react-three/fiber'
import * as THREE from 'three'

export default function CircuitLines({ position = [0, 0, 0], color = '#818cf8' }) {
  const ref = useRef()

  const geometries = useMemo(() => {
    const geos = []
    for (let i = 0; i < 8; i++) {
      const pts = []
      let x = (Math.random() - 0.5) * 6
      let y = Math.random() * 4
      let z = (Math.random() - 0.5) * 2
      pts.push(new THREE.Vector3(x, y, z))

      for (let j = 0; j < 4; j++) {
        const axis = Math.floor(Math.random() * 3)
        const dist = (Math.random() - 0.5) * 3
        if (axis === 0) x += dist
        else if (axis === 1) y += dist * 0.5
        else z += dist * 0.3
        pts.push(new THREE.Vector3(x, y, z))
      }

      const geo = new THREE.BufferGeometry().setFromPoints(pts)
      geos.push(geo)
    }
    return geos
  }, [])

  useFrame(({ clock }) => {
    if (!ref.current) return
    ref.current.children.forEach((child, i) => {
      if (child.material) {
        child.material.dashOffset = -clock.getElapsedTime() * 0.5 * (i % 2 === 0 ? 1 : -1)
      }
    })
  })

  return (
    <group ref={ref} position={position}>
      {geometries.map((geo, i) => (
        <lineSegments key={i} geometry={geo}>
          <lineBasicMaterial
            color={color}
            transparent
            opacity={0.2}
          />
        </lineSegments>
      ))}
    </group>
  )
}
