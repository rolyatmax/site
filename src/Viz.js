import React, { Component } from 'react'
import triangles from './sketches/triangles'

class Viz extends Component {
  constructor () {
    super()
    this.state = { show: false }
    this.resize = this.resize.bind(this)
  }
  componentDidMount () {
    window.addEventListener('resize', this.resize)
    this.timeoutToken = setTimeout(() => {
      this.setState({ show: true })
      this.destroy = triangles(this.container)
    }, 1400)
  }
  componentWillUnmount () {
    clearTimeout(this.timeoutToken)
    if (this.destroy) {
      this.destroy()
    }
  }
  resize () {
    if (this.destroy) {
      this.destroy()
      this.destroy = triangles(this.container)
    }
  }
  render () {
    const style = {
      width: '100%',
      height: '100%',
      transition: 'opacity ease-in 1000ms',
      pointerEvents: 'none',
      opacity: this.state.show ? 1 : 0
    }
    return <div style={style} ref={(el) => { this.container = el }} />
  }
}

export default Viz
