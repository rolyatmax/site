import { easeIn } from '../helpers'

const margin = 40
const color = 'rgb(240, 240, 240)'
const width = 1

let startTime
let lines

export default {
  start (ctx) {
    this.ctx = ctx
    return new Promise((resolve, reject) => {
      const duration = 5000

      this.ctx.draw = function () {
        this.clear()
        startTime = startTime || this.millis
        const step = (this.millis - startTime) / duration
        const perc = easeIn(step, 0, 1)

        if (!lines) {
          const height = this.height - margin * 2
          const width = this.width - margin * 2
          const steps = 100
          const xStepSize = width / steps
          const yStepSize = height / steps
          lines = []
          let i = 0
          while (i < steps) {
            lines.push([
              [i * xStepSize + margin, margin],
              [margin, i * yStepSize + margin]
            ])
            i += 1
          }
          i = 0
          while (i < steps) {
            lines.push([
              [i * xStepSize + margin, height + margin],
              [width + margin, i * yStepSize + margin]
            ])
            i += 1
          }
        }

        lines.slice(0, lines.length * perc | 0).forEach(([start, end]) => {
          this.beginPath()
          this.moveTo(...start)
          this.lineTo(...end)
          this.strokeStyle = color
          this.lineWidth = width
          this.stroke()
        })

        if (perc >= 1) {
          this.stop()
          startTime = null
          resolve()
        }
      }

      this.ctx.start()
    })
  },

  stop () {
    if (!this.ctx) throw new Error('Diagonals: visualization has not been started!')

    return new Promise((resolve, reject) => {

    })
  }
}
