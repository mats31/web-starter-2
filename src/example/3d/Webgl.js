import { createDOM } from 'utils/dom'
import { autobind } from 'core-decorators'
import template from './webgl.tpl.html'

export default class WebGL {

  // Setup ---------------------------------------------------------------------

  constructor(options) {
    this.el = options.parent.appendChild(
      createDOM(template()),
    )

    this._width = window.innerWidth
    this._height = window.innerHeight

    this._setupWebGL(this._width, this._height)
  }

  _setupWebGL(width, height) {
    this._scene = new THREE.Scene()

    this._camera = new THREE.PerspectiveCamera( 45, this._width / this._height, 0.1, 1000 )
    this._camera.position.z = 100

    // this._camera = new THREE.OrthographicCamera(this._width / - 2, this._width / 2, this._height / 2, this._height / - 2, 0, 100);
    // this._scene.add(this._camera);

    this._renderer = new THREE.WebGLRenderer()
    this._renderer.setSize( this._width, this._height )
    this._renderer.setClearColor( 0x000000 )

    this.el.appendChild(this._renderer.domElement)
  }

  _setupEvents() {
    Signals.onResize.add(this._onResize)
  }

  // Events --------------------------------------------------------------------

  @autobind
  _onResize(vw, vh) {
    this.resize(vw, vh)
  }

  resize(vw, vh) {
    this._width = window.innerWidth
    this._height = window.innerHeight

    this._camera.aspect = this._width / this._height
    this._camera.updateProjectionMatrix()

    // Orthographic camera
    // this._camera.left = this._width / - 2;
    // this._camera.right = this._width / 2;
    // this._camera.top = this._height / 2;
    // this._camera.bottom = this._height / - 2;
    // this._camera.updateProjectionMatrix();

    this._renderer.setSize( this._width, this._height )
  }

}
