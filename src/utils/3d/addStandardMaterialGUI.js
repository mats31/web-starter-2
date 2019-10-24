export default function (GUI, GUIObject, object) {
  const folder = GUI.addFolder(`Standard Material - ${object.id}`)
  GUIObject[object.id] = {
    color: 0xffffff,
    emissive: 0x000000,
    roughness: 0.5,
    metalness: 0.5,
  }

  folder.addColor(GUIObject[object.id], 'color').onChange((value) => {
    if (object.type === 'Object3D') {
      object.traverse((obj) => {
        if (obj.type === 'Mesh') {
          obj.material.color = new THREE.Color(value)
        }
      })
    } else {
      object.material.color = new THREE.Color(value)
    }
  })
  folder.addColor(GUIObject[object.id], 'emissive').onChange((value) => {
    if (object.type === 'Object3D') {
      object.traverse((obj) => {
        if (obj.type === 'Mesh') {
          obj.material.emissive = new THREE.Color(value)
        }
      })
    } else {
      object.material.emissive = new THREE.Color(value)
    }
  })
  folder.add(GUIObject[object.id], 'roughness', 0, 1).onChange((value) => {
    if (object.type === 'Object3D') {
      object.traverse((obj) => {
        if (obj.type === 'Mesh') {
          obj.material.roughness = value
        }
      })
    } else {
      object.material.roughness = value
    }
  })
  folder.add(GUIObject[object.id], 'metalness', 0, 1).onChange((value) => {
    if (object.type === 'Object3D') {
      object.traverse((obj) => {
        if (obj.type === 'Mesh') {
          obj.material.metalness = value
        }
      })
    } else {
      object.material.metalness = value
    }
  })
}