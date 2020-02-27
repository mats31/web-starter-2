// import States from 'core/States'

export default class FBO2 {
  constructor({
    width = 256,
    height = 256,
    format = THREE.RGBAFormat,
    type = THREE.FloatType,
    minFilter = THREE.LinearFilter,
    magFilter = THREE.LinearFilter,
    depthBuffer = false,
    stageID = `fbo-${Math.random()}`,
    material,
    debug = false
  }) {
    this.simulation = material

    const options = {
      wrapS: THREE.ClampToEdgeWrapping,
      wrapT: THREE.ClampToEdgeWrapping,
      minFilter,
      magFilter,
      format,
      type,
      stencilBuffer: false,
      depthBuffer,
      generateMipmaps: false,
    }

    this._read = new THREE.WebGLRenderTarget(width, height, options)
    this._write = new THREE.WebGLRenderTarget(width, height, options)

    if (debug) {
      this.debug()
    }
  }

  // State -------

  swap() {
    let temp = this._read
    this._read = this._write
    this._write = temp
  }

  debug() {
    this.debug1 = new THREE.Mesh(new THREE.PlaneBufferGeometry(0.4, 0.4), new THREE.MeshBasicMaterial({ map: this._read.texture }))
    this.debug2 = new THREE.Mesh(new THREE.PlaneBufferGeometry(0.4, 0.4), new THREE.MeshBasicMaterial({ map: this._write.texture }))


    this.debug1.position.set(-0.25, 0, 0.5)
    this.debug2.position.set(0.25, 0, 0.5)

    Stage3d.add(this.debug1)
    Stage3d.add(this.debug2)
  }

  // Getters / Setters -----

  get read() {
    return this._read
  }

  get write() {
    return this._write
  }
}