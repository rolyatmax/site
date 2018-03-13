import Alea from 'alea'
import fit from 'canvas-fit'
import createCamera from 'perspective-camera'
import getPlaneNormal from 'get-plane-normal'
import newArray from 'new-array'
import SimplexNoise from 'simplex-noise'
import { triangulate } from 'delaunay'
import { normalize, dot, subtract, add, scale } from 'gl-vec3'

let previousHeightStyle
const startTime = Date.now()

export default function fabric (container) {
  if (!previousHeightStyle) {
    previousHeightStyle = container.style.height
  }
  container.style.height = previousHeightStyle
  const { width, height } = container.getBoundingClientRect()
  container.style.height = `${Math.min(width, height)}px`

  const canvas = container.appendChild(document.createElement('canvas'))
  const ctx = canvas.getContext('2d')
  fit(canvas, container)

  const settings = {
    points: 180,
    color: [225, 55, 75],
    lightSpeed: 7,
    cameraSpeed: 5,
    dist: 7,
    opacity: 0.8
  }

  let timeout
  const rand = new Alea(5)
  const lightSource = []
  const cameraPosition = []
  const lookAt = [0, 0, 0]
  const simplex = new SimplexNoise(rand)
  const camera = createCamera({
    fov: Math.PI / 8,
    viewport: [0, 0, ctx.canvas.width, ctx.canvas.height]
  })

  const positions = newArray(settings.points).map(() => {
    const rads = rand() * Math.PI * 2
    const mag = Math.pow(rand(), 0.5)
    return [
      Math.cos(rads) * mag,
      Math.sin(rads) * mag
    ]
  })

  const triIndices = triangulate(positions)
  const cells = []
  for (let i = 0; i < triIndices.length; i += 3) {
    cells.push({
      pointIndices: [
        triIndices[i],
        triIndices[i + 1],
        triIndices[i + 2]
      ]
    })
  }

  const mesh = { cells, positions }
  const tris = []

  function update () {
    const millis = Date.now() - startTime;
    const color = settings.color.slice()
    color[0] += 360 + Math.cos(millis / 7000) * 20 | 0
    color[0] %= 360
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    const lightSrcRads = millis / 10000 * settings.lightSpeed
    lightSource[0] = 0 * settings.dist
    lightSource[1] = Math.cos(lightSrcRads) * settings.dist
    lightSource[2] = Math.sin(lightSrcRads) * settings.dist

    const cameraRads = millis / 10000 * settings.cameraSpeed
    cameraPosition[0] = Math.cos(cameraRads) * settings.dist
    cameraPosition[1] = Math.sin(cameraRads) * settings.dist / 2
    cameraPosition[2] = Math.sin(cameraRads) * settings.dist

    camera.identity()
    camera.translate(cameraPosition)
    camera.lookAt(lookAt)
    camera.update()

    mesh.positions.forEach(p => {
      const offset = millis / 8000
      const noise1 = simplex.noise2D(p[0] / 2.5 + offset, p[1] / 2.5 + offset)
      const noise2 = simplex.noise2D(p[0] / 2 + offset + 1000, p[1] / 2 + offset + 1000)
      p[2] = Math.sin(noise1 / 3 + noise2 / 3)
    })

    mesh.cells.forEach((cell, i) => {
      tris[i] = tris[i] || {}
      tris[i].positions = tris[i].positions || []
      tris[i].positions[0] = mesh.positions[cell.pointIndices[0]]
      tris[i].positions[1] = mesh.positions[cell.pointIndices[1]]
      tris[i].positions[2] = mesh.positions[cell.pointIndices[2]]
      tris[i].center = getCenterOfPlane(tris[i].positions)
      tris[i].lightDirection = tris[i].lightDirection || []
      tris[i].lightDirection = subtract(tris[i].lightDirection, lightSource, tris[i].center)
      normalize(tris[i].lightDirection, tris[i].lightDirection)
      tris[i].norm = tris[i].norm || []
      getPlaneNormal(tris[i].norm, tris[i].positions[0], tris[i].positions[1], tris[i].positions[2])
      const dotProduct = Math.abs(dot(tris[i].lightDirection, tris[i].norm))
      const lightenPerc = Math.pow(Math.max(0, dotProduct), 0.75) * 0.5
      tris[i].points = tris[i].points || []
      tris[i].points[0] = camera.project(tris[i].positions[0])
      tris[i].points[1] = camera.project(tris[i].positions[1])
      tris[i].points[2] = camera.project(tris[i].positions[2])
      tris[i].litColor = `hsla(${color[0]}, ${color[1]}%, ${color[2] + color[2] * lightenPerc}%, ${settings.opacity})`
      tris[i].distance = Math.min(tris[i].points[0][2], tris[i].points[1][2], tris[i].points[2][2])
    })

    tris.sort((a, b) => (a.distance > b.distance) ? 1 : -1)
    for (let tri of tris) {
      drawTriangle(ctx, tri.points, tri.litColor)
    }
  }

  timeout = requestAnimationFrame(function loop () {
    timeout = requestAnimationFrame(loop)
    update()
  })

  return () => {
    cancelAnimationFrame(timeout)
    canvas.parentElement.removeChild(canvas)
  }
}

function getCenterOfPlane (pts) {
  let total = [0, 0, 0]
  pts.forEach(pt => add(total, total, pt))
  return scale(total, total, 1 / (pts.length))
}

function drawTriangle (ctx, points, color) {
  ctx.fillStyle = color
  ctx.strokeStyle = '#eee'
  ctx.lineWidth = 0.2
  ctx.beginPath()
  ctx.moveTo(points[0][0], points[0][1])
  ctx.lineTo(points[1][0], points[1][1])
  ctx.lineTo(points[2][0], points[2][1])
  ctx.lineTo(points[0][0], points[0][1])
  ctx.fill()
  ctx.stroke()
}
