export default class LightController {
  constructor(options) {
    this._lights = options.lights || []
    this._scene = options.scene

    const n = Math.floor(Math.random() * 11)
    const k = Math.floor(Math.random() * 1000000)
    const m = String.fromCharCode(n) + k
    this._folder = window.gui.addFolder(`Lights-${m}`)

    window.guiParams.lights = {
      addAmbient: () => {
        this._addLight({ type: 'ambient', color: 0xffffff, intensity: 1, castShadow: false, helper: false })
      },
      addDirectional: () => {
        this._addLight({ type: 'directional', color: 0xffffff, intensity: 1, castShadow: false, helper: false })
      },
      addHemisphere: () => {
        this._addLight({ type: 'hemisphere', skyColor: 0xffffff, groundColor: 0xd00000, intensity: 1, helper: false })
      },
      addPoint: () => {
        this._addLight({ type: 'point', color: 0xffffff, intensity: 1, distance: 10, decay: 2 })
      },
      addRect: () => {
        this._addLight({ type: 'rect', color: 0xffffff, intensity: 1, width: 10, height: 10 })
      },
      addSpot: () => {
        this._addLight({ type: 'spot', color: 0xffffff, castShadow: false, intensity: 1, distance: 10, angle: 0.79, penumbra: 0.2, decay: 2 })
      }
    }

    this._folder.add(window.guiParams.lights, 'addAmbient')
    this._folder.add(window.guiParams.lights, 'addDirectional')
    this._folder.add(window.guiParams.lights, 'addHemisphere')
    this._folder.add(window.guiParams.lights, 'addPoint')
    this._folder.add(window.guiParams.lights, 'addRect')
    this._folder.add(window.guiParams.lights, 'addSpot')

    this._setupLights()
  }

  _setupLights() {
    for (let i = 0; i < this._lights.length; i++) {
      const light = this._lights[i]
      this._checkLight(light, i)
    }
  }

