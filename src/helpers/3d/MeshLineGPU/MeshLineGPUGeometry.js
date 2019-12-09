/**
 * MeshLines
 * @author David Ronai - Makio64
 */

import { getRandomHSL } from '../../../utils/color'
import * as THREE from 'three'

export default class MeshLineGPUGeometry extends THREE.BufferGeometry {

  constructor(linesCount, lineDivision, textureWidth, textureHeight, offsetID = 0) {

    super()

    this.linesCount = linesCount
    this.lineDivision = lineDivision
    this.textureWidth = textureWidth
    this.textureHeight = textureHeight
    this.lums = []

    const l = linesCount * lineDivision

    const side = new Float32Array(l * 2)
    const color = new Float32Array(l * 6)
    const ID = new Float32Array(l * 4)
    const FirstID = new Float32Array(l * 4)
    const positions = new Float32Array(l * 6)
    const prevID = new Float32Array(l * 4)
    const nextID = new Float32Array(l * 4)
    const uv = new Float32Array(l * 4)
    const index = new Uint32Array(l * 6)

    let w, j, j2, j4;
    for (let i = 0; i < linesCount; i++) {
      for (let n = 0; n < lineDivision; n++) {
        j = i * lineDivision + n
        j2 = j * 2
        j4 = j * 4

        side[j2] = 1
        side[j2 + 1] = -1

        uv[j4] = uv[j4 + 2] = (j % lineDivision) / (lineDivision - 1)
        uv[j4 + 1] = 0
        uv[j4 + 3] = 1

        FirstID[j4] = FirstID[j4 + 2] = Math.floor((i * lineDivision) % textureWidth) / textureWidth
        FirstID[j4 + 1] = FirstID[j4 + 3] = Math.floor((i * lineDivision) / textureWidth) / textureHeight

        // FirstID[j4] = FirstID[j4 + 2] = i * -1
        // FirstID[j4 + 1] = FirstID[j4 + 3] = i * -1

        ID[j4] = ID[j4 + 2] = Math.floor(j % textureWidth) / textureWidth
        ID[j4 + 1] = ID[j4 + 3] = Math.floor(j / textureWidth) / textureHeight

        //is first ? so prev = himself
        w = n == 0 ? j : j - 1
        prevID[j4] = prevID[j4 + 2] = (w % textureWidth) / textureWidth
        prevID[j4 + 1] = prevID[j4 + 3] = Math.floor(w / textureWidth) / textureHeight

        //is last ? so next = himself
        w = n == lineDivision - 1 ? j : j + 1
        nextID[j4] = nextID[j4 + 2] = (w % textureWidth) / textureWidth
        nextID[j4 + 1] = nextID[j4 + 3] = Math.floor(w / textureWidth) / textureHeight
      }
    }

    let n, k, lum
    for (let i = 0; i < linesCount; i++) {
      for (let j = 0; j < lineDivision - 1; j++) {
        n = j * 2 + i * lineDivision * 2
        k = j * 6 + i * lineDivision * 6
        index[k] = n
        index[k + 1] = n + 1
        index[k + 2] = n + 2
        index[k + 3] = n + 2
        index[k + 4] = n + 1
        index[k + 5] = n + 3
      }
    }

    let c = new THREE.Color(0x000000)
    // let c = new THREE.Color(0xFFFFFF)
    for (let i = 0; i < linesCount; i++) {
      lum = Math.random() * 60 + 120
      this.lums.push(lum)
      let hsl = getRandomHSL({ hue: 160, sat: 120, lum: lum })
      c.setHSL(hsl.h / 255, hsl.s / 255, hsl.l / 255)
      for (let j = 0; j < lineDivision; j++) {
        k = j * 6 + i * lineDivision * 6
        color[k] = color[k + 3] = c.r
        color[k + 1] = color[k + 4] = c.g
        color[k + 2] = color[k + 5] = c.b
      }
    }

    const aID = new THREE.BufferAttribute(ID, 2)
    aID.setUsage(THREE.DynamicDrawUsage)
    const aFirstID = new THREE.BufferAttribute(FirstID, 2)
    aFirstID.setUsage(THREE.DynamicDrawUsage)
    const aPrev = new THREE.BufferAttribute(prevID, 2)
    aPrev.setUsage(THREE.DynamicDrawUsage)
    const aNext = new THREE.BufferAttribute(nextID, 2)
    aNext.setUsage(THREE.DynamicDrawUsage)
    const aUV = new THREE.BufferAttribute(uv, 2)
    aUV.setUsage(THREE.DynamicDrawUsage)
    const aSide = new THREE.BufferAttribute(side, 1)
    aSide.setUsage(THREE.DynamicDrawUsage)
    const aColor = new THREE.BufferAttribute(color, 3)
    aColor.setUsage(THREE.DynamicDrawUsage)
    const aPositions = new THREE.BufferAttribute(positions, 3)
    aPositions.setUsage(THREE.DynamicDrawUsage)
    this.setAttribute('ID', aID)
    this.setAttribute('FirstID', aFirstID)
    this.setAttribute('prevID', aPrev)
    this.setAttribute('nextID', aNext)
    this.setAttribute('uv', aUV)
    this.setAttribute('side', aSide)
    // this.setAttribute('color', aColor)
    this.setAttribute('position', aColor)

    const aIndex = new THREE.BufferAttribute(index, 1)
    aIndex.setUsage(THREE.DynamicDrawUsage)
    this.setIndex(aIndex)
  }

