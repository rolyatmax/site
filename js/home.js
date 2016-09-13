import { style } from './helpers'
import { createBlurFader, createFader } from './faders'
import { twitter, instagram, github } from './social-icons'


export default {
  willMount (select) {
    const title = select('.title')
    this.title = createBlurFader(title)
    // manually fix kerning around the `a` because the <span> tags ruin it
    const a = this.title.el.querySelectorAll('span')[1]
    style(a, { margin: '0 -4px 0 -5px' })

    this.secondaryElements = ['.sections', '.social-icons', '.subtitle']
      .map(select)
      .map(createFader)
  },

  didMount () {
    this.title.fadeIn(1000)
    setTimeout(() => {
      this.secondaryElements.forEach(el => el.fadeIn(1000, 'ease-in'))
    }, 550)
  },

  willUnmount () {
    this.title.fadeOut(1000)
    setTimeout(() => {
      this.secondaryElements.forEach(el => el.fadeOut(1000, 'ease-out'))
    }, 550)
  },

  render () {
    return `
      <main>
        <header>
          <h1 class="title">Taylor Baldwin</h1>
          <h2 class="subtitle">Software Engineer <span>in</span> New York City</h2>
        </header>
        <ol class="sections">
          <li>
            <span><em>I.</em> Work</span>
            <span class="cover"><em>I.</em> Work</span>
          </li>
          <li>
            <span><em>II.</em> Sketches</span>
            <span class="cover"><em>II.</em> Sketches</span>
          </li>
        </ol>
      </main>
      <ul class="social-icons">
        <li class="github">${github}</li>
        <li class="instagram">${instagram}</li>
        <li class="twitter">${twitter}</li>
      </ul>
    `
  }
}
