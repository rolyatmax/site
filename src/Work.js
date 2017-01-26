import React, { Component } from 'react'
import WhenVisible from './WhenVisible'
import './Work.css'

const romanNumerals = 'i ii iii iv v vi vii viii ix x xi xii xiii xiv xv xvi xvii xviii xix xx'.split(' ')

const projects = [
  {
    image: require('./img/nodes.jpg'),
    title: 'Nodes',
    description: 'Particles float about, connecting with neighbors, to form an intricate web.',
    url: '/nodes'
  },
  {
    image: require('./img/physics-painting.jpg'),
    title: 'Physics Painting',
    description: 'Particles react to forces, painting photographs to canvas.',
    url: '/physics-painting'
  },
  {
    image: require('./img/citibike.jpg'),
    title: 'Citibike Summer',
    description: 'Visualizing Citibike usage for an average summer week.',
    url: '/citibike'
  },
  {
    image: require('./img/copland.jpg'),
    title: 'Copland',
    description: 'Combine piano and strings in this sequencer and watch the music evolve.',
    url: '/copland'
  },
  {
    image: require('./img/dots.jpg'),
    title: 'Dots',
    description: 'Inspired by the kids\' game Dots & Boxes.',
    url: '/dots'
  },
  {
    image: require('./img/rota.jpg'),
    title: 'Rota',
    description: 'Using a reinforcement learning technique to route traffic in a dynamic network.',
    url: '/rota'
  },
  {
    image: require('./img/tictactoe.jpg'),
    title: 'Tic-Tac-Toe',
    description: 'Teach your browser to play tic-tac-toe with a reinforcement learning algorithm.',
    url: '/tictactoe'
  },
  {
    image: require('./img/viz.jpg'),
    title: 'Viz',
    description: 'An early experiment that visualizes a favorite track in 3D space.',
    url: '/viz'
  },
  {
    image: require('./img/sketches.jpg'),
    title: 'Sketches',
    description: 'A place to throw the generative art I make from time to time.',
    url: 'https://rolyatmax.github.io/sketches/'
  }
]

function Image ({ src, alt }) {
  return (
    <div className='Image'>
      <img src={src} alt={alt} />
    </div>
  )
}

class Project extends Component {
  constructor () {
    super()
    this.state = { show: false }
    this.delay = 150
  }
  componentWillReceiveProps ({ isVisible, i }) {
    if (!this.props.isVisible && isVisible) {
      this.timeoutToken = setTimeout(() => this.setState({ show: true }), i * this.delay)
    }
  }
  componentWillUnmount () {
    clearTimeout(this.timeoutToken)
  }
  render () {
    const { project, i } = this.props
    return (
      <li className='Project' style={{ opacity: this.state.show ? 1 : 0 }}>
        <a href={project.url} target='_blank'>
          <Image src={project.image} alt={`${project.title} - ${project.description}`} />
          <h2>
            <span>{romanNumerals[i]}.</span> {project.title}
          </h2>
          <p>{project.description}</p>
        </a>
      </li>
    )
  }
}

class Work extends Component {
  constructor () {
    super()
    this.state = { isVisible: false, isArrowFadedIn: false }
  }

  componentWillMount () {
    setTimeout(() => this.setState({ isArrowFadedIn: true }), 5000)
  }

  render () {
    const { isVisible, isArrowFadedIn } = this.state
    const showScrollIndicator = !isVisible && isArrowFadedIn
    const scrollIndicatorStyle = {
      opacity: showScrollIndicator ? 1 : 0,
      transform: showScrollIndicator ? 'translateY(0)' : 'translateY(-25px)'
    }
    return (
      <div className='Work'>
        <div className='scroll-indicator' style={scrollIndicatorStyle} >
          <h3>WORK</h3>
          <div className='down-arrow' />
        </div>
        <WhenVisible onVisible={() => this.setState({ isVisible: true })}>
          <ul>
            {projects.map((project, i) =>
              <Project project={project} i={i} key={i} isVisible={isVisible} />)}
          </ul>
        </WhenVisible>
      </div>
    )
  }
}

export default Work
