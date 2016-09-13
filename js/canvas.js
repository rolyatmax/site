import Drawer from 'drawer'
import { style } from './helpers'

const margin = 80

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
  },

  didMount () {
    this.drawer = new Drawer(this.canvasContainer)
    const { width, height } = this.drawer.canvas
    const start = [margin, margin]
    const end = [width - margin, height - margin]
    const color = 'rgb(180, 180, 180)'
    const duration = 1400
    this.drawer.arc([start, [margin, height - margin], end], duration, color)
    this.drawer.arc([start, [width - margin, margin], end], duration, color)
  },

  willUnmount () {
    const { width, height } = this.drawer.canvas
    const start = [margin, margin]
    const end = [width - margin, height - margin]
    const color = 'rgb(255, 255, 255)'
    const duration = 2500
    this.drawer.arc([start, [margin, height - margin], end], duration, color)
    this.drawer.arc([start, [width - margin, margin], end], duration, color)
  },

  render () {
    return '<div class="canvas-container"></div>'
  }
}
