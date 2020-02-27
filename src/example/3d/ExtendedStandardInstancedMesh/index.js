import States from 'core/States'
import ExtendedStandardMaterial from 'helpers/3d/ExtendedStandardMaterial'
import BigTriangle from 'helpers/3d/BigTriangle'
import { getPerspectiveSize } from 'utils/3d'
import { lerp } from 'utils/math'
import { objectVisible } from 'core/decorators'
import { autobind } from 'core-decorators'
import rotation_matrix from 'example/3d/shaders/rotation-matrix.glsl'
import project_vertex from './shaders/jail-project.vs'
import worldpos_vertex from './shaders/jail-worldpos.vs'
import color_fragment from './shaders/jail-color.fs'
import defaultnormal_vertex from './shaders/jail-defaultnormal.vs'
import noise_vertex from './shaders/jail-noise.vs'
import noise_fragment from './shaders/jail-noise.fs'

@objectVisible()
export default class Jail extends THREE.Object3D {
  constructor() {
    super()

    this._camera = Stage3d.addPerspectiveCamera({
      width: States.global.width,
      height: States.global.height,
      near: 0.1,
    })
    this._camera.position.z = 20

    this._nb = 1000
    this._nbLines = 30
    this._xRange = 10
    this._yRange = 15
    this._zRange = 10

    this._cameraTg = this._camera.position.z

    this._wireframe = false

    this._bgColor = new THREE.Color('black')
    this._lightColor = new THREE.Color('white')

    this._setupLight()
    this._setupMesh()
    this._setupNoise()
    this._setupGUI()
  }

  _setupLight() {
    this._light = new THREE.DirectionalLight(0xffffff, 2)
    this._light.position.x = 0
    this._light.position.y = 0
    this._light.position.z = 10
    this._light.castShadow = true

    this._lightHelper = new THREE.DirectionalLightHelper(this._light, 1)
  }

