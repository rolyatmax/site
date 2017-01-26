import React, { Component } from 'react'
import triangles from './sketches/triangles'

class Viz extends Component {
  constructor () {
    super()
    this.state = { show: false }
  }
  componentDidMount () {
    setTimeout(() => {
      this.setState({ show: true })
      this.destroy = triangles(this.container)
    }, 1400)
  }
  componentWillUnmount () {
    if (this.destroy) {
      this.destroy()
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
