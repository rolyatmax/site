import { distance, add, subtract, scale } from 'gl-vec2'
import { easeIn, startAnimation, setTimeoutPromise } from '../helpers'

const margin = 40
const color = 'rgb(180, 180, 180)'
const width = 1
const duration = 2200

export default function () {
  return { start, stop }

  function start (ctx) {
    return startAnimation((step) => {
      ctx.clear()
      const perc = easeIn(step, 0, 1)

      const start = [margin, margin]
      const end = [ctx.width - margin, ctx.height - margin]
      const arcs = [
        [start, [margin, ctx.height - margin], end],
        [start, [ctx.width - margin, margin], end]
      ]

      drawArc(ctx, cutArc(arcs[0], perc), color, width)
      drawArc(ctx, cutArc(arcs[1], perc), color, width)
    }, duration).then(() => setTimeoutPromise(1000))
  }

  function stop (ctx) {
    return finish(ctx)
  }

  function finish (ctx) {
    return startAnimation((step) => {
      ctx.clear()
      const start = [margin, margin]
      const end = [ctx.width - margin, ctx.height - margin]
      const perc = easeIn(step, 0, 1)

      const arcs = [
        [start, [margin, ctx.height - margin], end].reverse(),
        [start, [ctx.width - margin, margin], end].reverse()
      ]

      drawArc(ctx, cutArc(arcs[0], 1 - perc), color, width)
      drawArc(ctx, cutArc(arcs[1], 1 - perc), color, width)
    }, duration)
  }
}

function drawArc (ctx, arc, color, width) {
  ctx.beginPath()
  ctx.strokeStyle = color
  ctx.lineWidth = width
  ctx.moveTo(...arc[0])
  arc.slice(1).forEach(pt => ctx.lineTo(...pt))
  ctx.stroke()
}

function getArcDist (arc) {
  let last = arc[0]
  return arc.reduce((total, pt) => {
    total += distance(last, pt)
    last = pt
    return total
  }, 0)
}

function cutArc (arc, perc) {
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
