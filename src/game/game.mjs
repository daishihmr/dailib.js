import { EventDispatcher } from './eventdispatcher.mjs'
import { Mouse } from "./mouse.mjs"

export class Game extends EventDispatcher {
  constructor (canvas) {
    super()

    this.canvas = canvas
    this.context = canvas.getContext('2d')
    this.background = 'transparent'

    this.mouse = new Mouse(canvas)

    this.currentScene = null
    this._running = false
    this.time = 0
    this.deltaTime = 0
  }

  get background () {
    return this.canvas.style.backgroundColor
  }
  set background (value) {
    this.canvas.style.backgroundColor = value
  }

  get width () {
    return this.canvas.width
  }
  set width (value) {
    this.canvas.width = value
  }

  get height () {
    return this.canvas.height
  }
  set height (value) {
    this.canvas.height = value
  }

  start () {
    this._running = true
    this.time = Date.now()
    this.deltaTime = 0
    this._tick()
  }

  stop () {
    this._running = false
  }

  _tick () {
    this.mouse.update(this)

    if (this._running) {
      this.deltaTime = Date.now() - this.time
      this.time += this.deltaTime

      this.context.resetTransform()
      this.context.clearRect(0, 0, this.width, this.height)

      const params = {
        game: this,
        canvas: this.canvas,
        context: this.context,
        mouse: this.mouse,
      }

      if (this.currentScene) {
        this.currentScene.update(params)
      }
      this.fire('update', params)
      requestAnimationFrame(() => this._tick())
    }

    this.mouse.lateUpdate(this)
  }

  switchScene (scene) {
    this.currentScene = scene
  }
}
