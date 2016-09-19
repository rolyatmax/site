import Sketch from 'sketch-js'
import visualizations from '../visualizations'
import { style } from '../helpers'

export function createAppCanvas () {
  let loopCallbacks = []
  let themeChangeCallbacks = []
  let currVizIndex = 0
  let curViz = null
  let ctx
  let isUnmounting = false

  const el = document.createElement('div')
  el.className = 'canvas-container'
  style(el, {
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
    container: el,
    draw: () => {
      loopCallbacks.forEach(fn => fn(ctx))
    },
    tick: tick
  })

  return { start, destroy, onThemeChange, el }

  function start () {
    ctx.start()
    startViz()
  }

  function destroy () {
    isUnmounting = true
    return curViz.stop(ctx).then(() => {
      loopCallbacks = []
      ctx.destroy()
      ctx = null
    })
  }

  function onThemeChange (fn) {
    themeChangeCallbacks.push(fn)
  }

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
    themeChangeCallbacks.forEach(cb => cb(curViz.isDarkTheme ? 'dark' : 'light'))
    curViz.start(ctx).then(() => {
      if (isUnmounting) return
      loopCallbacks = []
      currVizIndex = (currVizIndex + 1) % visualizations.length
      startViz()
    })
  }
}
