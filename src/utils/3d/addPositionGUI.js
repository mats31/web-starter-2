export default function(GUI, GUIObject, object, min = -50, max = 50, onComplete = () => {} ) {
  const folder = GUI.addFolder(`Matrix - ${object.id}`)

  GUIObject[object.id] = {
    x: object.position.x,
    y: object.position.y,
    z: object.position.z,
    rotX: object.rotation.x,
    rotY: object.rotation.y,
    rotZ: object.rotation.z,
  }

  folder.add(GUIObject[object.id], 'x', min, max).onChange((value) => { object.position.x = value
  onComplete()
  })
  folder.add(GUIObject[object.id], 'y', min, max).onChange((value) => { object.position.y = value
  onComplete()
  })
  folder.add(GUIObject[object.id], 'z', min, max).onChange((value) => { object.position.z = value
  onComplete()
  })

  folder.add(GUIObject[object.id], 'rotX', min, max).onChange((value) => { object.rotation.x = value
  onComplete()
  })
  folder.add(GUIObject[object.id], 'rotY', min, max).onChange((value) => { object.rotation.y = value
  onComplete()
  })
  folder.add(GUIObject[object.id], 'rotZ', min, max).onChange((value) => { object.rotation.z = value
  onComplete()
  })
}