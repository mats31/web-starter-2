export default class ExtendedStandardMaterial extends THREE.MeshStandardMaterial {

  constructor(params = {
    customUniforms: [],
    onBeforeCompile: (shader) => { },
  }) {
    super(params)
    this._customUniforms = params.customUniforms
    this.onBeforeCompile = params.onBeforeCompile

    this._setup()
  }

  get customUniforms() {
    return this._customUniforms
  }

  _setup() { }

  // onBeforeCompile(shader) {

  //   for (let i = 0; i < this._customUniforms.length; i++) {
  //     const customUniform = this._customUniforms[i]

  //     shader.uniforms[customUniform.id] = { value: customUniform.value }
  //   }
  //   console.log(shader)
  // }
}