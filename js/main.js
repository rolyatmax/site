import { subscribe } from './store'
import { createRenderer } from './renderer'
import { setTimeoutPromise } from './helpers'

import { createAppCanvas } from './canvas'
import components from './components'

const renderComponent = createRenderer()

const wrapper = document.querySelector('#wrapper')
renderComponent(components.home, wrapper)
setTimeoutPromise(400).then(() => {
  const appCanvas = createAppCanvas()
  document.body.appendChild(appCanvas.el)
  appCanvas.start()
})

subscribe(({ section }) => {
  const component = components[section]
  renderComponent(component, wrapper)
})
