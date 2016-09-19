import delegate from 'delegate'
import { actions } from '../store'
import { style, setTimeoutPromise } from '../helpers'
import { createBlurFader, createFader } from './faders'
import { twitter, instagram, github } from './social-icons'
import { createAppCanvas } from './canvas'

const colors = {
  light: 'rgb(66, 66, 66)',
  dark: 'rgb(255, 255, 255)'
}

let title
let secondaryElements
let eventDelegations = []
let appCanvas
let curTheme = 'light'

export default {
  willMount (select) {
    title = createBlurFader(select('.title'), colors.light)
    // manually fix kerning around the `a` because the <span> tags ruin it
    const a = title.el.querySelectorAll('span')[1]
    style(a, { margin: '0 -4px 0 -5px' })

    secondaryElements = ['.sections', '.subtitle', '.social-icons']
      .map(select)
      .map(createFader)

    appCanvas = createAppCanvas()
    document.body.appendChild(appCanvas.el)
    appCanvas.onThemeChange(this.toggleFontColor)

    const onClickDelegate = delegate(select('.sections'), 'li', 'click', (e) => {
      const section = e.delegateTarget.dataset.section
      actions.setSection(section)
    })

    const getHoverColor = (eventType) => eventType === 'mouseenter' ? '#5599d3' : colors[curTheme]

    eventDelegations = [
      onClickDelegate,
      ...applyHoverStyle(select('.sections'), 'li', getHoverColor),
      ...applyHoverStyle(select('.social-icons'), 'li', getHoverColor, 'fill', 'svg')
    ]
  },

  didMount () {
    return Promise.all([
      title.fadeIn(1000),
      setTimeoutPromise(400).then(() => appCanvas.start()),
      setTimeoutPromise(550).then(() => {
        const promises = secondaryElements.map(el => el.fadeIn(1000, 'ease-in'))
        return Promise.all(promises)
      })
    ])
  },

  toggleFontColor (theme) {
    if (curTheme === theme) return
    curTheme = theme
    const elements = ['.title', '.subtitle', '.sections li', '.social-icons svg']
    elements.map(sel => Array.from(document.querySelectorAll(sel))).forEach(children => {
      children.forEach(el => {
        style(el, {
          color: colors[curTheme],
          fill: colors[curTheme],
          transition: 'color 2000ms linear, fill 2000ms linear'
        })
      })
    })
  },

  willUnmount () {
    eventDelegations.destroy()
    return Promise.all([
      title.fadeOut(700),
      appCanvas.destroy(),
      setTimeoutPromise(350).then(() => {
        const promises = secondaryElements.map(el => el.fadeOut(300, 'ease-out'))
        return Promise.all(promises)
      })
    ])
  },

  render () {
    return `
      <main>
        <header>
          <h1 class="title">Taylor Baldwin</h1>
          <h2 class="subtitle">Software Engineer <span>in</span> New York City</h2>
        </header>
        <ol class="sections">
          <li data-section="work"><em>I.</em> Work</li>
          <li data-section="sketches"><em>II.</em> Sketches</li>
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

function applyHoverStyle (el, selector, getColor, prop = 'color', applyStyleToChild = null) {
  const mouseEnterDelegate = delegate(el, selector, 'mouseenter', (e) => {
    const elForStyle = applyStyleToChild ? e.delegateTarget.querySelector(applyStyleToChild) : e.delegateTarget
    style(elForStyle, {
      [prop]: getColor('mouseenter'),
      transition: `${prop} 300ms cubic-bezier(0.42, 0.08, 0.2, 0.98)`
    })
  }, true)

  const mouseLeaveDelegate = delegate(el, selector, 'mouseleave', (e) => {
    const elForStyle = applyStyleToChild ? e.delegateTarget.querySelector(applyStyleToChild) : e.delegateTarget
    style(elForStyle, {
      [prop]: getColor('mouseleave'),
      transition: `${prop} 300ms cubic-bezier(0.42, 0.08, 0.2, 0.98)`
    })
  }, true)

  return [ mouseEnterDelegate, mouseLeaveDelegate ]
}
