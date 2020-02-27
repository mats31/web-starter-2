import States from 'core/States'
import BigTriangle from 'helpers/3d/BigTriangle'
// import FBO from 'helpers/3d/FBO'
import FBO2 from 'helpers/3d/FBO2'
import { autobind } from 'core-decorators'
import vertexShader from './shaders/fluid.vs'
import fragmentShader from './shaders/fluid.fs'
import splatVs from './shaders/splat.vs'
import splatFs from './shaders/splat.fs'
import curlVs from './shaders/curl.vs'
import curlFs from './shaders/curl.fs'
import vorticityVs from './shaders/vorticity.vs'
import vorticityFS from './shaders/vorticity.fs'
import divergenceVs from './shaders/divergence.vs'
import divergenceFs from './shaders/divergence.fs'
import clearVs from './shaders/clear.vs'
import clearFs from './shaders/clear.fs'
import pressureVs from './shaders/pressure.vs'
import pressureFs from './shaders/pressure.fs'
import gradientVs from './shaders/gradient.vs'
import gradientFs from './shaders/gradient.fs'
import advectionVs from './shaders/advection.vs'
import advectionFs from './shaders/advection.fs'
import advectionManualFs from './shaders/advection-manual.fs'

export default class FluidSimulation extends THREE.Object3D {
  constructor({
    autoClear = true,
    autoSplat = true,
    gui = true,
    folder = null,
    bigTriangle = true,
    iterations = 3,
    densityDissipation = 0.97,
    velocityDissipation = 0.98,
    pressureDissipation = 0.8,
    curlStrength = 20,
    radius = 0.2,
  } = {}) {
    super()

    this._gl = Stage3d.renderer.getContext()

    this._autoClear = autoClear
    this._autoSplat = autoSplat
    this._folder = folder
    this._hasBigTriangle = bigTriangle

    this._bgColor = new THREE.Vector3(0, 0, 0)
    this._fluidColor = new THREE.Vector3(1, 1, 1)
    this._rendererSize = new THREE.Vector2()
    this._lastMouse = new THREE.Vector2()
    this._lastSplat = new THREE.Vector2()
    this._splats = []

    // Resolution of simulation
    this._simRes = 128
    this._dyeRes = 512

    // Main inputs to control look and feel of fluid
    this._iterations = iterations
    this._densityDissipation = densityDissipation
    this._velocityDissipation = velocityDissipation
    this._pressureDissipation = pressureDissipation
    this._curlStrength = curlStrength
    this._radius = radius
    this._area = 1
    this._opacity = 1
    this._multiColorAmplitude = 0.0025

    this._supportLinearFiltering = Stage3d.renderer.extensions.get('OES_texture_half_float_linear')
    // const halfFloat = Stage3d.renderer.extensions.get('OES_texture_half_float') ? Stage3d.renderer.extensions.get('OES_texture_half_float').HALF_FLOAT_OES : this._gl.UNSIGNED_BYTE;
    // const filtering = this._supportLinearFiltering ? this._gl.LINEAR : this._gl.NEAREST;

    // const rgba = this._getSupportedFormat(this._gl, this._gl.RGBA, this._gl.RGBA, halfFloat);
    // const rg = rgba;
    // const r = rgba;

    // console.log(rgba.format)
    // console.log(halfFloat)
    // console.log(rgba.internalFormat)
    // console.log(filtering)

    // console.log(THREE.RGBAFormat)
    // console.log(THREE.RGBAFormat)
    // console.log(THREE.LinearFilter)

    if (gui) this._setupGUI()
    this._setupFBOs()
    this._setupPrograms()
    if (this._hasBigTriangle) this._setupFinalRender()

    this.addEvents()
  }

