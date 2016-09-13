export function style(element, styles) {
  Object.keys(styles).forEach((style) => {
    element.style[style] = styles[style]
  })
}

export function shuffle(list) {
  list = [...list]
  let result = []
  while (list.length) {
    const i = Math.random() * list.length | 0
    result = result.concat(list.splice(i, 1))
  }
  return result
}
