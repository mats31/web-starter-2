import { autobind } from 'core-decorators'
import { calculateTextureSize } from 'utils/math'
import FBO from 'helpers/3d/FBO'
import MeshLineGPUGeometry from './MeshLineGPUGeometry'

const vsShader = require('./shaders/MeshLineGPU.vs')
const fsShader = require('./shaders/MeshLineGPU.fs')

export default class MeshLineGPU extends THREE.Mesh {
  constructor({
    number = 10,
    divisions = 10,
    alphaTest = 0.01,
    lineWidth = 1,
    vertexShader = false,
    fragmentShader = false,
    depthVerstexShader,
    depthFragmentShader,
  } = {}) {

    vertexShader = vertexShader || vsShader
    fragmentShader = fragmentShader || fsShader

    // Data texture ----------

    const textureSize = calculateTextureSize(number * divisions)
    const width = textureSize.width
    const height = textureSize.height
    const size = width * height
    const positions = new Float32Array(size * 4)
    const texture = new THREE.DataTexture(positions, width, height, THREE.RGBAFormat, THREE.FloatType, THREE.UVMapping, THREE.RepeatWrapping, THREE.RepeatWrapping, THREE.NearestFilter, THREE.NearestFilter, 0)
    texture.generateMipmaps = false


    const infoTexture = new THREE.DataTexture(new Float32Array(size * 4), width, height, THREE.RGBAFormat, THREE.FloatType, THREE.UVMapping, THREE.RepeatWrapping, THREE.RepeatWrapping, THREE.NearestFilter, THREE.NearestFilter, 0)
    infoTexture.generateMipmaps = false

    for (let i = 0; i < number; i++) {
      const x = 0
      const y = 0
      const z = 0

      for (let j = 0; j < divisions; j++) {
        const k = i * divisions + j

        texture.image.data[k * 4] = x
        texture.image.data[k * 4 + 1] = y
        texture.image.data[k * 4 + 2] = z
        texture.image.data[k * 4 + 3] = 1

        infoTexture.image.data[k * 4] = ((k - 1) % width) / width
        infoTexture.image.data[k * 4 + 1] = Math.floor((k - 1) / width) / height
        infoTexture.image.data[k * 4 + 2] = 1 - j / divisions // is line's first vertice ?
        infoTexture.image.data[k * 4 + 3] = 1
      }
    }

    texture.needsUpdate = true
    infoTexture.needsUpdate = true

    // Geometry -------------

    const geometry = new MeshLineGPUGeometry(number, divisions, width, height)

    // Material -------------

    const material = new THREE.RawShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        positions: { type: 't', value: texture },
        lineWidth: { type: 'f', value: lineWidth },
        alphaTest: { type: 'f', value: alphaTest },
        resolution: { type: 'v2', value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
        opacity: { type: 'f', value: 1 },
      },
      side: THREE.DoubleSide,
      depthTest: true,
      depthWrite: true,
      transparent: true,
      wireframe: false
    })

    const depthMaterial = new THREE.ShaderMaterial({
      vertexShader: depthVerstexShader || require('./shaders/MeshLineGPUDepth.vs'),
      fragmentShader: depthFragmentShader || require('./shaders/MeshLineGPUDepth.fs'),
      uniforms: THREE.UniformsUtils.merge([
        THREE.ShaderLib.depth.uniforms,
        material.uniforms,
      ]),
    });

    super(geometry, material)

    // this.castShadow = true
    // this.receiveShadow = true
    this.frustumCulled = true
    this.customDepthMaterial = depthMaterial

    this._simulationMaterial = new THREE.ShaderMaterial({
      uniforms: {
        t_pos: { type: "t", value: texture },
        t_oPos: { type: "t", value: null },
        t_info: { type: "t", value: infoTexture },
      },
      vertexShader: require("./shaders/simulation.vs"),
      fragmentShader: require("./shaders/simulation.fs"),
    });

    this._fbo = new FBO({
      width,
      height,
      stageID: 'fbo-1',
      material: this._simulationMaterial,
    })

    this.addEvents()
  }

  addEvents() {
    Signals.onResize.add(this.onResize)
  }

  // Events ---------

  @autobind
  onResize() {
    this.resize()
  }

  resize() {
    this.material.uniforms.resolution.value.x = window.innerWidth
    this.material.uniforms.resolution.value.y = window.innerHeight
  }

  // Render ------

  update() {
    this._fbo.update()
    this.material.uniforms.positions.value = this._fbo.current
    if (this.material.uniforms.positions.value) {
      // console.log(this.material.uniforms.positions.value.needsUpdate = true)
      // console.log(this._fbo.current)
    }


    // this.material.needsUpdate = true
  }
}