  _setupGUI() {
    window.guiParams.fluid = {
      iterations: this._iterations,
      densityDissipation: this._densityDissipation,
      velocityDissipation: this._velocityDissipation,
      pressureDissipation: this._pressureDissipation,
      curlStrength: this._curlStrength,
      radius: this._radius,
      area: this._area,
      opacity: this._opacity,
      background_color: [this._bgColor.x, this._bgColor.y, this._bgColor.z],
      fluid_color: [this._fluidColor.x * 255, this._fluidColor.y * 255, this._fluidColor.z * 255],
      multi_color: false,
      multi_color_amplitude: this._multiColorAmplitude,
    }

    this._folder.add(window.guiParams.fluid, 'iterations', 1, 20).step(1).onChange((value) => {
      this._iterations = value
    })
    this._folder.add(window.guiParams.fluid, 'densityDissipation', 0, 0.999).step(0.0001).onChange((value) => {
      this._densityDissipation = value
    })
    this._folder.add(window.guiParams.fluid, 'velocityDissipation', 0.8, 1.05).step(0.01).onChange((value) => {
      this._velocityDissipation = value
    })
    this._folder.add(window.guiParams.fluid, 'pressureDissipation', 0, 1).step(0.01).onChange((value) => {
      this._pressureDissipation = value
    })
    this._folder.add(window.guiParams.fluid, 'curlStrength', 0, 140).step(0.1).onChange((value) => {
      this._curlStrength = value
    })
    this._folder.add(window.guiParams.fluid, 'radius', 0, 1).step(0.01).onChange((value) => {
      this._radius = value
    })
    this._folder.add(window.guiParams.fluid, 'area', 0, 2.5).step(0.01).onChange((value) => {
      this._area = value
    })
    this._folder.add(window.guiParams.fluid, 'opacity', 0, 2).step(0.01).onChange((value) => {
      this._opacity = value
    })
    this._folder.addColor(window.guiParams.fluid, 'background_color').onChange((value) => {
      this._bgColor.x = value[0] / 255
      this._bgColor.y = value[1] / 255
      this._bgColor.z = value[2] / 255
    })
    this._folder.addColor(window.guiParams.fluid, 'fluid_color').onChange((value) => {
      this._fluidColor.x = value[0] / 255
      this._fluidColor.y = value[1] / 255
      this._fluidColor.z = value[2] / 255
    })
    this._folder.add(window.guiParams.fluid, 'multi_color')
    this._folder.add(window.guiParams.fluid, 'multi_color_amplitude', 0.0001, 0.005).step(0.0001).onChange((value) => {
      this._multiColorAmplitude = value
    })
  }

  _setupFBOs() {
    {
      this._curl = new THREE.WebGLRenderTarget(this._simRes, this._simRes, {
        wrapS: THREE.ClampToEdgeWrapping,
        wrapT: THREE.ClampToEdgeWrapping,
        minFilter: THREE.NearestFilter,
        magFilter: THREE.NearestFilter,
        format: THREE.RGBAFormat,
        type: THREE.HalfFloatType,
        stencilBuffer: false,
        depthBuffer: false,
        generateMipmaps: false,
      })

      // this.debug = new THREE.Mesh(new THREE.PlaneBufferGeometry(0.4, 0.4), new THREE.MeshBasicMaterial({ map: this._curl.texture }))
      // this.debug.position.set(0, 0, 0.5)
      // Stage3d.add(this.debug)

      this._divergence = new THREE.WebGLRenderTarget(this._simRes, this._simRes, {
        wrapS: THREE.ClampToEdgeWrapping,
        wrapT: THREE.ClampToEdgeWrapping,
        minFilter: THREE.NearestFilter,
        magFilter: THREE.NearestFilter,
        format: THREE.RGBAFormat,
        type: THREE.HalfFloatType,
        stencilBuffer: false,
        depthBuffer: false,
        generateMipmaps: false,
      })

      this._density = new FBO2({
        width: this._dyeRes,
        height: this._dyeRes,
        type: THREE.HalfFloatType,
      })

      this._velocity = new FBO2({
        width: this._simRes,
        height: this._simRes,
        type: THREE.HalfFloatType,
        // debug: true
      })

      this._pressure = new FBO2({
        width: this._simRes,
        height: this._simRes,
        type: THREE.HalfFloatType,
        minFilter: THREE.NearestFilter,
        magFilter: THREE.NearestFilter,
        // debug: true,
      })
    }
  }

