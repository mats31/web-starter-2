import BigTriangle from 'helpers/3d/BigTriangle'
import FBO from 'helpers/3d/FBO1'
import vertexShader from './shaders/gaussian-basic.vs'
import fragmentShader from './shaders/gaussian-basic.fs'
import fragmentGaussianShader from './shaders/gaussian.fs'

export default class GaussianBlur {

  // setup ---------------------------------------------------------------

  constructor({
    width = 256,
    height = 256,
    texture,
    renderer,
    iterations = 2,
    radius = 4,
    alpha = 1,
    clearColor = '#000000',
    inputMaterial = false,
    fragmentGaussianShader,
  }) {

    this._width = width
    this._height = height

    this._texture = texture
    this._renderer = renderer

    this._iterations = iterations
    this._radius = radius

    this._fragmentGaussianShader = fragmentGaussianShader

    this._alpha = alpha

    this._clearColor = clearColor
    this._clearColorObj = new THREE.Color(this._clearColor)
    this._clearColorVec = new THREE.Vector3(
      this._clearColorObj.r,
      this._clearColorObj.g,
      this._clearColorObj.b
    )
    
    this._inputMaterial = inputMaterial
    if (!this._inputMaterial) {
      this._inputMaterial = new THREE.RawShaderMaterial({
        uniforms: {
          t_diffuse: { value: this._texture },
          u_clearColor: { value: this._clearColorVec },
          u_alpha: { value: this._alpha }
        },
        transparent: true,
        vertexShader,
        fragmentShader
      })
    }

    this._setup()
  }

  _setup() {
    this._setupFBO()
    this._setupScene()
  }

  _setupFBO() {
    this._FBO1 = new FBO({
      height: this._height,
      width: this._width,
    })

    this._FBO2 = new FBO({
      height: this._height,
      width: this._width,
    })
  }

  _setupScene() {

    // Scenes
    this._sceneInput = Stage3d.addScene()
    this._sceneBlurH = Stage3d.addScene()
    this._sceneBlurV = Stage3d.addScene()

    // Orthographic Camera
    this._camera = Stage3d.addOrthographicCamera({ width: 1, height: 1, near: 0, far: 1, onResize: false })

    this._bigTriangleI = new BigTriangle({
      material: this._inputMaterial,
    })

    this._bigTriangleH = new BigTriangle({
      material: new THREE.RawShaderMaterial({
        transparent: true,
        uniforms: {
          t_diffuse: { value: this._FBO1.texture },
          u_direction: { value: new THREE.Vector2(0, 0) },
          u_resolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight)  },
          u_radius: { value: this._radius },
          u_mouse: { value: new THREE.Vector2(0, 0) }
        },
        vertexShader,
        fragmentShader: this._fragmentGaussianShader
      })
    })

    this._bigTriangleV = new BigTriangle({
      material: new THREE.RawShaderMaterial({
        transparent: true,
        uniforms: {
          t_diffuse: { type: "t", value: this._FBO2.texture },
          u_direction: { value: new THREE.Vector2(0, 0) },
          u_resolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
          u_radius: { type: "f", value: this._radius },
          u_mouse: { value: new THREE.Vector2(0, 0) }
        },
        vertexShader,
        fragmentShader: this._fragmentGaussianShader
      })
    })

    this._sceneInput.add(this._bigTriangleI)
    this._sceneBlurH.add(this._bigTriangleH)
    this._sceneBlurV.add(this._bigTriangleV)

    this._bigTriangleH.material.uniforms.u_direction.value.set(this._radius, 0)
    this._bigTriangleV.material.uniforms.u_direction.value.set(0, this._radius)
  }

  // STATE ---------------------------------------------------------------

  // SETTERS -------------------------------------------------------------

  get inputMaterial() {
    return this._inputMaterial
  }

  get texture() {
    return this._FBO1.texture;
  }

  get horizontalMaterial() {
    return this._bigTriangleH.material
  }

  get verticalMaterial() {
    return this._bigTriangleV.material
  }

  get radius() {
    return this._radius
  }

  set radius(r) {
    this._radius = r;

    this._bigTriangleH.material.uniforms.u_radius.value = r
    this._bigTriangleV.material.uniforms.u_radius.value = r

    this._bigTriangleV.material.uniforms.u_direction.value.set(0, this._radius)
    this._bigTriangleH.material.uniforms.u_direction.value.set(this._radius, 0)
  }

  get alpha() {
    return this._alpha
  }

  set alpha(a) {
    this._alpha = a;
  }

  get iterations() {
    return this._iterations
  }

  set iterations(i) {
    this._iterations = i;
  }

  set width(i) {
    this._width = i;

    this._FBO1.setSize(this._width, this._height)
    this._FBO2.setSize(this._width, this._height)
  }

  set height(i) {
    this._height = i;

    this._FBO1.setSize(this._width, this._height)
    this._FBO2.setSize(this._width, this._height)
  }

  // EVENTS --------------------------------------------------------------

  resize(w, h) {
    this._FBO1.setSize(w, h)
    this._FBO2.setSize(w, h)

    this._bigTriangleH.material.uniforms.u_resolution.value.set(window.innerWidth, window.innerHeight)
    this._bigTriangleV.material.uniforms.u_resolution.value.set(window.innerWidth, window.innerHeight)
  }

  // UPDATE --------------------------------------------------------------

  update() {

    // this._renderer.autoClear = false
  
    this._renderer.setRenderTarget(this._FBO1.renderTarget)
    this._renderer.render(this._sceneInput, this._camera)

    for (let i = 0; i < this._iterations; i++) {
      this._renderer.setRenderTarget(this._FBO2.renderTarget)
      this._renderer.render(this._sceneBlurH, this._camera)

      this._renderer.setRenderTarget(this._FBO1.renderTarget)
      this._renderer.render(this._sceneBlurV, this._camera)

    }

    // this._renderer.autoClear = true
  }
};
