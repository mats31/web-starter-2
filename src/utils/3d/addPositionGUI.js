export default function(GUI, GUIObject, object, min = -50, max = 50) {
  const folder = GUI.addFolder(`Position - ${object.id}`)
  GUIObject[object.id] = {
    x: 0,
    y: 0,
    z: 0,
  }

  folder.add(GUIObject[object.id], 'x', min, max).onChange((value) => { object.position.x = value })
  folder.add(GUIObject[object.id], 'y', min, max).onChange((value) => { object.position.y = value })
  folder.add(GUIObject[object.id], 'z', min, max).onChange((value) => { object.position.z = value })
}