  _setupPrograms() {
    const texelSize = { value: new THREE.Vector2(1 / this._simRes, 1 / this._simRes ) }

    this._splatProgram = new BigTriangle({
      material: new THREE.RawShaderMaterial({
        uniforms: {
          t_target: { value: null },
          u_aspectRatio: { value: 1 },
          u_color: { value: new THREE.Vector3() },
          u_point: { value: new THREE.Vector2() },
          u_radius: { value: 1 },
        },
        vertexShader: splatVs,
        fragmentShader: splatFs,
        depthTest: false,
        depthWrite: false,
        transparent: false
      }),
      scene: true,
    })

    this._curlProgram = new BigTriangle({
      material: new THREE.RawShaderMaterial({
        uniforms: {
          t_velocity: { value: null },
          u_texelSize: texelSize,
        },
        vertexShader: curlVs,
        fragmentShader: curlFs,
        depthTest: false,
        depthWrite: false,
        transparent: false
      }),
      scene: true,
    })

    this._vorticityProgram = new BigTriangle({
      material: new THREE.RawShaderMaterial({
        uniforms: {
          t_velocity: { value: null },
          t_curl: { value: null },
          u_texelSize: texelSize,
          u_curl: { value: this._curlStrength },
          u_dt: { value: 0.016 },
        },
        vertexShader: vorticityVs,
        fragmentShader: vorticityFS,
        depthTest: false,
        depthWrite: false,
        transparent: false
      }),
      scene: true,
    })

    this._divergenceProgram = new BigTriangle({
      material: new THREE.RawShaderMaterial({
        uniforms: {
          t_velocity: { value: null },
          u_texelSize: texelSize,
        },
        vertexShader: divergenceVs,
        fragmentShader: divergenceFs,
        depthTest: false,
        depthWrite: false,
        transparent: false
      }),
      scene: true,
    })

    this._clearProgram = new BigTriangle({
      material: new THREE.RawShaderMaterial({
        uniforms: {
          t_diffuse: { value: null },
          u_texelSize: texelSize,
          u_dissipation: { value: this._pressureDissipation },
        },
        vertexShader: clearVs,
        fragmentShader: clearFs,
        depthTest: false,
        depthWrite: false,
        transparent: false
      }),
      scene: true,
    })

    this._pressureProgram = new BigTriangle({
      material: new THREE.RawShaderMaterial({
        uniforms: {
          u_texelSize: texelSize,
          t_pressure: { value: null },
          t_divergence: { value: null },
        },
        vertexShader: pressureVs,
        fragmentShader: pressureFs,
        depthTest: false,
        depthWrite: false,
        transparent: false
      }),
      scene: true,
    })

    this._gradientProgram = new BigTriangle({
      material: new THREE.RawShaderMaterial({
        uniforms: {
          t_pressure: { value: null },
          t_velocity: { value: null },
          u_texelSize: texelSize,
        },
        vertexShader: gradientVs,
        fragmentShader: gradientFs,
        depthTest: false,
        depthWrite: false,
        transparent: false
      }),
      scene: true,
    })

    this._advectionProgram = new BigTriangle({
      material: new THREE.RawShaderMaterial({
        uniforms: {
          t_source: { value: null },
          t_velocity: { value: null },
          u_texelSize: texelSize,
          u_dyeTexelSize: { value: new THREE.Vector2(1 / this._dyeRes, 1 / this._dyeRes) },
          u_dt: { value: 0.016 },
          u_dissipation: { value: 1.0 },
        },
        vertexShader: advectionVs,
        fragmentShader: this._supportLinearFiltering ? advectionFs : advectionManualFs,
        depthTest: false,
        depthWrite: false,
        transparent: false
      }),
      scene: true,
    })
  }

  _setupFinalRender() {
    this._mesh = new BigTriangle({
      material: new THREE.RawShaderMaterial({
        uniforms: {
          t_diffuse: { value: this._density.read.texture },
          u_fluidColor: { value: this._fluidColor },
          u_resolution: { value: new THREE.Vector2(States.global.width, States.global.height) },
          u_bg: { value: this._bgColor },
          u_opacity: { value: this._opacity },
          u_multiColor: { value: 0 },
          u_multiColorAmplitude: { value: this._multiColorAmplitude },
          u_time: { value: 0 },
        },
        vertexShader,
        fragmentShader,
        depthTest: true,
        depthWrite: true,
        transparent: false,
        // blending: THREE.AdditiveBlending
      })
    })

    this.add(this._mesh)
  }

  addEvents() {
    Signals.onResize.add(this._onResize)
  }

