import Sketch from 'sketch-js'
import visualizations from './visualizations'
import { style } from './helpers'

let loopCallbacks = []
let currVizIndex = 0
let curViz = null
let ctx
let isUnmounting = false

function tick (fn) {
  loopCallbacks.push(fn)
  return function removeCallback () {
    const i = loopCallbacks.indexOf(fn)
    if (i < 0) return
    loopCallbacks = [
      ...loopCallbacks.slice(0, i),
      ...loopCallbacks.slice(i + 1)
    ]
  }
}

function startViz () {
  curViz = visualizations[currVizIndex]()
  curViz.start(ctx).then(() => {
    if (isUnmounting) return
    loopCallbacks = []
    currVizIndex = (currVizIndex + 1) % visualizations.length
    startViz()
  })
}

export default {
  willMount (select) {
    const canvasContainer = select('.canvas-container')
    style(canvasContainer, {
      position: 'absolute',
      zIndex: -1,
      top: 0,
      left: 0,
      height: '100vh',
      width: '100vw'
    })
    ctx = Sketch.create({
      autostart: true,
      autoclear: false,
      autopause: false,
      container: canvasContainer,
      draw: () => {
        loopCallbacks.forEach(fn => fn(ctx))
      },
      tick: tick
    })
  },

  didMount () {
    ctx.start()
    startViz()
  },

  willUnmount () {
    isUnmounting = true
    return curViz.stop(ctx).then(() => {
      loopCallbacks = []
      ctx.destroy()
      ctx = null
    })
  },

  render () {
    return '<div class="canvas-container"></div>'
  }
}
