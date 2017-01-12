import { add, subtract, length, normalize, scale } from 'gl-vec2'
import { result } from '../lib/helpers'

// export default {
//   addSpringForce,
//   updateObj
// }

export function addSpringForce (obj, property, anchor, stiffness, dampening) {
  const val = obj[property]
  anchor = result(anchor, obj)
  stiffness = result(stiffness, obj)
  dampening = result(dampening, obj)

  // scalar
  if (Number.isFinite(val) && Number.isFinite(anchor)) {
    return addSpringForceScalar(obj, property, anchor, stiffness, dampening)
  }

  // vec2
  if (isVec2(val) && isVec2(anchor)) {
    return addSpringForceVec2(obj, property, anchor, stiffness, dampening)
  }
  const fmt = JSON.stringify
  throw new Error(
    `Cannot animate property ${fmt(property)} with value ${fmt(val)} to anchor ${fmt(anchor)}`
  )
}

function isVec2 (vec) {
  return (
    Array.isArray(vec) &&
    vec.length === 2 &&
    Number.isFinite(vec[0]) &&
    Number.isFinite(vec[1])
  )
}

function addSpringForceScalar (obj, property, anchor, stiffness, dampening) {
  const val = obj[property]
  const velocityProp = `${property}Vel`
  let velocity = obj[velocityProp] || 0
  const x = val - anchor
  const spring = -stiffness * x
  const damper = velocity * -dampening
  obj[velocityProp] = velocity + spring + damper
  return obj
}

function addSpringForceVec2 (obj, property, anchor, stiffness, dampening) {
  const val = obj[property]
  const velocityProp = `${property}Vel`
  let velocity = obj[velocityProp] || [0, 0]
  const dir = subtract([], val, anchor)
  const x = length(dir)
  let spring = normalize([], dir)
  spring = scale(spring, spring, x * -stiffness)
  const damper = scale([], velocity, -dampening)
  velocity = add(velocity, velocity, spring)
  velocity = add(velocity, velocity, damper)
  obj[velocityProp] = velocity
  return obj
}

export function updateObj (ctx, obj, properties) {
  properties.forEach((prop) => {
    const velocity = obj[`${prop}Vel`]
    if (!velocity) return
    if (isVec2(obj[prop]) && isVec2(velocity)) {
      obj[prop] = add(obj[prop], obj[prop], velocity)
      return
    }
    if (Number.isFinite(obj[prop]) && Number.isFinite(velocity)) {
      obj[prop] = obj[prop] + velocity
      return
    }
  })
  return obj
}
