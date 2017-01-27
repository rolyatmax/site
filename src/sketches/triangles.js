import Sketch from 'sketch-js'
import array from 'new-array'
import { add, subtract, scale, distance } from 'gl-vec2'

const configs = [
  {
    drawersCount: 100,
    lineLength: 10,
    turnDegrees: 61,
    drawSpeed: 0.4,
    opacity: 0.02,
    circleSize: 0.7,
    stopAfter: 90
  },
  {
    drawersCount: 20,
    lineLength: 16,
    turnDegrees: 60,
    drawSpeed: 0.4,
    opacity: 0.04,
    circleSize: 0.7,
    stopAfter: 11
  }
]

const {
  drawersCount, lineLength, turnDegrees, drawSpeed, opacity, circleSize, stopAfter
} = configs[configs.length * Math.random() | 0]

const lineColors = [
  `rgba(100, 100, 100, ${opacity})`,
  `rgba(85, 153, 211, ${opacity})`
]

export default function triangles (container) {
  let drawers
  let pathsTaken = {}
  let timeoutToken

  const { width, height } = container.getBoundingClientRect()

  const ctx = Sketch.create({
    autoclear: false,
    autopause: false,
    container: container,
    fullscreen: false,
    retina: window.devicePixelRatio > 1,
    width: width,
    height: height
  })

  const radius = Math.min(ctx.width, ctx.height) / 2 * circleSize
  const center = [ctx.width / 2, ctx.height / 2]

  ctx.setup = ctx.resize = function () {
    pathsTaken = {}
    clearTimeout(timeoutToken)
    ctx.start()
    timeoutToken = setTimeout(ctx.stop.bind(ctx), stopAfter * 1000)
    drawers = array(drawersCount).map(createDrawer)
  }

  ctx.update = function () {
    if (!drawers.length) {
      ctx.stop()
      return
    }
    if (drawers.length < drawersCount && Math.random() < 0.5) {
      const drawerToClone = drawers[Math.random() * drawers.length | 0]
      drawers.push(createDrawer(drawerToClone.position))
    }
    drawers.forEach((drawer) => {
      if (!drawer.nextPosition || drawer.progress === 1) {
        drawer.position = drawer.nextPosition || drawer.position
        drawer.nextPosition = getNextPoint(drawer.position)
        drawer.progress = 0
      }
      drawer.progress += (1 - drawer.progress) * drawSpeed
      drawer.progress = (drawer.progress > 0.99) ? 1 : drawer.progress
    })
    drawers = drawers.filter(drawer => drawer.nextPosition)
  }

  ctx.draw = function () {
    drawers.forEach((drawer, i) => {
      const direction = subtract([], drawer.nextPosition, drawer.position)
      const drawTo = add([], scale(direction, direction, drawer.progress), drawer.position)
      ctx.beginPath()
      ctx.moveTo(...drawer.position)
      ctx.lineTo(...drawTo)
      ctx.strokeStyle = drawer.color
      ctx.lineWidth = 1
      ctx.stroke()
    })
  }

  function createDrawer (position) {
    position = position || center
    // position = add([], position, (Math.random() > 0.5 ? [0, 0] : [lineLength / 2, lineLength / 2]))
    return {
      position: position,
      progress: 0,
      color: lineColors[Math.random() * lineColors.length | 0]
    }
  }

  function getNextPoint (curPosition) {
    const points = getPossiblePoints(curPosition)
    if (!points.length) return null
    let next = points[(Math.random() * points.length) | 0]
    pathsTaken[key(curPosition, next)] = true
    if (!isInViewport(next)) return null

    // throw in something fun
    // if (Math.random() < 0.005) {
    //   next = next.map(num => num + 1)
    // }

    return next
  }

  function getPossiblePoints (position) {
    const directions = []
    let t = 0
    while (t < 360) {
      directions.push(t)
      t += turnDegrees
    }
    const points = directions.map(dir => {
      const rads = dir / 360 * Math.PI * 2
      const vec = scale([], [Math.cos(rads), Math.sin(rads)], lineLength)
      return add(vec, vec, position)
    })
    return points.filter(pt => {
      return !pathsTaken[key(pt, position)] && distance(pt, center) <= radius
    })
  }

  function isInViewport (point) {
    if (point[0] < 0 || point[1] < 0) return false
    if (point[0] > ctx.width || point[1] > ctx.height) return false
    return true
  }

  function key (pointA, pointB) {
    pointA = pointA.map(num => Math.round(num))
    pointB = pointB.map(num => Math.round(num))
    let first, second
    if (pointA[0] < pointB[0]) {
      first = pointA
      second = pointB
    } else if (pointA[0] > pointB[0]) {
      first = pointB
      second = pointA
    } else if (pointA[1] < pointB[1]) {
      first = pointA
      second = pointB
    } else {
      first = pointB
      second = pointA
    }
    return `(${first[0]}-${first[1]})-(${second[0]}-${second[1]})`
  }

  return ctx.destroy.bind(ctx)
}
