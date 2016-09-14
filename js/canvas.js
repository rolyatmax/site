import Sketch from 'sketch-js'
import visualizations from './visualizations'
import { style } from './helpers'

export default {
  willMount (select) {
    this.canvasContainer = select('.canvas-container')
    style(this.canvasContainer, {
      position: 'absolute',
      zIndex: -1,
      top: 0,
      left: 0,
      height: '100vh',
      width: '100vw'
    })
    this.ctx = Sketch.create({
      autostart: false,
      autoclear: false,
      container: this.canvasContainer
    })
  },

  didMount () {
    this.ctx.start()
    const intro = visualizations[0]
    this.currentVisualization = intro
    const promise = this.currentVisualization.start(this.ctx)
    promise.then(() => {
      console.log('INTRO DONE!')
      this.currentVisualization = visualizations[1]
      return this.currentVisualization.start(this.ctx)
    })
  },

  willUnmount () {
    return this.currentVisualization.stop()
  },

  render () {
    return '<div class="canvas-container"></div>'
  }
}
