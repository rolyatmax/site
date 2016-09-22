import { drawArc, cutArc, easeIn, startAnimation } from '../lib/drawers'
import { setTimeoutPromise } from '../lib/helpers'

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
    }, duration)
    .then(() => setTimeoutPromise(1000))
    .then(() => stop(ctx))
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