  _supportRenderTextureFormat(gl, internalFormat, format, type) {
    let texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texImage2D(gl.TEXTURE_2D, 0, internalFormat, 4, 4, 0, format, type, null);
    let fbo = gl.createFramebuffer();
    gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0);
    const status = gl.checkFramebufferStatus(gl.FRAMEBUFFER);
    if (status != gl.FRAMEBUFFER_COMPLETE) return false;
    return true;
  }

  _getSupportedFormat(gl, internalFormat, format, type) {
    if (!this._supportRenderTextureFormat(gl, internalFormat, format, type)) {
      switch (internalFormat) {
        case gl.R16F:
          return this._getSupportedFormat(gl, gl.RG16F, gl.RG, type);
        case gl.RG16F:
          return this._getSupportedFormat(gl, gl.RGBA16F, gl.RGBA, type);
        default:
          return null;
      }
    }
    return { internalFormat, format };
  }

  // States -----

  addSplat(splat) {
    const deltaX = splat.x - this._lastSplat.x;
    const deltaY = splat.y - this._lastSplat.y;

    Stage3d.renderer.getSize(this._rendererSize)
    this._splats.push({
      // Get mouse value in 0 to 1 range, with y flipped
      x: splat.x / this._rendererSize.x,
      y: 1.0 - splat.y / this._rendererSize.y,
      dx: deltaX,
      dy: deltaY * -1,
    });

    this._lastSplat.set(splat.x, splat.y)
  }

  // Getters / Setters -----

  get camera() {
    return this._hasBigTriangle ? this._mesh.camera : null
  }

  get density() {
    return this._density
  }

  set iterations(value) {
    this._iterations = value
  }

  set densityDissipation(value) {
    this._densityDissipation = value
  }

  set velocityDissipation(value) {
    this._velocityDissipation = value
  }

  set curlStrength(value) {
    this._curlStrength = value
  }

  set radius(value) {
    this._radius = value
  }

  set area(value) {
    this._area = value
  }

  // Events -----

  mousemove(e) {
    if (e.changedTouches && e.changedTouches.length) {
      e.x = e.changedTouches[0].pageX;
      e.y = e.changedTouches[0].pageY;
    }

    if (e.x === undefined) {
      e.x = e.pageX;
      e.y = e.pageY;
    }

    if (!this._lastMouse.isInit) {
      this._lastMouse.isInit = true;

      // First input
      this._lastMouse.set(e.x, e.y);
    }

    const deltaX = e.x - this._lastMouse.x;
    const deltaY = e.y - this._lastMouse.y;

    this._lastMouse.set(e.x, e.y);
    // Add if the mouse is moving
    if (Math.abs(deltaX) || Math.abs(deltaY)) {
      Stage3d.renderer.getSize(this._rendererSize)
      this._splats.push({
        // Get mouse value in 0 to 1 range, with y flipped
        x: e.x / this._rendererSize.x,
        y: 1.0 - e.y / this._rendererSize.y,
        dx: deltaX,
        dy: deltaY * -1,
      });
    }
  }

  @autobind
  _onResize() {
    this.resize()
  }

  resize() {
    if (this._hasBigTriangle) {
      this._mesh.material.uniforms.u_resolution.value.x = States.global.width
      this._mesh.material.uniforms.u_resolution.value.y = States.global.height
    }
    // this._mesh.scale.set(window.innerWidth * 0.5, window.innerHeight * 0.5, 1)
  }

  // Update -----

  update() {
    Stage3d.renderer.autoClear = false

    if (this._autoSplat) {
      const point = {
        x: States.global.width * 0.5 + Math.random() * States.global.width * 0.25 * this._area - States.global.width * 0.125 * this._area,
        y: States.global.height * 0.5 + Math.random() * States.global.height * 0.2 * this._area - States.global.height * 0.1 * this._area,
      }
      this.addSplat(point)
    }


    for (let i = this._splats.length - 1; i >= 0; i--) {
      this._updateSplat(this._splats.splice(i, 1)[0]);
    }

    this._curlProgram.material.uniforms.t_velocity.value = this._velocity.read.texture

    Stage3d.renderer.setRenderTarget(this._curl)
    Stage3d.renderer.render(this._curlProgram.scene, this._curlProgram.camera)

    this._vorticityProgram.material.uniforms.t_velocity.value = this._velocity.read.texture
    this._vorticityProgram.material.uniforms.t_curl.value = this._curl.texture
    this._vorticityProgram.material.uniforms.u_curl.value = this._curlStrength

    Stage3d.renderer.setRenderTarget(this._velocity.write)
    Stage3d.renderer.render(this._vorticityProgram.scene, this._vorticityProgram.camera)
    this._velocity.swap()

    this._divergenceProgram.material.uniforms.t_velocity.value = this._velocity.read.texture

    Stage3d.renderer.setRenderTarget(this._divergence)
    Stage3d.renderer.render(this._divergenceProgram.scene, this._divergenceProgram.camera)

    this._clearProgram.material.uniforms.t_diffuse.value = this._pressure.read.texture
    this._clearProgram.material.uniforms.u_dissipation.value = this._pressureDissipation

    Stage3d.renderer.setRenderTarget(this._pressure.write)
    Stage3d.renderer.render(this._clearProgram.scene, this._clearProgram.camera)
    this._pressure.swap()

    this._pressureProgram.material.uniforms.t_divergence.value = this._divergence.texture

    for (let i = 0; i < this._iterations; i++) {
      this._pressureProgram.material.uniforms.t_pressure.value = this._pressure.read.texture

      Stage3d.renderer.setRenderTarget(this._pressure.write)
      Stage3d.renderer.render(this._pressureProgram.scene, this._pressureProgram.camera)
      this._pressure.swap()
    }

    this._gradientProgram.material.uniforms.t_pressure.value = this._pressure.read.texture
    this._gradientProgram.material.uniforms.t_velocity.value = this._velocity.read.texture

    Stage3d.renderer.setRenderTarget(this._velocity.write)
    Stage3d.renderer.render(this._gradientProgram.scene, this._gradientProgram.camera)
    this._velocity.swap()

    this._advectionProgram.material.uniforms.u_dyeTexelSize.value.set(1 / this._simRes, 1 / this._simRes)
    this._advectionProgram.material.uniforms.t_velocity.value = this._velocity.read.texture
    this._advectionProgram.material.uniforms.t_source.value = this._velocity.read.texture
    this._advectionProgram.material.uniforms.u_dissipation.value = this._velocityDissipation

    Stage3d.renderer.setRenderTarget(this._velocity.write)
    Stage3d.renderer.render(this._advectionProgram.scene, this._advectionProgram.camera)
    this._velocity.swap()

    this._advectionProgram.material.uniforms.u_dyeTexelSize.value.set(1 / this._dyeRes, 1 / this._dyeRes)
    this._advectionProgram.material.uniforms.t_velocity.value = this._velocity.read.texture
    this._advectionProgram.material.uniforms.t_source.value = this._density.read.texture
    this._advectionProgram.material.uniforms.u_dissipation.value = this._densityDissipation

    Stage3d.renderer.setRenderTarget(this._density.write)
    Stage3d.renderer.render(this._advectionProgram.scene, this._advectionProgram.camera)
    this._density.swap()

    Stage3d.renderer.autoClear = this._autoClear

    if (this._hasBigTriangle) {
      this._mesh.material.uniforms.t_diffuse.value = this._density.read.texture
      this._mesh.material.uniforms.t_diffuse.value = this._density.read.texture
      this._mesh.material.uniforms.u_bg.value.x = this._bgColor.x
      this._mesh.material.uniforms.u_bg.value.y = this._bgColor.y
      this._mesh.material.uniforms.u_bg.value.z = this._bgColor.z
      this._mesh.material.uniforms.u_fluidColor.value.x = this._fluidColor.x
      this._mesh.material.uniforms.u_fluidColor.value.y = this._fluidColor.y
      this._mesh.material.uniforms.u_fluidColor.value.z = this._fluidColor.z
      this._mesh.material.uniforms.u_opacity.value = this._opacity
      this._mesh.material.uniforms.u_multiColor.value = window.guiParams.fluid.multi_color ? 1 : 0
      this._mesh.material.uniforms.u_multiColorAmplitude.value = this._multiColorAmplitude
      this._mesh.material.uniforms.u_time.value = Stage3d.time
    }
  }

  _updateSplat({ x, y, dx, dy }) {
    this._splatProgram.material.uniforms.t_target.value = this._velocity.read.texture
    this._splatProgram.material.uniforms.u_aspectRatio.value = Stage3d.renderer.width / Stage3d.renderer.height
    this._splatProgram.material.uniforms.u_point.value.set(x, y)
    this._splatProgram.material.uniforms.u_color.value.set(dx, dy, 1.0)
    // this._splatProgram.material.uniforms.u_color.value.set(dx, dy, 1.0)
    this._splatProgram.material.uniforms.u_radius.value = this._radius / 100.0

    Stage3d.renderer.setRenderTarget(this._velocity.write)
    Stage3d.renderer.render(this._splatProgram.scene, this._splatProgram.camera)
    this._velocity.swap()

    this._splatProgram.material.uniforms.t_target.value = this._density.read.texture

    Stage3d.renderer.setRenderTarget(this._density.write)
    Stage3d.renderer.render(this._splatProgram.scene, this._splatProgram.camera)
    this._density.swap()
  }
}