import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

const D = {
  default: { pos: [0, 3, 12], look: [0, 1.5, 0] },
  experience: { pos: [6, 2.5, 6], look: [5.5, 2, 1.5] },
  education: { pos: [-6, 2.5, 7], look: [-5.5, 2, 2.5] },
  skills: { pos: [3, 1, 8], look: [2, 0.5, 4] },
  contact: { pos: [-3, 3.8, 10], look: [-3, 3.3, 6] },
}

const M = {
  default: { pos: [0, 3, 12], look: [0, 1.5, 2] },
  experience: { pos: [1, 3, 9], look: [1, 2.5, 4] },
  education: { pos: [-1, 3, 9], look: [-1, 2.5, 4] },
  skills: { pos: [1, 1.5, 10], look: [1, 1, 5] },
  contact: { pos: [-1, 2.5, 10], look: [-1, 2, 6] },
}

function lerpArr(a, b, t) {
  return [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t]
}

const _smoothPos = new THREE.Vector3(0, 3, 12)
const _smoothLook = new THREE.Vector3(0, 1.5, 0)
const _targetPos = new THREE.Vector3()
const _targetLook = new THREE.Vector3()

// Frame-rate independent damping: ensures same visual speed at 30fps and 144fps
function damp(current, target, smoothTime, delta) {
  const factor = 1 - Math.exp(-smoothTime * delta)
  current.lerp(target, factor)
}

export default function CameraRig({ mouseParallax, openSection, vs }) {
  useFrame(({ camera }, delta) => {
    const mx = mouseParallax.current.x
    const my = mouseParallax.current.y
    const t = vs.vw

    const section = openSection && (D[openSection] || M[openSection]) ? openSection : 'default'
    const mTarget = M[section] || M.default
    const dTarget = D[section] || D.default
    const pos = lerpArr(mTarget.pos, dTarget.pos, t)
    const look = lerpArr(mTarget.look, dTarget.look, t)

    const isDefault = section === 'default'
    const parallaxScale = 0.4 + t * 0.6
    _targetPos.set(
      pos[0] + mx * (isDefault ? 1.5 : 0.3) * parallaxScale,
      pos[1] + -my * (isDefault ? 0.8 : 0.2) * parallaxScale,
      pos[2]
    )
    _targetLook.set(look[0], look[1], look[2])

    // Smooth damping — frame-rate independent, feels like 120fps
    const smoothTime = isDefault ? 6 : 8
    damp(_smoothPos, _targetPos, smoothTime, delta)
    damp(_smoothLook, _targetLook, smoothTime, delta)

    camera.position.copy(_smoothPos)
    camera.lookAt(_smoothLook)

    const targetFov = 65 - t * 15
    if (Math.abs(camera.fov - targetFov) > 0.5) {
      camera.fov += (targetFov - camera.fov) * (1 - Math.exp(-5 * delta))
      camera.updateProjectionMatrix()
    }
  })

  return null
}
