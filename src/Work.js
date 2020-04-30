import React, { Component } from 'react'
import WhenVisible from './WhenVisible'
import './Work.css'
import scrollTo from 'scroll-to'

const romanNumerals = 'i ii iii iv v vi vii viii ix x xi xii xiii xiv xv xvi xvii xviii xix xx'.split(' ')

const projects = [
  {
    image: require('./img/all-the-buildings.jpg'),
    title: 'All the Buildings in Manhattan',
    description: 'An interactive 3D visualization of the all the buildings in Manhattan.',
    url: '/nyc-buildings'
  },
  {
    image: require('./img/audiofabric.jpg'),
    title: 'Audiofabric',
    description: 'A 3D fabric pulses with the music.',
    url: '/audiofabric'
  },
  {
    image: require('./img/citibike-trips.jpg'),
    title: 'The CitiBike Commute',
    description: 'All the Citi Bike trips from a single day visualized in WebGL.',
    url: '/citibike-trips'
  },
  {
    image: require('./img/copland.jpg'),
    title: 'Copland',
    description: 'Combine piano and strings in this sequencer and watch the music evolve.',
    url: '/copland'
  },
  {
    image: require('./img/sketches.jpg'),
    title: 'Sketches',
    description: 'A place to throw the generative art I make from time to time.',
    url: 'https://rolyatmax.github.io/sketches/'
  },
  {
    image: require('./img/citibike.jpg'),
    title: 'CitiBike Summer',
    description: 'Visualizing CitiBike usage for an average summer week.',
    url: '/citibike'
  },
  {
    image: require('./img/boids.jpg'),
    title: 'Boids',
    description: 'Experimenting with flocking algorithms. Each color flocks together, generating some interesting patterns.',
    url: '/boids'
  },
  {
    image: require('./img/tictactoe.jpg'),
    title: 'Tic-Tac-Toe ML',
    description: 'Teach your browser to play tic-tac-toe with a reinforcement learning algorithm.',
    url: '/tictactoe'
  },

  {
    image: require('./img/rota.jpg'),
    title: 'Rota',
    description: 'Using a reinforcement learning technique to route traffic in a dynamic network.',
    url: '/rota'
  },
  {
    image: require('./img/nodes.jpg'),
    title: 'Nodes',
    description: 'Particles float about, connecting with neighbors, to form an intricate web.',
    url: '/nodes'
  },
  {
    image: require('./img/dots.jpg'),
    title: 'Dots',
    description: 'Inspired by the kids\' game Dots & Boxes.',
    url: '/dots'
  }
]

function Image ({ src, alt }) {
  return (
    <div className='Image' style={{ backgroundImage: `url(${src})` }} />
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
        <a href={project.url}>
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
    setTimeout(() => this.setState({ isArrowFadedIn: true }), 2000)
  }

  scrollDown () {
    const dest = this.workEl.getBoundingClientRect().top + (window.scrollY || 0)
    scrollTo(0, dest, {
      ease: 'in-out-quart',
      duration: 1000
    })
  }

  render () {
    const { isVisible, isArrowFadedIn } = this.state
    const showScrollIndicator = !isVisible && isArrowFadedIn
    const scrollIndicatorStyle = {
      opacity: showScrollIndicator ? 1 : 0,
      transform: showScrollIndicator ? 'translateY(0)' : 'translateY(-25px)',
      pointerEvents: showScrollIndicator ? 'auto' : 'none'
    }
    return (
      <div className='Work' ref={(el) => { this.workEl = el }}>
        <div className='scroll-indicator' style={scrollIndicatorStyle} onClick={() => this.scrollDown()}>
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
