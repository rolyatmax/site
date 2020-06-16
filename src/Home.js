import React, { Component } from 'react'
import SocialIcons from './SocialIcons'
import Viz from './Viz'
import './Home.css'

function shuffle (list) {
  list = [...list]
  let result = []
  while (list.length) {
    const i = Math.random() * list.length | 0
    result = result.concat(list.splice(i, 1))
  }
  return result
}

const textShadowColor = '#424242'

class Name extends Component {
  constructor () {
    super()
    this.letters = []
  }
  componentDidMount () {
    this.timeoutToken = setTimeout(() => this.fadeIn(), 50)
  }
  componentWillUnmount () {
    clearTimeout(this.timeoutToken)
  }
  fadeIn () {
    const multiplier = 50
    const duration = 1200
    const easeIn = 'cubic-bezier(0.07, 0.9, 0.64, 0.98)'
    const letters = this.letters.slice(0, 1).concat(shuffle(this.letters.slice(1)))
    letters.forEach((letter, i) => {
      const delay = i * multiplier
      letter.style.textShadow = `${textShadowColor} 0 0 0`
      letter.style.opacity = 1
      letter.style.transition = [
        `text-shadow ${duration}ms ${easeIn} ${delay}ms`,
        `opacity ${duration}ms ease-in ${delay}ms`
      ].join(', ')
    })

    const removeStylesDelay = letters.length * multiplier
    setTimeout(() => {
      letters.forEach(l => { l.style.textShadow = 'none' })
    }, removeStylesDelay)
  }
  render () {
    const letters = Array.from(this.props.children).map((letter, i) => (
      <span
        key={i}
        ref={(el) => { this.letters[i] = el }}
        style={{ textShadow: `${textShadowColor} 0 0 50px`, opacity: 0 }}>
        {letter}
      </span>
    ))
    return <h1 className='Name'>{letters}</h1>
  }
}

class Home extends Component {
  constructor () {
    super()
    this.state = {
      show: false,
      height: this.getHeight()
    }
    this.resize = this.resize.bind(this)
  }
  getHeight () {
    return `${window.innerHeight - 30}px`
  }
  componentDidMount () {
    window.addEventListener('resize', this.resize)
    setTimeout(() => {
      this.setState({ show: true })
    }, 550)
  }
  componentWillUnmount () {
    window.removeEventListener('resize', this.resize)
  }
  resize () {
    this.setState({ height: this.getHeight() })
  }
  render () {
    const secondaryElementsStyle = {
      transform: this.state.show ? 'scale(1, 1)' : 'scale(0.97, 0.97)',
      opacity: this.state.show ? 1 : 0,
      transition: [
        'opacity ease-in 1000ms',
        'transform cubic-bezier(0.07, 0.9, 0.64, 0.98) 1000ms'
      ].join(', ')
    }
    const { height } = this.state
    return (
      <div className='Home' style={{ height }}>
        <div className='left'>
          <div className='Content'>
            <Name>Taylor Baldwin</Name>
            <div style={{...secondaryElementsStyle, transitionDelay: '450ms'}}>
              <p>
                I'm a JavaScript engineer in New York City.
                My creative projects generally have to do with data
                vis, <a href='https://rolyatmax.github.io/sketches' target='_blank'>generative art</a>, or
                machine learning. Formerly at Uber, New York Times R&D, and BuzzFeed.
              </p>
            </div>
            <div style={{...secondaryElementsStyle, transitionDelay: '800ms'}}>
              <SocialIcons />
            </div>
          </div>
        </div>
        <div className='right'>
          <Viz />
        </div>
      </div>
    )
  }
}

export default Home
