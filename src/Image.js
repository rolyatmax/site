import React, { Component } from 'react'
import WhenVisible from './WhenVisible'

class Image extends Component {
  constructor () {
    super()
    this.state = {
      isLoaded: false,
      isVisible: false
    }
  }
  render () {
    const show = this.state.isLoaded && this.state.isVisible
    const coverStyle = {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      backgroundColor: '#fff',
      opacity: show ? 0 : 1,
      transition: 'opacity linear 500ms'
    }
    return (
      <WhenVisible onVisible={() => this.setState({ isVisible: true })}>
        <div className='Image' style={{ position: 'relative' }}>
          <img
            src={this.props.src}
            alt={this.props.alt}
            onLoad={() => this.setState({ isLoaded: true })} />
          <div style={coverStyle} />
        </div>
      </WhenVisible>
    )
  }
}

export default Image