  _checkLight(light, i) {
    switch (light.type) {
      case 'ambient': {
        const color = light.color ? light.color : new THREE.Color(0xffffff)
        const intensity = light.intensity ? light.intensity : 1
        const castShadow = light.castShadow ? light.castShadow : false
        const id = light.id ? light.id : `ambient-light-${i}`
        this._lights[i].id = id

        const ambientFolder = this._folder.addFolder(id)

        const ambientLight = new THREE.AmbientLight(color, intensity)
        ambientLight.castShadow = castShadow

        window.guiParams.lights.id = {}
        window.guiParams.lights.id.intensity = intensity
        window.guiParams.lights.id.color = color
        window.guiParams.lights.id.castShadow = castShadow
        window.guiParams.lights.id.remove = () => {
          this._removeLight(id, ambientLight)
        }

        ambientFolder.add(window.guiParams.lights.id, 'intensity', 0, 10).onChange((value) => {
          ambientLight.intensity = value
        })
        ambientFolder.addColor(window.guiParams.lights.id, 'color').onChange((value) => {
          ambientLight.color = new THREE.Color(value)
        })
        ambientFolder.add(window.guiParams.lights.id, 'castShadow').onChange((value) => {
          ambientLight.castShadow = value
        })

        ambientFolder.add(window.guiParams.lights.id, 'remove')

        this._scene.add(ambientLight)
      } break
      case 'directional': {
        const color = light.color ? light.color : new THREE.Color(0xffffff)
        const intensity = light.intensity ? light.intensity : 1
        const castShadow = light.castShadow ? light.castShadow : false
        const id = light.id ? light.id : `directional-light-${i}`
        this._lights[i].id = id

        const directionalFolder = this._folder.addFolder(id)

        const directionalLight = new THREE.DirectionalLight(color, intensity)
        directionalLight.castShadow = castShadow

        const helper = new THREE.DirectionalLightHelper(directionalLight, 0.1)

        window.guiParams.lights.id = {}
        window.guiParams.lights.id.intensity = intensity
        window.guiParams.lights.id.color = color
        window.guiParams.lights.id.castShadow = castShadow
        window.guiParams.lights.id.helper = false
        window.guiParams.lights.id.x = directionalLight.position.x
        window.guiParams.lights.id.y = directionalLight.position.y
        window.guiParams.lights.id.z = directionalLight.position.z
        window.guiParams.lights.id.remove = () => {
          this._removeLight(id, directionalLight, helper)
        }

        directionalFolder.add(window.guiParams.lights.id, 'intensity', 0, 10).onChange((value) => {
          directionalLight.intensity = value
        })
        directionalFolder.addColor(window.guiParams.lights.id, 'color').onChange((value) => {
          directionalLight.color = new THREE.Color(value)
        })
        directionalFolder.add(window.guiParams.lights.id, 'castShadow').onChange((value) => {
          directionalLight.castShadow = value
        })
        directionalFolder.add(window.guiParams.lights.id, 'x', -10, 10).step(0.005).onChange((value) => {
          directionalLight.position.x = value
          helper.update()
        })
        directionalFolder.add(window.guiParams.lights.id, 'y', -10, 10).step(0.005).onChange((value) => {
          directionalLight.position.y = value
          helper.update()
        })
        directionalFolder.add(window.guiParams.lights.id, 'z', -10, 10).step(0.005).onChange((value) => {
          directionalLight.position.z = value
          helper.update()
        })
        directionalFolder.add(window.guiParams.lights.id, 'helper').onChange((value) => {
          if (value) {
            this._scene.add(helper)
          } else {
            this._scene.remove(helper)
          }

          helper.update()
        })

        directionalFolder.add(window.guiParams.lights.id, 'remove')

        this._scene.add(directionalLight)
      } break
      case 'hemisphere': {
        const skyColor = light.skyColor ? light.skyColor : new THREE.Color(0xffffff)
        const groundColor = light.groundColor ? light.groundColor : new THREE.Color(0x000000)
        const intensity = light.intensity ? light.intensity : 1
        const id = light.id ? light.id : `hemisphere-light-${i}`
        this._lights[i].id = id

        const hemisphereFolder = this._folder.addFolder(id)

        const hemisphereLight = new THREE.HemisphereLight(skyColor, groundColor, intensity)

        const helper = new THREE.HemisphereLightHelper(hemisphereLight, 0.1)

        window.guiParams.lights.id = {}
        window.guiParams.lights.id.intensity = intensity
        window.guiParams.lights.id.skyColor = skyColor
        window.guiParams.lights.id.groundColor = groundColor
        window.guiParams.lights.id.helper = false
        window.guiParams.lights.id.x = hemisphereLight.position.x
        window.guiParams.lights.id.y = hemisphereLight.position.y
        window.guiParams.lights.id.z = hemisphereLight.position.z
        window.guiParams.lights.id.remove = () => {
          this._removeLight(id, hemisphereLight, helper)
        }

        hemisphereFolder.add(window.guiParams.lights.id, 'intensity', 0, 10).onChange((value) => {
          hemisphereLight.intensity = value
        })
        hemisphereFolder.addColor(window.guiParams.lights.id, 'skyColor').onChange((value) => {
          hemisphereLight.skyColor = new THREE.Color(value)
        })
        hemisphereFolder.addColor(window.guiParams.lights.id, 'groundColor').onChange((value) => {
          hemisphereLight.groundColor = new THREE.Color(value)
        })
        hemisphereFolder.add(window.guiParams.lights.id, 'x', -20, 20).step(0.005).onChange((value) => {
          hemisphereLight.position.x = value
          helper.update()
        })
        hemisphereFolder.add(window.guiParams.lights.id, 'y', -20, 20).step(0.005).onChange((value) => {
          hemisphereLight.position.y = value
          helper.update()
        })
        hemisphereFolder.add(window.guiParams.lights.id, 'z', -20, 20).step(0.005).onChange((value) => {
          hemisphereLight.position.z = value
          helper.update()
        })
        hemisphereFolder.add(window.guiParams.lights.id, 'helper').onChange((value) => {
          if (value) {
            this._scene.add(helper)
          } else {
            this._scene.remove(helper)
          }

          helper.update()
        })

        hemisphereFolder.add(window.guiParams.lights.id, 'remove')

        this._scene.add(hemisphereLight)
      } break
      case 'point': {
        const color = light.color ? light.color : new THREE.Color(0xffffff)
        const intensity = light.intensity ? light.intensity : 1
        const decay = light.decay ? light.decay : 1
        const id = light.id ? light.id : `point-light-${i}`
        this._lights[i].id = id

        const pointFolder = this._folder.addFolder(id)

        const pointLight = new THREE.PointLight(color, intensity, decay)
        const helper = new THREE.PointLightHelper(pointLight, 0.1)

        window.guiParams.lights.id = {}
        window.guiParams.lights.id.intensity = intensity
        window.guiParams.lights.id.color = color
        window.guiParams.lights.id.helper = false
        window.guiParams.lights.id.x = pointLight.position.x
        window.guiParams.lights.id.y = pointLight.position.y
        window.guiParams.lights.id.z = pointLight.position.z
        window.guiParams.lights.id.remove = () => {
          this._removeLight(id, pointLight, helper)
        }

        pointFolder.add(window.guiParams.lights.id, 'intensity', 0, 10).onChange((value) => {
          pointLight.intensity = value
        })
        pointFolder.addColor(window.guiParams.lights.id, 'color').onChange((value) => {
          pointLight.color = new THREE.Color(value)
        })
        pointFolder.add(window.guiParams.lights.id, 'x', -20, 20).step(0.005).onChange((value) => {
          pointLight.position.x = value
          helper.update()
        })
        pointFolder.add(window.guiParams.lights.id, 'y', -20, 20).step(0.005).onChange((value) => {
          pointLight.position.y = value
          helper.update()
        })
        pointFolder.add(window.guiParams.lights.id, 'z', -20, 20).step(0.005).onChange((value) => {
          pointLight.position.z = value
          helper.update()
        })
        pointFolder.add(window.guiParams.lights.id, 'helper').onChange((value) => {
          if (value) {
            this._scene.add(helper)
          } else {
            this._scene.remove(helper)
          }

          helper.update()
        })

        pointFolder.add(window.guiParams.lights.id, 'remove')

        this._scene.add(pointLight)
      } break
      case 'rect': {
        const color = light.color ? light.color : new THREE.Color(0xffffff)
        const intensity = light.intensity ? light.intensity : 1
        const width = light.width ? light.width : 1
        const height = light.height ? light.height : 1
        const id = light.id ? light.id : `rect-area-light-${i}`
        this._lights[i].id = id

        const rectFolder = this._folder.addFolder(id)

        const rectLight = new THREE.RectAreaLight(color, intensity, width, height)
        const helper = new THREE.RectAreaLightHelper(rectLight)

        window.guiParams.lights.id = {}
        window.guiParams.lights.id.intensity = intensity
        window.guiParams.lights.id.color = color
        window.guiParams.lights.id.width = width
        window.guiParams.lights.id.height = height
        window.guiParams.lights.id.helper = false
        window.guiParams.lights.id.x = rectLight.position.x
        window.guiParams.lights.id.y = rectLight.position.y
        window.guiParams.lights.id.z = rectLight.position.z
        window.guiParams.lights.id.remove = () => {
          this._removeLight(id, rectLight, helper)
        }

        rectFolder.add(window.guiParams.lights.id, 'intensity', 0, 10).onChange((value) => {
          rectLight.intensity = value
        })
        rectFolder.addColor(window.guiParams.lights.id, 'color').onChange((value) => {
          rectLight.color = new THREE.Color(value)
          helper.update()
        })
        rectFolder.add(window.guiParams.lights.id, 'width', 1, 10).onChange((value) => {
          rectLight.width = value
          helper.update()
        })
        rectFolder.add(window.guiParams.lights.id, 'height', 1, 10).onChange((value) => {
          rectLight.height = value
          helper.update()
        })
        rectFolder.add(window.guiParams.lights.id, 'x', -10, 10).step(0.005).onChange((value) => {
          rectLight.position.x = value
          helper.update()
        })
        rectFolder.add(window.guiParams.lights.id, 'y', -10, 10).step(0.005).onChange((value) => {
          rectLight.position.y = value
          helper.update()
        })
        rectFolder.add(window.guiParams.lights.id, 'z', -10, 10).step(0.005).onChange((value) => {
          rectLight.position.z = value
          helper.update()
        })
        rectFolder.add(window.guiParams.lights.id, 'helper').onChange((value) => {
          if (value) {
            this._scene.add(helper)
          } else {
            this._scene.remove(helper)
          }

          helper.update()
        })

        rectFolder.add(window.guiParams.lights.id, 'remove')

        this._scene.add(rectLight)
      } break
      case 'spot': {
        const color = light.color ? light.color : new THREE.Color(0xffffff)
        const intensity = light.intensity ? light.intensity : 1
        const distance = light.distance ? light.distance : 50
        const angle = light.angle ? light.angle : 0.8
        const penumbra = light.penumbra ? light.penumbra : 0.5
        const decay = light.decay ? light.decay : 1
        const castShadow = light.castShadow ? light.castShadow : false
        const id = light.id ? light.id : `spot-light-${i}`
        this._lights[i].id = id

        const spotFolder = this._folder.addFolder(id)

        const spotLight = new THREE.SpotLight(color, intensity, distance, angle, penumbra, decay)
        spotLight.castShadow = castShadow
        const helper = new THREE.SpotLightHelper(spotLight, 0.1)

        window.guiParams.lights.id = {}
        window.guiParams.lights.id.intensity = intensity
        window.guiParams.lights.id.angle = angle
        window.guiParams.lights.id.distance = distance
        window.guiParams.lights.id.penumbra = penumbra
        window.guiParams.lights.id.decay = decay
        window.guiParams.lights.id.color = color
        window.guiParams.lights.id.helper = false
        window.guiParams.lights.id.x = spotLight.position.x
        window.guiParams.lights.id.y = spotLight.position.y
        window.guiParams.lights.id.z = spotLight.position.z
        window.guiParams.lights.id.remove = () => {
          this._removeLight(id, spotLight, helper)
        }

        spotFolder.add(window.guiParams.lights.id, 'intensity', 0, 10).onChange((value) => {
          spotLight.intensity = value
        })
        spotFolder.addColor(window.guiParams.lights.id, 'color').onChange((value) => {
          spotLight.color = new THREE.Color(value)
        })
        spotFolder.add(window.guiParams.lights.id, 'x', -20, 20).step(0.005).onChange((value) => {
          spotLight.position.x = value
          helper.update()
        })
        spotFolder.add(window.guiParams.lights.id, 'y', -20, 20).step(0.005).onChange((value) => {
          spotLight.position.y = value
          helper.update()
        })
        spotFolder.add(window.guiParams.lights.id, 'z', -20, 20).step(0.005).onChange((value) => {
          spotLight.position.z = value
          helper.update()
        })
        spotFolder.add(window.guiParams.lights.id, 'helper').onChange((value) => {
          if (value) {
            this._scene.add(helper)
          } else {
            this._scene.remove(helper)
          }

          helper.update()
        })

        spotFolder.add(window.guiParams.lights.id, 'remove')

        this._scene.add(spotLight)
      } break
      default:
        break
    }
  }

  // State ----------------

  _addLight(light) {
    this._lights.push(light)

    this._checkLight(light, this._lights.length - 1)
  }

  _addLights(lights) {
    this._lights = lights

    for (let i = 0; i < this._lights.length; i++) {
      const light = this._lights[i]
      this._checkLight(light, i)
    }
  }

  _removeLight(id, lightObj, helper) {
    for (let i = 0; i < this._lights.length; i++) {
      const light = this._lights[i]
      const lightId = light.id

      if (id === lightId) {
        window.gui.removeLightFolder(id)
        this._scene.remove(lightObj)
        
        if (helper) { this._scene.remove(helper) }
      }
    }
  }
}