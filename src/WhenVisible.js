import React, { Component } from 'react'

const { requestAnimationFrame, cancelAnimationFrame } = window
const buffer = 200

class WhenVisible extends Component {
  constructor () {
    super()
    this.checkScroll = this.checkScroll.bind(this)
    this.setPosition = this.setPosition.bind(this)
  }
  componentDidMount () {
    this.rAFToken = requestAnimationFrame(this.checkScroll)
    this.setPosition()
    window.addEventListener('resize', this.setPosition)
  }
  setPosition () {
    this.position = window.scrollY + this.el.getBoundingClientRect().top
  }
  componentWillUnmount () {
    cancelAnimationFrame(this.rAFToken)
    window.removeEventListener('resize', this.setPosition)
  }
  checkScroll () {
    if (window.scrollY + window.innerHeight > this.position + buffer) {
      this.props.onVisible()
    } else {
      this.rAFToken = requestAnimationFrame(this.checkScroll)
    }
  }
  render () {
    return (
      <div ref={(el) => { this.el = el }}>
        {this.props.children}
      </div>
    )
  }
}

export default WhenVisible
