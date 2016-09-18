const { requestAnimationFrame } = window

export function createRenderer () {
  let currentComponent
  let currentComponentDOM

  return function renderComponent (component, container) {
    if (!currentComponent) {
      render(component, container)
      return
    }
    if (currentComponent.willUnmount) {
      currentComponent.willUnmount().then(clearDomAndRender)
    } else {
      clearDomAndRender()
    }

    function clearDomAndRender () {
      currentComponentDOM.forEach(el => el.remove())
      render(component, container)
    }
  }

  function render (component, container) {
    currentComponent = component
    let div = document.createElement('div')
    div.innerHTML = component.render()
    if (component.willMount) component.willMount(div.querySelector.bind(div))
    requestAnimationFrame(() => {
      currentComponentDOM = Array.from(div.children)
      currentComponentDOM.forEach(container.appendChild.bind(container))
      if (component.didMount) {
        requestAnimationFrame(() => {
          component.didMount(container.querySelector.bind(container))
        })
      }
    })
  }
}
