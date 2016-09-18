const { requestAnimationFrame } = window

export function style (element, styles) {
  Object.keys(styles).forEach((style) => {
    element.style[style] = styles[style]
  })
}

export function shuffle (list) {
  list = [...list]
  let result = []
  while (list.length) {
    const i = Math.random() * list.length | 0
    result = result.concat(list.splice(i, 1))
  }
  return result
}

export function easeIn (step, start, change) {
  return change * (1 - Math.pow(1 - step, 3)) + start
}

export function startAnimation (renderFn, duration) {
  var startTime
  return new Promise(function (resolve) {
    function _render (t) {
      startTime = startTime || t
      var step = (t - startTime) / duration
      renderFn(step)
      if (step < 1) {
        requestAnimationFrame(_render)
      } else {
        resolve()
      }
    }
    requestAnimationFrame(_render)
  })
}

export function setTimeoutPromise (wait) {
  return new Promise(resolve => setTimeout(resolve, wait))
}
