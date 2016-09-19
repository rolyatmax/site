import { distance, add, subtract, scale } from 'gl-vec2'

const { requestAnimationFrame } = window

export function drawArc (ctx, arc, color, width) {
  ctx.beginPath()
  ctx.strokeStyle = color
  ctx.lineWidth = width
  ctx.moveTo(...arc[0])
  arc.slice(1).forEach(pt => ctx.lineTo(...pt))
  ctx.stroke()
}

export function cutArc (arc, perc) {
  let last = arc[0]
  let toGo = getArcDist(arc) * perc
  let toDraw = [last]
  for (let i = 1, len = arc.length; i < len; i++) {
    let pt = arc[i]
    let segmentDist = distance(last, pt)
    if (!segmentDist) {
      continue
    }
    if (toGo === 0) {
      break
    }
    if (segmentDist <= toGo) {
      toDraw.push(pt)
      toGo -= segmentDist
      last = pt
      continue
    }
    let cutPerc = toGo / segmentDist
    let diff = subtract([], pt, last)
    diff = scale(diff, diff, cutPerc)
    let cutLine = add([], diff, last)
    toDraw.push(cutLine)
    break
  }
  return toDraw
}

function getArcDist (arc) {
  let last = arc[0]
  return arc.reduce((total, pt) => {
    total += distance(last, pt)
    last = pt
    return total
  }, 0)
}

export function easeIn (step, start, change) {
  return change * (1 - Math.pow(1 - step, 3)) + start
}

export function startAnimation (renderFn, duration) {
  var startTime
  return new Promise(function (resolve) {
    function _render (t) {
      startTime = startTime || t
      var step = (t - startTime) / duration
      renderFn(step)
      if (step < 1) {
        requestAnimationFrame(_render)
      } else {
        resolve()
      }
    }
    requestAnimationFrame(_render)
  })
}
