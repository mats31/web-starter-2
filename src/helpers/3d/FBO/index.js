export default class FBO {
  constructor({
    width = 256,
    height = 256,
    stageID = `fbo-${Math.random()}`,
    material,
  }) {
    this.simulation = material

    const options = {
      wrapS: THREE.ClampToEdgeWrapping,
      wrapT: THREE.ClampToEdgeWrapping,
      minFilter: THREE.NearestFilter,
      magFilter: THREE.NearestFilter,
      format: THREE.RGBAFormat,
      type: THREE.FloatType,
      stencilBuffer: false,
      depthBuffer: false,
      generateMipmaps: false,
    }

    this.rt = new THREE.WebGLRenderTarget(width, height, options)
    this.rt2 = new THREE.WebGLRenderTarget(width, height, options)
    this.rt3 = new THREE.WebGLRenderTarget(width, height, options)


    this._scene = Stage3d.addScene({ id: stageID })
    this._camera = Stage3d.addOrthographicCamera({ id: stageID, width: 1, height: 1, near: 0, far: 1, onResize: false })
    this._mesh = new THREE.Mesh(new THREE.PlaneBufferGeometry(1, 1, 1, 1))

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