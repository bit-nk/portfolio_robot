import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

export default function Particles({ count = 600 }) {
  const ref = useRef()

  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 40
      arr[i * 3 + 1] = Math.random() * 8
      arr[i * 3 + 2] = (Math.random() - 0.5) * 40
    }
    return arr
  }, [count])

  useFrame(({ clock }) => {
    if (!ref.current) return
    const t = clock.getElapsedTime()
    const posArr = ref.current.geometry.attributes.position.array
    for (let i = 0; i < count; i++) {
      // Slow upward drift + sine wobble
      posArr[i * 3 + 1] += 0.002
      posArr[i * 3] += Math.sin(t * 0.3 + i) * 0.0005

      // Reset particles that drift too high
      if (posArr[i * 3 + 1] > 8) posArr[i * 3 + 1] = 0
    }
    ref.current.geometry.attributes.position.needsUpdate = true
  })

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.04}
        color="#00f0ff"
        transparent
        opacity={0.3}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  )
}
