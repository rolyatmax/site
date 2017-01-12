import Alea from 'alea'
import array from 'new-array'
import tinycolor from 'tinycolor2'
import { add, subtract, squaredLength, normalize, scale, random } from 'gl-vec2'
import { setTimeoutPromise } from '../lib/helpers'
import { drawMargin } from '../lib/drawers'
import colorPalettes from '../lib/color-palettes'

const NODE_COUNT = 75
const NODE_SIZE = 300
const MAX_ALPHA = 0.1
const MARGIN = 40
const fadeTo = 6000

export default function () {
  const promises = []
  const rand = new Alea()
  const colors = colorPalettes[rand() * colorPalettes.length | 0]
  let nodes = array(NODE_COUNT).map(() => ({
    position: random([], rand() * 0.65 + 0.35),
    destPosition: random([], rand() * 0.65 + 0.35),
    velocity: random([], rand() * 0.003),
    alpha: rand() * MAX_ALPHA,
    color: colors[rand() * colors.length | 0],
    size: rand() * NODE_SIZE * 0.75 + (NODE_SIZE * 0.25)
  }))

  let unsubscribe

  return { start, stop, isDarkTheme: true }

  function start (ctx) {
    unsubscribe = ctx.tick((ctx) => {
      ctx.clear()
      nodes
        .map((node) => {
          if (rand() < 0.01) {
            node.destPosition = add(node.destPosition, node.destPosition, random([], rand() * 0.65 + 0.35))
          }
          const acceleration = getSpringForcePosition(0.05, 35, node)
          return updateNode(ctx, node, acceleration)
        })
        .forEach((node) => {
          const alpha = (ctx.millis < fadeTo ? ctx.millis / fadeTo : 1) * node.alpha
          const color = tinycolor(node.color).setAlpha(alpha).toRgbString()
          drawNode(ctx, node, color, node.size)
        })
      drawMargin(ctx, MARGIN)
    })

    promises.push(setTimeoutPromise(10000))
    return Promise.all(promises).then(() => stop(ctx))
  }

  function stop (ctx) {
    return new Promise((resolve) => {
      unsubscribe()
      nodes.forEach((node) => {
        node.sizeVelocity = 0
        node.sizeDestination = 0
        node.destPosition = random([], rand())
      })

      ctx.tick((ctx) => {
        ctx.clear()
        nodes = nodes
          .map((node) => {
            const acceleration = getSpringForcePosition(1, 25, node)
            node = updateSizeAndAlpha(0.003, 0.008, node)
            if (node.size < 0) return null
            return updateNode(ctx, node, acceleration)
          }).filter((node) => !!node)

        if (!nodes.length) return resolve()

        nodes.forEach((node) => {
          const alpha = node.alpha // (ctx.millis < fadeTo ? ctx.millis / fadeTo : 1) * node.alpha
          const color = tinycolor(node.color).setAlpha(alpha).toRgbString()
          drawNode(ctx, node, color, node.size)
        })
        drawMargin(ctx, MARGIN)
      })
    })
  }
}

function updateSizeAndAlpha (stiffness, dampening, node) {
  const x = node.size - node.sizeDestination
  const springForce = -stiffness * x
  const damperForce = node.sizeVelocity * -dampening
  const acceleration = springForce + damperForce
  node.sizeVelocity += acceleration
  node.size += node.sizeVelocity
  node.alpha = Math.min(node.alpha, node.size / 12000)
  return node
}

function getSpringForcePosition (stiffness, dampening, node) {
  const dir = subtract([], node.position, node.destPosition)
  const x = squaredLength(dir)
  let force = normalize([], dir)
  force = scale(force, force, x * -stiffness) // spring
  const damper = scale([], node.velocity, -dampening)
  force = add(force, force, damper) // add damper
  return scale(force, force, 2 / node.size)
}

function updateNode (ctx, node, acceleration = [0, 0]) {
  node.velocity = add(node.velocity, node.velocity, acceleration)
  node.position = add(node.position, node.position, node.velocity)
  return node
}

function drawNode (ctx, node, color, size) {
  const [ x, y ] = mapVecToCanvas(ctx, node.position)
  ctx.beginPath()
  ctx.arc(x, y, size, 0, 2 * Math.PI)
  ctx.fillStyle = color
  ctx.fill()
  return node
}

function mapVecToCanvas (ctx, vec) {
  return [
    ctx.map(vec[0], -1, 1, 0, ctx.width),
    ctx.map(vec[1], -1, 1, 0, ctx.height)
  ]
}
