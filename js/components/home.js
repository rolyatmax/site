import delegate from 'delegate'
import { actions } from '../store'
import { style, setTimeoutPromise } from '../helpers'
import { createBlurFader, createFader } from '../faders'
import { twitter, instagram, github } from './social-icons'

let title
let secondaryElements
let eventDelegation

export default {
  willMount (select) {
    title = createBlurFader(select('.title'))
    // manually fix kerning around the `a` because the <span> tags ruin it
    const a = title.el.querySelectorAll('span')[1]
    style(a, { margin: '0 -4px 0 -5px' })

    secondaryElements = ['.sections', '.social-icons', '.subtitle']
      .map(select)
      .map(createFader)

    eventDelegation = delegate(select('.sections'), 'li', 'click', (e) => {
      const section = e.delegateTarget.dataset.section
      actions.setSection(section)
    })
  },

  didMount () {
    title.fadeIn(1000)
    return setTimeoutPromise(550).then(() => {
      const promises = secondaryElements.map(el => el.fadeIn(1000, 'ease-in'))
      return Promise.all(promises)
    })
  },

  willUnmount () {
    eventDelegation.destroy()
    title.fadeOut(1000)
    return setTimeoutPromise(550).then(() => {
      const promises = secondaryElements.map(el => el.fadeOut(1000, 'ease-out'))
      return Promise.all(promises)
    })
  },

  render () {
    return `
      <main>
        <header>
          <h1 class="title">Taylor Baldwin</h1>
          <h2 class="subtitle">Software Engineer <span>in</span> New York City</h2>
        </header>
        <ol class="sections">
          <li data-section="work">
            <span><em>I.</em> Work</span>
            <span class="cover"><em>I.</em> Work</span>
          </li>
          <li data-section="sketches">
            <span><em>II.</em> Sketches</span>
            <span class="cover"><em>II.</em> Sketches</span>
          </li>
        </ol>
      </main>
      <ul class="social-icons">
        <li class="github">
          <a href="https://github.com/rolyatmax" target="_blank">${github}</a>
        </li>
        <li class="instagram">
          <a href="https://www.instagram.com/taylorbaldwin" target="_blank">${instagram}</a>
        </li>
        <li class="twitter">
          <a href="https://twitter.com/taylorbaldwin" target="_blank">${twitter}</a>
        </li>
      </ul>
    `
  }
}
