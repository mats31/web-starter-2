// import States from 'core/States'
import * as THREE from 'three'

export default class FBO1 {
  constructor({
    width = 256,
    height = 256,
    format = THREE.RGBAFormat,
    type = THREE.UnsignedByteType,
    minFilter = THREE.LinearFilter,
    magFilter = THREE.LinearFilter,
    depthBuffer = false,
    stageID = `fbo-${Math.random()}`,
    debug = false
  } = {}) {

    const options = {
      wrapS: THREE.ClampToEdgeWrapping,
      wrapT: THREE.ClampToEdgeWrapping,
      minFilter,
      magFilter,
      format,
      stencilBuffer: false,
      depthBuffer,
      generateMipmaps: false,
    }

    this._fbo = new THREE.WebGLRenderTarget(width, height, options)

    if (debug) {
      this.debug()
    }
  }

  // State -------

  debug() {
    this.debug = new THREE.Mesh(new THREE.PlaneBufferGeometry(0.4, 0.4), new THREE.MeshBasicMaterial({ map: this._fbo.texture }))

    this.debug.position.set(0, 0, 0)

    Stage3d.add(this.debug)
  }

  setSize(w, h) {
    this._fbo.setSize(w, h)
  }

  // Getters / Setters -----

  get renderTarget() {
    return this._fbo
  }

  get texture() {
    return this._fbo.texture
  }
}