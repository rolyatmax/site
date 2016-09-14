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

export function dist ([x1, y1], [x2, y2]) {
  let xDist = x2 - x1
  let yDist = y2 - y1
  return Math.sqrt(xDist * xDist + yDist * yDist)
}