  _setupMesh() {
    // const texture = States.resources.getTexture('fabric-displacement').media
    // const normalMap = States.resources.getTexture('fabric-normal').media

    this._geometry = new THREE.TetrahedronBufferGeometry(1, 0)
    // this._geometry.computeVertexNormals()

    this._material = new ExtendedStandardMaterial({
      color: new THREE.Color('rgb(255, 255, 255)'),
      emissive: new THREE.Color('rgb(0, 0, 0)'),
      metalness: 1,
      roughness: 0.8,
      transparent: true,
      side: THREE.DoubleSide,
      castShadow: true,
      receiveShadow: true,
      wireframe: this._wireframe,
      customUniforms: [
        { id: 'u_time', type: 'float', value: 0 },
        { id: 'u_resolution', type: 'vec2', value: new THREE.Vector2(States.global.width, States.global.height) },
      ],
      onBeforeCompile: function (shader) {
        for (let i = 0; i < this._customUniforms.length; i++) {
          const customUniform = this._customUniforms[i]

          shader.uniforms[customUniform.id] = customUniform
          shader.vertexShader = `uniform ${customUniform.type} ${customUniform.id};\n` + shader.vertexShader
          shader.fragmentShader = `uniform ${customUniform.type} ${customUniform.id};\n` + shader.fragmentShader
        }

        shader.vertexShader = rotation_matrix + shader.vertexShader
        shader.vertexShader = `attribute float a_speed;\n` + shader.vertexShader
        shader.vertexShader = shader.vertexShader.replace(
          '#include <defaultnormal_vertex>',
          defaultnormal_vertex
        )
        shader.vertexShader = shader.vertexShader.replace(
          '#include <project_vertex>',
          project_vertex
        )
        shader.vertexShader = shader.vertexShader.replace(
          '#include <worldpos_vertex>',
          worldpos_vertex
        )

        // shader.fragmentShader = shader.fragmentShader.replace(
        //   'vec4 diffuseColor = vec4( diffuse, opacity );',
        //   // 'vec4 diffuseColor = vec4( diffuse * vec3(gl_FragCoord.xy / u_resolution, gl_FragCoord.z), opacity );'
        //   'vec4 diffuseColor = vec4( vec3(gl_FragCoord.xy / u_resolution, 0.), opacity );'
        // )

        // shader.fragmentShader = shader.fragmentShader.replace(
        //   'vec3 totalEmissiveRadiance = emissive;',
        //   'vec3 totalEmissiveRadiance = vec3(gl_FragCoord.xy / u_resolution, 0.);'
        // )

        shader.fragmentShader = shader.fragmentShader.replace('uniform float roughness;', '')
        shader.fragmentShader = shader.fragmentShader.replace('uniform float metalness;', '')
        shader.fragmentShader = shader.fragmentShader.replace(
          'void main() {',
          'void main() {\n' +
          'float roughness = gl_FragCoord.x / u_resolution.x * 0.5;\n' +
          'float metalness = gl_FragCoord.y / u_resolution.y * 0.5;'
        )

        // shader.fragmentShader = shader.fragmentShader.replace(
        //   '#include <color_fragment>',
        //   color_fragment
        // )

        // shader.fragmentShader = `varying vec3 vPos;\n` + shader.fragmentShader
        // shader.fragmentShader = shader.fragmentShader.replace(
        //   '#include <map_fragment>',
        //   map_fragment
        // )
        // console.log(shader.vertexShader)
      },
    })

    this._mesh = new THREE.InstancedMesh(this._geometry, this._material, this._nb)

    const step = this._nb / this._nbLines
    const m = new THREE.Matrix4()
    const pos = new THREE.Vector3()
    const quat = new THREE.Quaternion()
    const scale = new THREE.Vector3()
    const speeds = new Float32Array( this._nb )
    let index = 0
    for (let i = 0; i < this._nbLines; i++) {
      const x1 = Math.random() * this._xRange - this._xRange * 0.5
      const y1 = Math.random() * this._yRange - this._yRange * 0.5
      const z1 = Math.random() * this._zRange - this._zRange * 0.5

      const x2 = Math.random() * this._xRange - this._xRange * 0.5
      const y2 = Math.random() * this._yRange - this._yRange * 0.5
      const z2 = Math.random() * this._zRange - this._zRange * 0.5

      for (let j = 0; j < step; j++) {
        const value = j/step

        const x = lerp(value, x1, x2)
        const y = lerp(value, y1, y2)
        const z = lerp(value, z1, z2)
        const s = 0.1 + Math.random() * 0.2

        pos.set(x, y, z)
        // quat.setFromAxisAngle(new THREE.Vector3(Math.random(), Math.random(), Math.random()), Math.PI / 2)
        scale.set(s, s, s)
        m.compose(pos, quat, scale)
        this._mesh.setMatrixAt(index, m)
        m.identity()

        speeds[index] = Math.random()
        index++
      }
    }

    this._geometry.addAttribute( 'a_speed', new THREE.InstancedBufferAttribute(speeds, 1) )
    this._perspectiveSize = getPerspectiveSize(this._camera, this._camera.position.z)
    // this._mesh.scale.set(this._perspectiveSize.width, this._perspectiveSize.height, 1)
  }

  _setupNoise() {
    const texture = States.resources.getTexture('jail-noise').media
    this._noise = new BigTriangle({
      material: new THREE.RawShaderMaterial({
        uniforms: {
          t_diffuse: { value: texture },
        },
        transparent: true,
        vertexShader: noise_vertex,
        fragmentShader: noise_fragment,
      })
    })
    this._noise.position.z = 10
  }

