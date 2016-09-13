import home from './home'
import canvas from './canvas'

const { requestAnimationFrame } = window

function render (component, container) {
  let div = document.createElement('div')
  div.innerHTML = component.render()
  if (component.willMount) component.willMount(div.querySelector.bind(div))
  requestAnimationFrame(() => {
    const componentDOM = Array.from(div.children)
    componentDOM.forEach(container.appendChild.bind(container))
    if (component.didMount) {
      requestAnimationFrame(() => {
        component.didMount(container.querySelector.bind(container))
      })
    }
  })
}

const wrapper = document.querySelector('#wrapper')
render(canvas, document.body)
render(home, wrapper)
setTimeout(() => {
  home.willUnmount()
  canvas.willUnmount()
}, 7000)
