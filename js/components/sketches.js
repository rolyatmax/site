import delegate from 'delegate'
import { actions } from '../store'
import { createFader } from './faders'

let section
let onClickDelegate

export default {
  willMount (select) {
    section = createFader(select('section'), 'rgb(66, 66, 66)')

    onClickDelegate = delegate(select('section'), 'a', 'click', (e) => {
      actions.setSection('home')
    })
  },

  didMount () {
    return section.fadeIn(500)
  },

  willUnmount () {
    onClickDelegate.destroy()
    return section.fadeOut(400)
  },

  render () {
    return `
      <section class="sketches">
        <h1>SKETCHES</h1>
        <a>Back to Home</a>
      </section>
    `
  }
}
