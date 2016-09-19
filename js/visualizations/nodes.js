import { add, subtract, scale } from 'gl-vec2'
import { setTimeoutPromise } from '../lib/helpers'

const color = 'rgb(230, 230, 230)'
const margin = 40

export default function () {
  let promises = []
  return { start, stop }

  function start (ctx) {
    promises.push(setTimeoutPromise(2000))
    return Promise.all(promises)
  }

  function stop (ctx) {
    return Promise.all(promises)
  }
}

function createNodes (n) {

}
