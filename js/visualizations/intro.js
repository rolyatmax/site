import { easeIn, dist } from '../helpers'

const margin = 40
const color = 'rgb(180, 180, 180)'
const width = 1
let startTime

export default {
  start (ctx) {
    this.ctx = ctx
    return new Promise((resolve, reject) => {
      const duration = 1400

      this.ctx.draw = function () {
        this.clear()
        const start = [margin, margin]
        const end = [this.width - margin, this.height - margin]

        startTime = startTime || this.millis
        const step = (this.millis - startTime) / duration
        const perc = easeIn(step, 0, 1)

        const arcs = [
          [start, [margin, this.height - margin], end],
          [start, [this.width - margin, margin], end]
        ]

        drawArc(this, cutArc(arcs[0], perc), color, width)
        drawArc(this, cutArc(arcs[1], perc), color, width)

        if (perc >= 1) {
          this.stop()
          startTime = null
          resolve()
        }
      }

      this.ctx.start()
    })
  },

  stop () {
    if (!this.ctx) throw new Error('Intro: visualization has not been started!')

    return new Promise((resolve, reject) => {
      const duration = 2200

      this.ctx.draw = function () {
        this.clear()
        const start = [margin, margin]
        const end = [this.width - margin, this.height - margin]

        startTime = startTime || this.millis
        const step = (this.millis - startTime) / duration
        const perc = easeIn(step, 0, 1)

        const arcs = [
          [start, [margin, this.height - margin], end].reverse(),
          [start, [this.width - margin, margin], end].reverse()
        ]

        drawArc(this, cutArc(arcs[0], 1 - perc), color, width)
        drawArc(this, cutArc(arcs[1], 1 - perc), color, width)

        if (perc >= 1) {
          this.stop()
          startTime = null
          resolve()
        }
      }

      this.ctx.start()
    })
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
    total += dist(last, pt)
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
    let segmentDist = dist(last, pt)
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
    let x = (pt[0] - last[0]) * cutPerc + last[0]
    let y = (pt[1] - last[1]) * cutPerc + last[1]
    toDraw.push([x, y])
    break
  }
  return toDraw
}
