import { style, shuffle, setTimeoutPromise, rAFPromise } from '../lib/helpers'

const easeIn = 'cubic-bezier(0.07, 0.9, 0.64, 0.98)'
const easeOut = 'cubic-bezier(0.92, 0.06, 0.94, 0.5)'

export function createBlurFader (element, color) {
  const html = element
    .textContent.split('')
    .map(letter => `<span>${letter}</span>`)
    .join('')
  element.innerHTML = html
  const letters = Array.from(element.children)
  style(element, { color: `rgba(0, 0, 0, 0)` })

  return {
    el: element,
    fadeIn (duration) {
      letters.forEach((letter) => {
        style(letter, {
          textShadow: `${color} 0 0 50px`,
          opacity: 0
        })
      })
      return rAFPromise().then(() => {
        const promises = shuffle(letters).map((letter, i) => {
          const delay = i * 50
          style(letter, {
            textShadow: `${color} 0 0 0`,
            opacity: 1,
            transition: [
              `text-shadow ${duration}ms ${easeIn} ${delay}ms`,
              `opacity ${duration}ms ease-in ${delay}ms`
            ].join(', ')
          })
          return setTimeoutPromise(delay + duration + 100)
        })
        return Promise.all(promises)
      }).then(() => {
        style(element, { color: color })
        letters.forEach(l => style(l, { textShadow: 'none' }))
      })
    },
    fadeOut (duration) {
      const promises = shuffle(letters).map((letter, i) => {
        const delay = i * 50
        style(letter, {
          opacity: 0,
          transition: `opacity ${duration}ms ease-out ${delay}ms`
        })
        return setTimeoutPromise(delay + duration + 100)
      })
      return Promise.all(promises)
    }
  }
}

export function createFader (element) {
  style(element, {
    opacity: 0
  })
  return {
    el: element,
    fadeIn (duration, ease = 'linear') {
      style(element, {
        opacity: 1,
        transition: `opacity ${duration}ms ${ease}`
      })
      return setTimeoutPromise(duration)
    },
    fadeOut (duration, ease = 'linear') {
      style(element, {
        opacity: 0,
        transition: `opacity ${duration}ms ${ease}`
      })
      return setTimeoutPromise(duration)
    }
  }
}