  _setupGUI() {
    window.guiParams.jail = {
      camera: this._camera.position.z,
      background: [0, 0, 0],
      light_color: [255, 255, 255],
      xRange: this._xRange,
      yRange: this._yRange,
      zRange: this._zRange,
      nb: this._nb,
      nbLines: this._nbLines,
    }

    this._folder = window.gui.addFolder('Jail')
    this._folder.add(window.guiParams.jail, 'camera', 1, 100).step(0.1).onChange((value) => {
      this._cameraTg = value
    })
    this._folder.add(window.guiParams.jail, 'xRange', 0, 100).step(1).onChange((value) => {
      this._xRange = value
      this._reset()
    })
    this._folder.add(window.guiParams.jail, 'yRange', 0, 100).step(1).onChange((value) => {
      this._yRange = value
      this._reset()
    })
    this._folder.add(window.guiParams.jail, 'zRange', 0, 100).step(1).onChange((value) => {
      this._zRange = value
      this._reset()
    })
    this._folder.add(window.guiParams.jail, 'nb', 0, 100000).step(1).onChange((value) => {
      this._nb = value
      this._reset()
    })
    this._folder.add(window.guiParams.jail, 'nbLines', 0, 1000).step(1).onChange((value) => {
      this._nbLines = value
      this._reset()
    })
    this._folder.addColor(window.guiParams.jail, 'background').onChange((value) => {
      this._bgColor.r = value[0] / 255
      this._bgColor.g = value[1] / 255
      this._bgColor.b = value[2] / 255

      Stage3d.renderer.setClearColor(this._bgColor, 1)
    })
    this._folder.addColor(window.guiParams.jail, 'light_color').onChange((value) => {
      this._light.color.r = value[0] / 255
      this._light.color.g = value[1] / 255
      this._light.color.b = value[2] / 255
    })
  }

  _reset() {
    Stage3d.remove(this._mesh)
    this._geometry.dispose()
    this._material.dispose()
    this._setupMesh()
    Stage3d.add(this._mesh)
  }

  componentToHex(c) {
    var hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
  }

  rgbToHex(r, g, b) {
    return "#" + this.componentToHex(r) + this.componentToHex(g) + this.componentToHex(b);
  }

  addEvents() {
    Signals.onResize.add(this._onResize)
  }

  removeEvents() {
    Signals.onResize.remove(this._onResize)
  }

  // States -----

  show() {
    Stage3d.renderer.setPixelRatio(2)
    Stage3d.renderer.antialias = true
    Stage3d.renderer.setClearColor(this._bgColor, 1)
    Stage3d.add(this._light)
    // Stage3d.add(this._lightHelper)
    Stage3d.add(this._mesh)
    Stage3d.add(this._noise)
    this.addEvents()
    this.resize()
  }

  hide() {
    Stage3d.remove(this._light)
    Stage3d.remove(this._mesh)
    Stage3d.remove(this._noise)
    this.removeEvents()
  }

  // Events ----

  @autobind
  _onResize() {
    this.resize()
  }

  resize() {
    this._perspectiveSize = getPerspectiveSize(this._camera, this._camera.position.z)
    // const perspectiveNoise = getPerspectiveSize(this._camera, Math.abs(this._camera.position.z - this._noise.position.z))
    // this._noise.scale.set(perspectiveNoise.width, perspectiveNoise.height, 1)
    // this._mesh.scale.set(this._perspectiveSize.width, this._perspectiveSize.height, 1)

    // this._material.customUniforms[1].value.x = States.global.width
    this._material.customUniforms[1].value.x = States.global.width
    this._material.customUniforms[1].value.y = States.global.height
  }

  // Update -----

  update() {
    if (this.objectVisible()) {
      Stage3d.renderer.setRenderTarget(null)
      Stage3d.renderer.render(Stage3d.scene, this._camera)

      this._material.customUniforms[0].value = Stage3d.time

      this._updateCamera()
      this._updateLight()
    }
  }

  _updateCamera() {
    this._camera.position.z += (this._cameraTg - this._camera.position.z) * 0.05
    this._noise.position.z = this._camera.position.z - 1
  }

  _updateLight() {
    // const radius = 2.5

    // this._light.position.x = Math.sin(Stage3d.time * 0.25) * radius
    // this._light.position.y = Math.cos(Stage3d.time * 0.25) * radius
    // this._light.position.z = Math.sin(Stage3d.time * 0.25) * radius

    this._light.intensity = 2 + Math.sin(Stage3d.time) * 1

    this._lightHelper.update()
  }
}