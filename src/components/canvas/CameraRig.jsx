import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

// Desktop (vw=1) and mobile (vw=0) targets — everything in between is interpolated
const D = {
  default: { pos: [0, 3, 12], look: [0, 1.5, 0] },
  experience: { pos: [6, 2.5, 6], look: [5.5, 2, 1.5] },
  education: { pos: [-6, 2.5, 7], look: [-5.5, 2, 2.5] },
  skills: { pos: [3, 1, 8], look: [2, 0.5, 4] },
  contact: { pos: [-3, 1.5, 10], look: [-3, 1, 6] },
}

const M = {
  default: { pos: [0, 3, 12], look: [0, 1.5, 2] },
  experience: { pos: [1, 4, 9], look: [1, 4, 4] },
  education: { pos: [-1, 4, 9], look: [-1, 4, 4] },
  skills: { pos: [1, 2.5, 10], look: [1, 2, 5] },
  contact: { pos: [-1, 2.5, 10], look: [-1, 2, 6] },
}

function lerpArr(a, b, t) {
  return [
    a[0] + (b[0] - a[0]) * t,
    a[1] + (b[1] - a[1]) * t,
    a[2] + (b[2] - a[2]) * t,
  ]
}

const HOVER_BLEND = 0.1
const _smoothPos = new THREE.Vector3(0, 3, 12)
const _smoothLook = new THREE.Vector3(0, 1.5, 0)
const _targetPos = new THREE.Vector3()
const _targetLook = new THREE.Vector3()

export default function CameraRig({ mouseParallax, hoveredSection, openSection, vs }) {
  useFrame(({ camera }) => {
    const mx = mouseParallax.current.x
    const my = mouseParallax.current.y
    const hovered = hoveredSection.current
    const t = vs.vw // 0 = mobile, 1 = desktop

    // Interpolate between mobile and desktop targets based on viewport width
    function getTarget(section) {
      const mTarget = M[section] || M.default
      const dTarget = D[section] || D.default
      return {
        pos: lerpArr(mTarget.pos, dTarget.pos, t),
        look: lerpArr(mTarget.look, dTarget.look, t),
      }
    }

    let target
    if (openSection && (D[openSection] || M[openSection])) {
      target = getTarget(openSection)
    } else if (hovered !== 'none' && (D[hovered] || M[hovered])) {
      const def = getTarget('default')
      const sec = getTarget(hovered)
      target = {
        pos: lerpArr(def.pos, sec.pos, HOVER_BLEND),
        look: lerpArr(def.look, sec.look, HOVER_BLEND),
      }
    } else {
      target = getTarget('default')
    }

    // Mouse parallax — scales with viewport
    const isDefault = !openSection && hovered === 'none'
    const parallaxScale = 0.4 + t * 0.6 // 0.4 on mobile, 1.0 on desktop
    _targetPos.set(
      target.pos[0] + mx * (isDefault ? 1.5 : 0.3) * parallaxScale,
      target.pos[1] + -my * (isDefault ? 0.8 : 0.2) * parallaxScale,
      target.pos[2]
    )
    _targetLook.set(target.look[0], target.look[1], target.look[2])

    const speed = isDefault ? 0.03 : 0.025
    _smoothPos.lerp(_targetPos, speed)
    _smoothLook.lerp(_targetLook, speed)

    camera.position.copy(_smoothPos)
    camera.lookAt(_smoothLook)

    // Dynamically update FOV based on viewport
    const targetFov = 65 - t * 15 // 65 on mobile, 50 on desktop
    if (Math.abs(camera.fov - targetFov) > 0.5) {
      camera.fov = THREE.MathUtils.lerp(camera.fov, targetFov, 0.05)
      camera.updateProjectionMatrix()
    }
  })

  return null
}
