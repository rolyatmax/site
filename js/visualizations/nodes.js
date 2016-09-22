import Alea from 'alea'
import array from 'new-array'
import tinycolor from 'tinycolor2'
import { add, random } from 'gl-vec2'
import { setTimeoutPromise } from '../lib/helpers'
import colorPalettes from '../lib/color-palettes'

const NODE_COUNT = 50
const NODE_SIZE = 300
const MAX_ALPHA = 0.1
const MARGIN = 40 + NODE_SIZE
const fadeTo = 8000

export default function () {
  const promises = []
  const rand = new Alea()
  const colors = colorPalettes[rand() * colorPalettes.length | 0]
  let nodes = array(NODE_COUNT).map(() => ({
    position: random([], rand()),
    velocity: random([], rand() * 0.003),
    alpha: rand() * MAX_ALPHA,
    color: colors[rand() * colors.length | 0],
    size: rand() * NODE_SIZE
  }))

  let unsubscribe

  return { start, stop, isDarkTheme: true }

  function start (ctx) {
    unsubscribe = ctx.tick((ctx) => {
      ctx.clear()
      nodes
        .map((node) => updateNode(ctx, node))
        .forEach((node) => {
          const alpha = (ctx.millis < fadeTo ? ctx.millis / fadeTo : 1) * node.alpha
          const color = tinycolor(node.color).setAlpha(alpha).toRgbString()
          drawNode(ctx, node, color, node.size)
        })
    })

    promises.push(setTimeoutPromise(15000))
    return Promise.all(promises).then(() => stop(ctx))
  }

  function stop (ctx) {
    unsubscribe()
    return new Promise((resolve) => {
      ctx.tick((ctx) => {
        ctx.clear()
        nodes = nodes
          .map((node) => {
            node.disappearing = node.disappearing || rand() < 0.02
            if (node.disappearing) {
              node.size *= 0.98
              node.alpha *= 0.98
            }
            return updateNode(ctx, node)
          })
          .filter((node) => node.size > 4 && node.alpha > 0.01)

        if (!nodes.length) return resolve()

        nodes.forEach((node) => {
          const alpha = (ctx.millis < fadeTo ? ctx.millis / fadeTo : 1) * node.alpha
          const color = tinycolor(node.color).setAlpha(alpha).toRgbString()
          drawNode(ctx, node, color, node.size)
        })
      })
    })
  }
}

function updateNode (ctx, node) {
  node.position = add(node.position, node.position, node.velocity)
  return node
}

function drawNode (ctx, node, color, size) {
  let [ x, y ] = node.position
  x = Math.sin(x)
  y = Math.sin(y)
  ;[ x, y ] = mapVecToCanvas(ctx, [x, y], MARGIN)
  ctx.beginPath()
  ctx.arc(x, y, size, 0, 2 * Math.PI)
  ctx.fillStyle = color
  ctx.fill()
  return node
}

function mapVecToCanvas (ctx, vec, margin) {
  return [
    ctx.map(vec[0], -1, 1, margin, ctx.width - margin),
    ctx.map(vec[1], -1, 1, margin, ctx.height - margin)
  ]
}
