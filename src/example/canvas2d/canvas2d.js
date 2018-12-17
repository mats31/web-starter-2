import { createCanvas, resizeCanvas } from 'utils/canvas'

export default class canvas2D {
	constructor() {
		this._setupCanvas()
	}

	_setupCanvas() {
		this._width = window.innerWidth
    this._height = window.innerHeight

    this._ctx = createCanvas(this._width, this._height, true, 2)
    this._ctx.font = "14.8rem playfairdisplay";

    this._ctx.canvas.style.position = 'absolute'
    this._ctx.canvas.style.left = '0'
    this._ctx.canvas.style.top = '0'
    this._ctx.canvas.style.zIndex = '99'
    this._ctx.canvas.style.letterSpacing = '0'
	}

	resize() {
    this._width = window.innerWidth
    this._height = window.innerHeight

    resizeCanvas(this._ctx, this._width, this._height, true, 2)
  }

  update() {
    this._draw()
  }

  _draw() {
    this._ctx.clearRect(0, 0, this._width, this._height)
  }
}