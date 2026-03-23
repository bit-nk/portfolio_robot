import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

export default function Robot({ position = [0, 0, 0], mouseParallax, hoveredSection, vs }) {
  const headRef = useRef()
  const leftEyeRef = useRef()
  const rightEyeRef = useRef()
  const antennaRef = useRef()
  const antennaBallRef = useRef()

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    const mx = mouseParallax.current.x
    const my = mouseParallax.current.y
    const hovered = hoveredSection.current !== 'none'

    // ── Head tracks mouse ──
    if (headRef.current) {
      headRef.current.rotation.y = THREE.MathUtils.lerp(headRef.current.rotation.y, mx * 0.4, 0.04)
      headRef.current.rotation.x = THREE.MathUtils.lerp(headRef.current.rotation.x, my * 0.15, 0.04)
      headRef.current.rotation.z = THREE.MathUtils.lerp(headRef.current.rotation.z, mx * -0.06, 0.03)
    }

    // ── Eyes glow on hover — traverse all pixel meshes ──
    const eyeGlow = hovered ? 5 : 3
    ;[leftEyeRef, rightEyeRef].forEach((ref) => {
      if (ref.current) {
        ref.current.traverse((child) => {
          if (child.material && child.material.emissiveIntensity !== undefined) {
            child.material.emissiveIntensity = THREE.MathUtils.lerp(
              child.material.emissiveIntensity, eyeGlow, 0.06
            )
          }
        })
      }
    })

    // ── Antenna sway ──
    if (antennaRef.current) {
      antennaRef.current.rotation.z = Math.sin(t * 1.2) * 0.15
      antennaRef.current.rotation.x = Math.sin(t * 0.8) * 0.08
    }

    // ── Antenna ball pulse ──
    if (antennaBallRef.current) {
      antennaBallRef.current.material.emissiveIntensity = 2 + Math.sin(t * 2) * 0.8
    }
  })

  const white = { color: '#e8e8ec', metalness: 0.05, roughness: 0.6 }
  const shiny = { color: '#f0f0f2', metalness: 0.08, roughness: 0.45 }
  const dark = { color: '#2d2d35', metalness: 0.1, roughness: 0.5 }
  const blue = { color: '#2563eb', metalness: 0.08, roughness: 0.5 }

  return (
    <group position={position} scale={3.8 + vs.vw * 0.7}>

      {/* ════════════ BODY ════════════ */}
      {/* Main torso — rounded, Astro Bot style */}
      <mesh position={[0, -0.15, 0]}>
        <capsuleGeometry args={[0.5, 0.4, 20, 32]} />
        <meshStandardMaterial {...shiny} />
      </mesh>

      {/* Blue chest accent (V-shape like Astro) */}
      <mesh position={[0, 0.05, 0.48]}>
        <circleGeometry args={[0.18, 3]} />
        <meshStandardMaterial {...blue} />
      </mesh>

      {/* Blue side panels */}
      {[-1, 1].map((side, i) => (
        <mesh key={i} position={[side * 0.35, -0.1, 0.25]} rotation={[0, side * -0.5, 0]}>
          <boxGeometry args={[0.2, 0.35, 0.02]} />
          <meshStandardMaterial {...blue} />
        </mesh>
      ))}

      {/* Waist seam */}
      <mesh position={[0, -0.4, 0]}>
        <torusGeometry args={[0.38, 0.015, 12, 32]} rotation={[Math.PI / 2, 0, 0]} />
        <meshStandardMaterial {...dark} />
      </mesh>

      {/* Lower body hint (fades into bottom of screen) */}
      <mesh position={[0, -0.65, 0]}>
        <capsuleGeometry args={[0.32, 0.25, 12, 24]} />
        <meshStandardMaterial {...shiny} />
      </mesh>

      {/* ════════════ NECK ════════════ */}
      <mesh position={[0, 0.42, 0]}>
        <cylinderGeometry args={[0.1, 0.14, 0.1, 16]} />
        <meshStandardMaterial {...dark} />
      </mesh>

      {/* ════════════ HEAD (Astro Bot style — large visor face) ════════════ */}
      <group ref={headRef} position={[0, 0.72, 0]}>

        {/* Main head — rounded rectangle feel */}
        <mesh>
          <sphereGeometry args={[0.4, 32, 32]} />
          <meshStandardMaterial {...shiny} />
        </mesh>

        {/* Head top bump */}
        <mesh position={[0, 0.22, -0.08]}>
          <sphereGeometry args={[0.25, 24, 24, 0, Math.PI * 2, 0, Math.PI * 0.5]} />
          <meshStandardMaterial {...shiny} />
        </mesh>

        {/* ── Visor — large dark curved face screen ── */}
        {/* Main visor shape — large, taking up most of the front face */}
        <mesh position={[0, -0.02, 0.15]}>
          <sphereGeometry args={[0.35, 32, 32, 0.8, 1.55, 0.4, 1.8]} />
          <meshStandardMaterial
            color="#020208"
            metalness={0.05}
            roughness={0.3}
            side={THREE.DoubleSide}
          />
        </mesh>

        {/* Visor rim — glowing blue edge */}
        <mesh position={[0, -0.02, 0.18]}>
          <torusGeometry args={[0.28, 0.012, 16, 32]} />
          <meshStandardMaterial
            color="#38bdf8"
            emissive="#38bdf8"
            emissiveIntensity={0.6}
            toneMapped={false}
          />
        </mesh>

        {/* ── Happy Eyes — large pixelated ^_^ on the visor ── */}
        {/* Built from small cube "pixels" to look like an LED screen */}

        {/* ── Happy Eyes — large pixelated ^_^ ── */}
        {/* Pixel size */}
        {(() => {
          const px = 0.028 // pixel size
          const g = 0.002  // gap between pixels
          const s = px + g  // step
          const eyeMat = { color: '#60a5fa', emissive: '#3b82f6', emissiveIntensity: 5, toneMapped: false }
          const eyeZ = 0.38 // far forward, clearly in front of visor

          // Arc pattern for ^_^ eye (each row is array of x-offsets in pixel units)
          const arcPattern = [
            { y: -1, pixels: [-2, -1, 0, 1, 2] },         // bottom flat
            { y: 0, pixels: [-3, -2, 2, 3] },              // sides go up
            { y: 1, pixels: [-3, 3] },                      // tips
            { y: 2, pixels: [-3, 3] },                      // top tips
          ]

          return ['left', 'right'].map((side) => (
            <group key={side} ref={side === 'left' ? leftEyeRef : rightEyeRef} position={[side === 'left' ? -0.12 : 0.12, -0.01, eyeZ]}>
              {arcPattern.map((row) =>
                row.pixels.map((px_x, i) => (
                  <mesh key={`${row.y}-${i}`} position={[px_x * s, row.y * s, 0]}>
                    <boxGeometry args={[px, px, 0.012]} />
                    <meshStandardMaterial {...eyeMat} />
                  </mesh>
                ))
              )}
              {/* Glow behind */}
              <mesh position={[0, 0.01, -0.02]}>
                <circleGeometry args={[0.12, 24]} />
                <meshStandardMaterial color="#3b82f6" emissive="#3b82f6" emissiveIntensity={2} transparent opacity={0.15} toneMapped={false} />
              </mesh>
            </group>
          ))
        })()}

        {/* ── Antenna ── */}
        <group ref={antennaRef} position={[0, 0.38, -0.05]}>
          {/* Antenna wire — curved */}
          <mesh position={[0, 0.12, 0.03]}>
            <cylinderGeometry args={[0.008, 0.008, 0.25, 8]} />
            <meshStandardMaterial color="#a1a1aa" metalness={0.7} roughness={0.2} />
          </mesh>
          {/* Antenna ball */}
          <mesh ref={antennaBallRef} position={[0, 0.26, 0.03]}>
            <sphereGeometry args={[0.04, 16, 16]} />
            <meshStandardMaterial
              color="#22d3ee"
              emissive="#06b6d4"
              emissiveIntensity={2}
              toneMapped={false}
            />
          </mesh>
        </group>

        {/* ── Ear fins (blue, like Astro Bot) ── */}
        {[-1, 1].map((side, i) => (
          <group key={i} position={[side * 0.38, 0.05, -0.05]}>
            {/* Fin shape */}
            <mesh rotation={[0.2, side * 0.3, side * 0.2]}>
              <boxGeometry args={[0.08, 0.18, 0.12]} />
              <meshStandardMaterial {...blue} />
            </mesh>
            {/* Fin edge glow */}
            <mesh position={[side * 0.03, 0, 0.06]} rotation={[0.2, side * 0.3, side * 0.2]}>
              <boxGeometry args={[0.02, 0.16, 0.01]} />
              <meshStandardMaterial
                color="#38bdf8"
                emissive="#38bdf8"
                emissiveIntensity={0.8}
                toneMapped={false}
              />
            </mesh>
          </group>
        ))}
      </group>

      {/* ════════════ ARMS (seamless joints) ════════════ */}
      {[-1, 1].map((side, i) => (
        <group key={i} position={[side * 0.5, 0.15, 0]} rotation={[0, 0, side * 0.12]}>
          {/* Shoulder ball — overlaps with body */}
          <mesh position={[side * 0.04, 0.02, 0]}>
            <sphereGeometry args={[0.1, 16, 16]} />
            <meshStandardMaterial {...shiny} />
          </mesh>
          {/* Shoulder accent ring */}
          <mesh position={[side * 0.04, 0.02, 0]} rotation={[0, 0, side * 0.2]}>
            <torusGeometry args={[0.08, 0.008, 12, 24]} rotation={[Math.PI / 2, 0, 0]} />
            <meshStandardMaterial {...blue} />
          </mesh>

          {/* Upper arm — overlaps shoulder ball */}
          <mesh position={[side * 0.04, -0.14, 0]}>
            <capsuleGeometry args={[0.065, 0.18, 8, 16]} />
            <meshStandardMaterial {...shiny} />
          </mesh>
          {/* Upper arm detail strip */}
          <mesh position={[side * 0.04, -0.14, 0.06]}>
            <boxGeometry args={[0.03, 0.16, 0.01]} />
            <meshStandardMaterial {...blue} />
          </mesh>

          {/* Elbow joint — overlaps both arm segments */}
          <mesh position={[side * 0.04, -0.3, 0]}>
            <sphereGeometry args={[0.065, 16, 16]} />
            <meshStandardMaterial {...dark} />
          </mesh>
          {/* Elbow accent */}
          <mesh position={[side * 0.04, -0.3, 0]}>
            <torusGeometry args={[0.05, 0.006, 8, 16]} rotation={[Math.PI / 2, 0, 0]} />
            <meshStandardMaterial color="#38bdf8" emissive="#38bdf8" emissiveIntensity={0.4} toneMapped={false} />
          </mesh>

          {/* Forearm — overlaps elbow */}
          <mesh position={[side * 0.04, -0.46, 0]}>
            <capsuleGeometry args={[0.055, 0.2, 8, 16]} />
            <meshStandardMaterial {...shiny} />
          </mesh>
          {/* Forearm detail strip */}
          <mesh position={[side * 0.04, -0.46, 0.05]}>
            <boxGeometry args={[0.025, 0.15, 0.01]} />
            <meshStandardMaterial {...dark} />
          </mesh>

          {/* Wrist joint */}
          <mesh position={[side * 0.04, -0.6, 0]}>
            <sphereGeometry args={[0.05, 12, 12]} />
            <meshStandardMaterial {...dark} />
          </mesh>

          {/* Hand */}
          <mesh position={[side * 0.04, -0.68, 0]}>
            <sphereGeometry args={[0.055, 16, 16]} />
            <meshStandardMaterial {...blue} />
          </mesh>
          {/* Finger hints */}
          {[-1, 0, 1].map((f, fi) => (
            <mesh key={fi} position={[side * 0.04 + f * 0.02, -0.74, 0.02]}>
              <capsuleGeometry args={[0.012, 0.03, 4, 8]} />
              <meshStandardMaterial {...blue} />
            </mesh>
          ))}
        </group>
      ))}

    </group>
  )
}
