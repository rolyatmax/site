import mapObj from 'map-obj'

let state = {
  section: 'home'
}

let listeners = []

const reducers = {
  setSection: function (s, section) {
    const validSections = ['home', 'work', 'sketches']
    if (validSections.includes(section)) return { ...s, section }
    return s
  }
}

export function subscribe (fn) {
  listeners.push(fn)
  return function unsubscribe () {
    const i = listeners.indexOf(fn)
    listeners = [
      ...listeners.slice(0, i),
      ...listeners.slice(i + 1)
    ]
  }
}

export const actions = mapObj(reducers, (actionName, reducer) => {
  return [actionName, function (data) {
    const nextState = reducer(state, data)
    if (state === nextState) return
    state = nextState
    listeners.forEach(fn => fn(state))
  }]
})

window.actions = actions
