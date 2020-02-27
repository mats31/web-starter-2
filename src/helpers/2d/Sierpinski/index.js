import { createCanvas, resizeCanvas } from 'utils/canvas'

export default class Sierpinski {
  constructor({ 
    width = window.innerWidth,
    height = window.innerHeight,
    pixelRatio = true,
    maxPixelRatio = true,
    debug = false,
    size = 0.4,
    maxDepth = 0,
    backgroundColor = false,
    fillColor = "#000000",
  } = {}) {

    this._width = width
    this._height = height
    this._pixelRatio = pixelRatio
    this._maxPixelRatio = maxPixelRatio
    this._debug = debug
    this._size = this._height * size
    this._maxDepth = maxDepth
    this._backgroundColor = backgroundColor
    this._fillColor = fillColor

    this._setupCanvas()
  }

  _setupCanvas(options) {
    this._ctx = createCanvas(this._width, this._height, this._pixelRatio, this._maxPixelRatio)

    if (this._debug) {
      this._ctx.canvas.style.position = 'absolute'
      this._ctx.canvas.style.left = '0'
      this._ctx.canvas.style.top = '0'
      this._ctx.canvas.style.zIndex = '99'
      document.body.appendChild(this._ctx.canvas)
    }
  }

  // Getters / Setters -----

  get canvas() {
    return this._ctx.canvas
  }

  // Update ------

  update() {
    this._draw()
  }

  _draw() {
    if (this._backgroundColor) {
      this._ctx.fillStyle = this._backgroundColor
      this._ctx.fillRect(0, 0, this._width, this._height)
    } else {
      this._ctx.clearRect(0, 0, this._width, this._height)
    }
    this._ctx.save()
    this._ctx.translate(this._width * 0.5, this._height * 0.6)
    this._ctx.scale(this._size, this._size)
    this._drawTriangle(this._maxDepth)
    this._ctx.restore()
  }

  _drawTriangle(depth) {
    let angle = -Math.PI / 2
    // let angle = -Math.PI / 2 * (Math.random() * 2 - 1)

    if (depth === 0) {
      const random = Math.random() * 0
      this._ctx.beginPath()

      // move to top point of triangle
      // this._ctx.moveTo(Math.cos(angle), Math.sin(angle))
      this._ctx.moveTo(Math.cos(angle), Math.sin(angle))
      angle += Math.PI * 2 / 3 + random

      // draw line to lower right point
      // this._ctx.lineTo(Math.cos(angle), Math.sin(angle))
      this._ctx.lineTo(Math.cos(angle), Math.sin(angle))

      // draw line to final point
      angle += Math.PI * 2 / 3 + random
      // this._ctx.lineTo(Math.cos(angle), Math.sin(angle))
      this._ctx.lineTo(Math.cos(angle), Math.sin(angle))

      // fill will close the shape
      this._ctx.fillStyle = this._fillColor
      this._ctx.fill()
    } else {
      const random1 = 0.2 + Math.random() * 0.6
      // draw the top triangle
      this._ctx.save()
      this._ctx.translate(Math.cos(angle) * 0.5, Math.sin(angle) * 0.5)
      this._ctx.scale(random1, random1)
      this._drawTriangle(depth - 1)
      this._ctx.restore()

      // draw the lower right triangle
      angle += Math.PI * 2 / 3
      this._ctx.save()
      this._ctx.translate(Math.cos(angle) * 0.5, Math.sin(angle) * 0.5)
      this._ctx.scale(random1, random1)
      this._drawTriangle(depth - 1)
      this._ctx.restore()

      // draw the lower left triangle
      angle += Math.PI * 2 / 3
      this._ctx.save()
      this._ctx.translate(Math.cos(angle) * 0.5, Math.sin(angle) * 0.5)
      this._ctx.scale(random1, random1)
      this._drawTriangle(depth - 1)
      this._ctx.restore()

    }
  }
}