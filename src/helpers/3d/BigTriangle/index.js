import vertexShader from './shaders/big-triangle.vs'
import fragmentShader from './shaders/big-triangle.fs'

export default class BigTriangle extends THREE.Object3D {
  constructor({
    positions = new Float32Array([-0.5, -0.5, 1.5, -0.5, -0.5, 1.5]),
    uvs = new Float32Array([0, 0, 2, 0, 0, 2]),
    stageID = `big-triangle-${Math.random()}`,
    material = new THREE.RawShaderMaterial({
      uniforms: {
        t_diffuse: null,
      },
      vertexShader,
      fragmentShader,
    }),
    texture = null,
    scene = false
  } = {}) {
    super()

    this._camera = Stage3d.addOrthographicCamera({ id: stageID, width: 1, height: 1, near: 0, far: 1, onResize: false })

    this._geometry = new THREE.BufferGeometry()
    this._geometry.setAttribute('position', new THREE.BufferAttribute(positions, 2))
    this._geometry.setAttribute('uv', new THREE.BufferAttribute(uvs, 2))

    if (texture) {
      material.uniforms.t_diffuse = { value: texture }
      material.uniforms.t_diffuse.value.needsUpdate = true
    }

    this._material = material

    this._mesh = new THREE.Mesh(this._geometry, this._material)
    this.add(this._mesh)

    if (scene) {
      this._scene = Stage3d.addScene({ id: stageID })
      this._scene.add(this)
    }
  }

  // Getters / Setters -----

  get material() {
    return this._material
  }

  get scene() {
    return this._scene
  }

  get camera() {
    return this._camera
  }
}