  // sizes is an array of line size, for exemple [ 12 , 24 , 11 ]
  updateSizes(sizes, total) {

    this.sizes = sizes
    const side = this.attributes.side.array
    const uv = this.attributes.uv.array
    const FirstID = this.attributes.FirstID.array
    const ID = this.attributes.ID.array
    const prevID = this.attributes.prevID.array
    const nextID = this.attributes.nextID.array

    let w, j, j2, j4, b = 0
    let textureWidth = this.textureWidth
    let textureHeight = this.textureHeight

    for (let i = 0; i < sizes.length; i++) {
      let lineDivision = sizes[i]
      for (let n = 0; n < lineDivision; n++) {
        j = b + n
        j2 = j * 2
        j4 = j * 4

        side[j2] = 1
        side[j2 + 1] = -1

        uv[j4] = uv[j4 + 2] = n / (lineDivision - 1)
        uv[j4 + 1] = 0
        uv[j4 + 3] = 1

        FirstID[j4] = FirstID[j4 + 2] = Math.floor((i * lineDivision) % textureWidth) / textureWidth
        FirstID[j4 + 1] = FirstID[j4 + 3] = Math.floor((i * lineDivision) / textureWidth) / textureHeight

        ID[j4] = ID[j4 + 2] = Math.floor(j % textureWidth) / textureWidth
        ID[j4 + 1] = ID[j4 + 3] = Math.floor(j / textureWidth) / textureHeight

        //is first ? so prev = himself
        w = n == 0 ? j : j - 1
        prevID[j4] = prevID[j4 + 2] = (w % textureWidth) / textureWidth
        prevID[j4 + 1] = prevID[j4 + 3] = Math.floor(w / textureWidth) / textureHeight

        //is last ? so next = himself
        w = n == lineDivision - 1 ? j : j + 1
        nextID[j4] = nextID[j4 + 2] = (w % textureWidth) / textureWidth
        nextID[j4 + 1] = nextID[j4 + 3] = Math.floor(w / textureWidth) / textureHeight
      }
      b += lineDivision
    }

    let n, k
    b = 0
    let index = new Uint32Array(total * 6)
    for (let i = 0; i < sizes.length; i++) {
      let lineDivision = sizes[i]
      for (let j = 0; j < lineDivision - 1; j++) {
        n = j * 2 + b * 2
        k = j * 6 + b * 6
        index[k] = n
        index[k + 1] = n + 1
        index[k + 2] = n + 2
        index[k + 3] = n + 2
        index[k + 4] = n + 1
        index[k + 5] = n + 3
      }
      b += lineDivision
    }

    this.attributes.side.needsUpdate = true
    this.attributes.uv.needsUpdate = true
    this.attributes.ID.needsUpdate = true
    this.attributes.FirstID.needsUpdate = true
    this.attributes.prevID.needsUpdate = true
    this.attributes.nextID.needsUpdate = true
    this.index.setArray(index)
    this.index.needsUpdate = true
  }

  updateColor(hue) {
    const color = this.attributes.color.array
    const linesCount = this.linesCount
    const lineDivision = this.lineDivision
    let n, k
    let c = new THREE.Color()
    hue = hue || Math.random() * 255
    for (let i = 0; i < linesCount; i++) {
      let hsl = getRandomHSL({ hue: hue, sat: 120, lum: this.lums[i] })
      c.setHSL(hsl.h / 255, hsl.s / 255, hsl.l / 255)
      for (let j = 0; j < lineDivision; j++) {
        k = j * 6 + i * lineDivision * 6
        color[k] = color[k + 3] = c.r
        color[k + 1] = color[k + 4] = c.g
        color[k + 2] = color[k + 5] = c.b
      }
    }
    this.attributes.color.needsUpdate = true
  }

  updateColorFromArray(hues) {
    const color = this.attributes.color.array
    const linesCount = this.linesCount
    const lineDivision = this.lineDivision
    let n, k
    let c = new THREE.Color()
    for (let i = 0; i < linesCount; i++) {
      let hue = hues[Math.floor(Math.random() * hues.length)]
      // let hsl = getRandomHSL({hue:hue.h,sat:hue.s,lum:hue.l})
      c.set(`hsl(${hue.h},${hue.s}%,${hue.l + Math.floor((Math.random() - .5) * 16)}%)`)
      for (let j = 0; j < lineDivision; j++) {
        k = j * 6 + i * lineDivision * 6
        color[k] = color[k + 3] = c.r
        color[k + 1] = color[k + 4] = c.g
        color[k + 2] = color[k + 5] = c.b
      }
    }
    this.attributes.color.needsUpdate = true
  }
}
