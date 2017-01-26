import React, { Component } from 'react'
import Home from './Home'
import Work from './Work'
import './App.css'

class App extends Component {
  render () {
    return (
      <div className='App'>
        <Home />
        <div className='lower-bar' />
        <Work />
      </div>
    )
  }
}

export default App
