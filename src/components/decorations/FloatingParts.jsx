import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

const PART_TYPES = ['bolt', 'nut', 'screw', 'gear', 'spring']

function randomInRange(min, max) {
  return min + Math.random() * (max - min)
}

function BoltPart({ color }) {
  return (
    <group>
      <mesh>
        <cylinderGeometry args={[0.03, 0.03, 0.12, 6]} />
        <meshStandardMaterial color={color} metalness={0.7} roughness={0.3} />
      </mesh>
      <mesh position={[0, 0.08, 0]}>
        <cylinderGeometry args={[0.05, 0.05, 0.04, 6]} />
        <meshStandardMaterial color={color} metalness={0.7} roughness={0.3} />
      </mesh>
    </group>
  )
}

function NutPart({ color }) {
  return (
    <mesh>
      <torusGeometry args={[0.07, 0.025, 6, 6]} />
      <meshStandardMaterial color={color} metalness={0.7} roughness={0.3} />
    </mesh>
  )
}

function ScrewPart({ color }) {
  return (
    <group>
      <mesh>
        <cylinderGeometry args={[0.03, 0.015, 0.2, 8]} />
        <meshStandardMaterial color={color} metalness={0.7} roughness={0.3} />
      </mesh>
      <mesh position={[0, 0.12, 0]}>
        <sphereGeometry args={[0.045, 8, 8]} />
        <meshStandardMaterial color={color} metalness={0.7} roughness={0.3} />
      </mesh>
    </group>
  )
}

function GearPart({ color }) {
  return (
    <mesh>
      <torusGeometry args={[0.08, 0.02, 4, 8]} />
      <meshStandardMaterial color={color} metalness={0.8} roughness={0.2} />
    </mesh>
  )
}

function SpringPart({ color }) {
  return (
    <mesh>
      <torusGeometry args={[0.06, 0.015, 8, 16]} />
      <meshStandardMaterial color={color} metalness={0.6} roughness={0.3} />
    </mesh>
  )
}

const PART_COMPONENTS = { bolt: BoltPart, nut: NutPart, screw: ScrewPart, gear: GearPart, spring: SpringPart }

function FloatingPart({ type, startPos, bounds }) {
  const groupRef = useRef()
  const velocity = useRef(new THREE.Vector3(
    randomInRange(-0.003, 0.003),
    randomInRange(-0.002, 0.002),
    randomInRange(-0.002, 0.002)
  ))
  const rotSpeed = useRef(new THREE.Vector3(
    randomInRange(-0.02, 0.02),
    randomInRange(-0.02, 0.02),
    randomInRange(-0.02, 0.02)
  ))
  const fleeing = useRef(false)
  const fleeVel = useRef(new THREE.Vector3())
  const fleeTimer = useRef(0)

  const PartComponent = PART_COMPONENTS[type]
  const color = useMemo(() => {
    const colors = ['#a1a1aa', '#b4b4bc', '#c0c0c8', '#d4d4d8', '#9898a0']
    return colors[Math.floor(Math.random() * colors.length)]
  }, [])

  useFrame((_, delta) => {
    if (!groupRef.current) return
    const pos = groupRef.current.position

    // Flee decay
    if (fleeing.current) {
      fleeTimer.current -= delta
      if (fleeTimer.current <= 0) {
        fleeing.current = false
      } else {
        // Apply flee velocity with decay
        const decay = fleeTimer.current / 0.8
        pos.x += fleeVel.current.x * decay * delta * 60
        pos.y += fleeVel.current.y * decay * delta * 60
        pos.z += fleeVel.current.z * decay * delta * 60
      }
    }

    // Normal drift
    pos.x += velocity.current.x
    pos.y += velocity.current.y
    pos.z += velocity.current.z

    // Bounce off bounds
    if (pos.x < bounds.minX || pos.x > bounds.maxX) {
      velocity.current.x *= -1
      pos.x = THREE.MathUtils.clamp(pos.x, bounds.minX, bounds.maxX)
    }
    if (pos.y < bounds.minY || pos.y > bounds.maxY) {
      velocity.current.y *= -1
      pos.y = THREE.MathUtils.clamp(pos.y, bounds.minY, bounds.maxY)
    }
    if (pos.z < bounds.minZ || pos.z > bounds.maxZ) {
      velocity.current.z *= -1
      pos.z = THREE.MathUtils.clamp(pos.z, bounds.minZ, bounds.maxZ)
    }

    // Rotation
    groupRef.current.rotation.x += rotSpeed.current.x
    groupRef.current.rotation.y += rotSpeed.current.y
    groupRef.current.rotation.z += rotSpeed.current.z
  })

  function onInteract(e) {
    e.stopPropagation()
    if (!groupRef.current) return

    // Calculate flee direction — away from pointer
    const pos = groupRef.current.position
    const dir = new THREE.Vector3()
    dir.copy(pos).sub(e.point).normalize()

    // Add some randomness
    dir.x += randomInRange(-0.3, 0.3)
    dir.y += randomInRange(-0.2, 0.2)
    dir.z += randomInRange(-0.2, 0.2)
    dir.normalize()

    fleeVel.current.copy(dir).multiplyScalar(0.08)
    fleeing.current = true
    fleeTimer.current = 0.8

    // Also change drift direction
    velocity.current.set(
      randomInRange(-0.004, 0.004),
      randomInRange(-0.003, 0.003),
      randomInRange(-0.003, 0.003)
    )
  }

  return (
    <group
      ref={groupRef}
      position={startPos}
      onPointerEnter={onInteract}
      onClick={onInteract}
    >
      <PartComponent color={color} />
      {/* Invisible hitbox for easier interaction */}
      <mesh visible={false}>
        <sphereGeometry args={[0.12, 8, 8]} />
        <meshBasicMaterial />
      </mesh>
    </group>
  )
}

export default function FloatingParts({ count = 15, isMobile }) {
  const parts = useMemo(() => {
    const n = isMobile ? Math.floor(count * 0.6) : count
    return Array.from({ length: n }).map((_, i) => ({
      id: i,
      type: PART_TYPES[i % PART_TYPES.length],
      startPos: [
        randomInRange(isMobile ? -3 : -6, isMobile ? 3 : 6),
        randomInRange(0.5, 4.5),
        randomInRange(0, 9),
      ],
    }))
  }, [count, isMobile])

  const bounds = useMemo(() => ({
    minX: isMobile ? -3 : -7,
    maxX: isMobile ? 3 : 7,
    minY: 0,
    maxY: 5,
    minZ: 0,
    maxZ: 10,
  }), [isMobile])

  return (
    <group>
      {parts.map((p) => (
        <FloatingPart
          key={p.id}
          type={p.type}
          startPos={p.startPos}
          bounds={bounds}
        />
      ))}
    </group>
  )
}
