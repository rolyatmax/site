import Alea from 'alea'
import tinycolor from 'tinycolor2'
import { add, subtract, length, scale } from 'gl-vec2'
import { setTimeoutPromise } from '../lib/helpers'
import { updateObj, addSpringForce } from '../lib/physics'
import { drawMargin } from '../lib/drawers'
import colorPalettes from '../lib/color-palettes'

const PIXEL_COUNT = 30
const MARGIN = 40

export default function () {
  const promises = []
  const rand = new Alea()
  const colors = colorPalettes[rand() * colorPalettes.length | 0]

  let pixels = []
  for (let i = 0; i < PIXEL_COUNT; i++) {
    const x = i * (2 / PIXEL_COUNT) - 1
    for (let j = 0; j < PIXEL_COUNT; j++) {
      const y = j * (2 / PIXEL_COUNT) - 1
      const color = colors[rand() * colors.length | 0]
      pixels.push({
        position: [x, y],
        length: 0,
        angle: Math.PI * -0.5,
        alpha: 0.25,
        color: color
      })
    }
  }

  let roamer = {
    position: [0, 0.5]
  }

  let unsubscribe

  return { start, stop }

  function start (ctx) {
    let frame = 0
    unsubscribe = ctx.tick((ctx) => {
      frame += 1
      if (frame % 4 !== 0) return
      ctx.clear()
      if (frame % 16 === 0) {
        roamer = addSpringForce(roamer, 'position', [-1, 0], 0.02, 0.01)
        updateObj(ctx, roamer, ['position'])
        roamer = addSpringForce(roamer, 'position', [1, 0], 0.02, 0.02)
        updateObj(ctx, roamer, ['position'])
        roamer = addSpringForce(roamer, 'position', [0, 0], 0.02, 0.05)
        updateObj(ctx, roamer, ['position'])
      }
      // drawRoamer(ctx, roamer)
      pixels
        .map((pixel) => {
          pixel = addSpringForce(pixel, 'angle', ({ position }) => getAngleToPt(position, getMousePos(ctx)), 0.1, 0.98)
          updateObj(ctx, pixel, ['angle'])
          pixel = addSpringForce(pixel, 'angle', ({ position }) => getAngleToPt(position, [0, 0]), 0.1, 0.9)
          pixel = addSpringForce(pixel, 'length', ({ position }) => Math.max(0, getDistToPt(position, roamer.position) * 12 - 4), 0.2, 0.5)
          return updateObj(ctx, pixel, ['angle', 'length'])
        })
        .forEach((pixel) => drawPixel(ctx, pixel))
      drawMargin(ctx, MARGIN)
    })

    promises.push(setTimeoutPromise(20000))
    return Promise.all(promises).then(() => stop(ctx))
  }

  function stop (ctx) {
    unsubscribe()
    return new Promise((resolve) => {
      unsubscribe = ctx.tick((ctx) => {
        ctx.clear()
        pixels = pixels
          .map((pixel) => {
            pixel = addSpringForce(pixel, 'angle', ({ position }) => getAngleToPt([0, 0], position), 0.1, 0.9)
            pixel = addSpringForce(pixel, 'length', 0, 0.2, 0.5)
            return updateObj(ctx, pixel, ['angle', 'length'])
          }).filter(p => p.length > 0.1)

        if (!pixels.length) {
          unsubscribe()
          return resolve()
        }

        pixels.forEach((pixel) => drawPixel(ctx, pixel))
        drawMargin(ctx, MARGIN)
      })
    })
  }
}

function getMousePos (ctx) {
  let pos = [ctx.mouse.x, ctx.mouse.y]
  pos = scale(pos, pos, 2 / Math.max(ctx.height, ctx.width))
  return add(pos, pos, [-1, -1])
}

function getAngleToPt (position, point) {
  const diff = subtract([], position, point)
  return Math.atan2(diff[1], diff[0])
}

function getDistToPt (position, point) {
  const diff = subtract([], position, point)
  return length(diff)
}

function drawRoamer (ctx, roamer) {
  const [ x, y ] = mapVecToCanvas(ctx, roamer.position)
  ctx.beginPath()
  ctx.arc(x, y, 10, 0, Math.PI * 2)
  ctx.fillStyle = `rgba(0, 0, 0, 0.1)`
  ctx.fill()
}

function drawPixel (ctx, pixel) {
  const [ startX, startY ] = mapVecToCanvas(ctx, pixel.position)
  const end = scale([], [Math.cos(pixel.angle), Math.sin(pixel.angle)], pixel.length)
  const [ endX, endY ] = add([], [startX, startY], end)
  ctx.beginPath()
  ctx.moveTo(startX, startY)
  ctx.lineTo(endX, endY)
  ctx.lineWidth = 10
  // ctx.lineCap = 'round'
  ctx.strokeStyle = tinycolor(pixel.color).setAlpha(pixel.alpha).toRgbString()
  ctx.stroke()
  return pixel
}

function mapVecToCanvas (ctx, vec) {
  return [
    ctx.map(vec[0], -1, 1, 0, ctx.width),
    ctx.map(vec[1], -1, 1, 0, ctx.height)
  ]
}
