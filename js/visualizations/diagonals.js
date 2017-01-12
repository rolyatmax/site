import { add, subtract, scale } from 'gl-vec2'
import { easeIn, startAnimation } from '../lib/drawers'

const color = 'rgb(230, 230, 230)'
const width = 1
const margin = 40

export default function () {
  let promises = []
  return { start, stop }

  function start (ctx) {
    const lineAnimationDuration = 5000
    const lineIntroductionDuration = 5000
    startAnimation(() => ctx.clear(), lineAnimationDuration + lineIntroductionDuration)
    return startAnimation((step) => {
      const { width, height } = ctx
      const perc = easeIn(step, 0, 1)
      const lines = createLines({ width, height })
      const newLines = lines.slice(promises.length, lines.length * perc | 0)
      newLines.forEach((line) => {
        promises.push(startAnimation((s) => {
          const p = easeIn(s, 0, 1)
          drawLine(ctx, cutLine(line, p))
        }, lineAnimationDuration))
      })
    }, lineIntroductionDuration)
    .then(() => Promise.all(promises))
  }

  function stop (ctx) {
    return Promise.all(promises)
  }

  function createLines ({ width, height }) {
    let lines = []
    height = height - margin * 2
    width = width - margin * 2
    const steps = 20
    const xStepSize = width / steps
    const yStepSize = height / steps
    let i = 0
    while (i < steps) {
      lines.push([ [i * xStepSize, 0], [0, i * yStepSize] ])
      i += 1
    }
    i = 0
    while (i < steps) {
      lines.push([ [i * xStepSize, height], [width, i * yStepSize] ])
      i += 1
    }
    lines = lines.map((line, i) => (i % 2) ? line.reverse() : line)
    lines = lines.map((line) => [
      add(line[0], line[0], [margin, margin]),
      add(line[1], line[1], [margin, margin])
    ])
    return lines
  }
}

function cutLine (line, perc) {
  let diff = subtract([], line[1], line[0])
  diff = scale([], diff, perc)
  let end = add([], diff, line[0])
  return [line[0], end]
}

function drawLine (ctx, [start, end]) {
  ctx.beginPath()
  ctx.moveTo(...start)
  ctx.lineTo(...end)
  ctx.strokeStyle = color
  ctx.lineWidth = width
  ctx.stroke()
}
