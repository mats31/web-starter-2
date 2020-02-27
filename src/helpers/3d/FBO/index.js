// import States from 'core/States'

export default class FBO {
  constructor({
    width = 256,
    height = 256,
    format = THREE.RGBAFormat,
    type = THREE.FloatType,
    minFilter = THREE.NearestFilter,
    magFilter = THREE.NearestFilter,
    depthBuffer = false,
    stageID = `fbo-${Math.random()}`,
    material,
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

    this.rt = new THREE.WebGLRenderTarget(width, height, options)
    this.rt2 = new THREE.WebGLRenderTarget(width, height, options)
    this.rt3 = new THREE.WebGLRenderTarget(width, height, options)


    this._scene = Stage3d.addScene({ id: stageID })
    this._camera = Stage3d.addOrthographicCamera({ id: stageID, width: 1, height: 1, near: 0, far: 1, onResize: false })
    this._geometry = new THREE.BufferGeometry()
    this._geometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array([-0.5, -0.5, 1.5, -0.5, -0.5, 1.5]), 2))
    this._geometry.setAttribute('uv', new THREE.BufferAttribute(new Float32Array([0, 0, 2, 0, 0, 2]), 2))
    this._mesh = new THREE.Mesh(this._geometry)
    // this._mesh = new THREE.Mesh(this._geometry, new THREE.MeshBasicMaterial({ map: States.resources.getTexture('uv').media }))
    // this._mesh.scale.set(0.5, 0.5, 1)

    this._scene.add(this._mesh)
    this.texture = this.simulation.uniforms.t_pos.value

    // this.debug()
  }

  // State -------

  copy() {
    this._mesh.material = this.getCopyMaterial()

    this.update()
    this.update()
    this.update()

    this._mesh.material = this.simulation
  }

  // Getter - Setters -------

  set texture(value) {
    this.simulation.uniforms.t_pos.value = value
    this.copy()
  }

  get current() { return this.rt3.texture }

  get old() { return this.rt2.texture }

  getCopyMaterial() {
    if (this._mesh.material.type === 'MeshBasicMaterial') {
      this.copyMaterial = new THREE.ShaderMaterial({
        uniforms: {
          t_pos: { type: 't', value: this.simulation.uniforms.t_pos.value }
        },
        vertexShader: require('./shaders/copy.vs'),
        fragmentShader: require('./shaders/copy.fs'),
      })
    }

    return this.copyMaterial
  }

  // Render ------

  update() {
    Stage3d.renderer.setClearColor(0, 1)
    Stage3d.renderer.setRenderTarget(this.rt)
    Stage3d.renderer.render(this._scene, this._camera)

    const tmp = this.rt
    this.rt = this.rt2
    this.rt2 = this.rt3
    this.rt3 = tmp


    this.simulation.uniforms.t_pos.value = this.rt3.texture
    this.simulation.uniforms.t_oPos.value = this.rt2.texture
  }

  debug() {
    this.debug1 = new THREE.Mesh(new THREE.PlaneBufferGeometry(2, 2), new THREE.MeshBasicMaterial({ map: this.rt.texture }))
    this.debug2 = new THREE.Mesh(new THREE.PlaneBufferGeometry(2, 2), new THREE.MeshBasicMaterial({ map: this.rt2.texture }))
    this.debug3 = new THREE.Mesh(new THREE.PlaneBufferGeometry(2, 2), new THREE.MeshBasicMaterial({ map: this.rt3.texture }))


    this.debug1.position.set(-4, 0, 90)
    this.debug2.position.set(0, 0, 90)
    this.debug3.position.set(4, 0, 90)

    Stage3d.add(this.debug1)
    Stage3d.add(this.debug2)
    Stage3d.add(this.debug3)
  }
}