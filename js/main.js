import { subscribe } from './store'
import { createRenderer } from './renderer'

import components from './components'

const renderComponent = createRenderer()

const wrapper = document.querySelector('#wrapper')
renderComponent(components.home, wrapper)

subscribe(({ section }) => {
  const component = components[section]
  renderComponent(component, wrapper)
})
