import dat from 'dat.gui';
import LightController from './LightController';
import { autobind } from 'core-decorators';
const OrbitControls = require('three-orbit-controls')(THREE);

export default class Stage3d {
  constructor({
    alpha = false,
    antialias = false,
    autoClear = true,
    preserveDrawingBuffer = false
  } = {}) {
    this.scenes = [];
    this.renderers = [];
    this.renderTargets = [];
    this.cameras = [];

    this.scene = new THREE.Scene();
    this.scenes.push({ id: 'mainScene', scene: this.scene });

    this.camera = new THREE.PerspectiveCamera(
      50,
      window.innerWidth / window.innerHeight,
      0.1,
      5000
    );
    this.camera.position.z = 10;
    this.cameras.push({
      id: 'mainCamera',
      camera: this.camera,
      type: 'perspective',
      onResize: true,
    });

    this.renderer = new THREE.WebGLRenderer({
      alpha,
      antialias,
      preserveDrawingBuffer
    });
    this.renderer.autoClear = autoClear;
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setClearColor(0xff0000);
    this.renderers.push(this.renderer);

    this.time = 0;

    this._clock = new THREE.Clock();

    // this.controls = new OrbitControls(this.camera);

    dat.GUI.prototype.removeLightFolder = function(name) {
      const folder = this.__folders.LightController.__folders[name];
      if (!folder) {
        return;
      }
      folder.close();
      folder.domElement.parentNode.parentNode.removeChild(
        folder.domElement.parentNode
      );
      delete this.__folders.LightController.__folders[name];
      this.onResize();
    };
    window.gui = new dat.GUI();
    window.guiParams = {};

    // this._lightController = new LightController({
    //   lights: [
    //     // { type: 'ambient', color: 0xffffff, intensity: 1, castShadow: false, helper: false },
    //     // { type: 'directional', color: 0xffffff, intensity: 1, castShadow: false, helper: false },
    //     // { type: 'hemisphere', skyColor: 0xffffff, groundColor: 0xd00000, intensity: 1, helper: false, position: new THREE.Vector3(-1, 1, 0) },
    //     // { type: 'point', color: 0xffffff, intensity: 1, distance: 10, decay: 2 },
    //     // { type: 'rect', color: 0xffffff, intensity: 1, width: 10, height: 10 },
    //     // { type: 'spot', color: 0xffffff, castShadow: false, intensity: 1, distance: 10, angle: 0.79, penumbra: 0.2, decay: 2 },
    //   ],
    //   scene: this.scene
    // });

    this.composer = null;

    this._addEvents();
  }

  _addEvents() {
    Signals.onResize.add(this._onResize);
    Signals.onWindowMousemove.add(this._onWindowMousemove);
  }

  // Getters / Setters -----------

  getDOMElement() {
    return this.renderer.domElement;
  }

  // State --------

  add(obj, scene = null) {
    if (!scene) {
      this.scene.add(obj);
    } else {
      scene.add(obj);
    }
  }

  addLight(light) {
    this._lightController.addLight(light);
  }

  addScene({ id = '', scene = new THREE.Scene() } = {}) {
    this.scenes.push({ id, scene });

    return scene;
  }

  getScene(id) {
    for (let i = 0; i < this.scenes.length; i++) {
      const scene = this.scenes[i];

      if (scene.id === id) {
        return scene.scene;
      }
    }

    return console.error(`no scene found with the id : ${id}`);
  }

  addRenderer({ id = '', renderer = new THREE.WebGLRenderer() } = {}) {
    this.renderers.push({ id, renderer });

    return renderer;
  }

  getRenderer(id) {
    for (let i = 0; i < this.renderers.length; i++) {
      const renderer = this.renderers[i];

      if (renderer.id === id) {
        return renderer.renderer;
      }
    }

    return console.error(`no renderer found with the id : ${id}`);
  }

  addRenderTarget({
    id = '',
    renderTarget = new THREE.WebGLRenderTarget()
  } = {}) {
    this.renderTargets.push({ id, renderTarget });

    return renderTarget;
  }

  getRenderTarget(id) {
    for (let i = 0; i < this.renderTargets.length; i++) {
      const renderTarget = this.renderTargets[i];

      if (renderTarget.id === id) {
        return renderTarget.renderTarget;
      }
    }

    return console.error(`no render target found with the id : ${id}`);
  }

  addPerspectiveCamera({
    id = '',
    fov = 50,
    width = window.innerWidth,
    height = window.innerHeight,
    near = 0.1,
    far = 100,
    onResize = true
  } = {}) {
    const camera = new THREE.PerspectiveCamera( fov, width / height, near, far )
    this.cameras.push({ id, camera, type: 'perspective', onResize });

    return camera;
  }

  addOrthographicCamera({
    id = '',
    width = window.innerWidth,
    height = window.innerHeight,
    near = 0,
    far = 100,
    onResize = true
  } = {}) {
    const camera = new THREE.OrthographicCamera(
      width / -2,
      width / 2,
      height / 2,
      height / -2,
      near,
      far
    );
    this.cameras.push({ id, camera, type: 'orthographic', onResize });

    return camera;
  }

  getCamera(id) {
    for (let i = 0; i < this.cameras.length; i++) {
      const camera = this.cameras[i];

      if (camera.id === id) {
        return camera.camera;
      }
    }

    return console.error(`no camera found with the id : ${id}`);
  }

  setClearColor(color = 0x000000, alpha = 1) {
    this.renderer.setClearColor(color, alpha);
  }

  // Events----------

  @autobind
  _onResize() {
    this.resize(window.innerWidth, window.innerHeight);
  }

  resize(width, height) {
    for (let i = 0; i < this.cameras.length; i++) {
      const camera = this.cameras[i];

      if (camera.onResize) {
        if (camera.type === 'perspective') {
          camera.camera.aspect = width / height;
          camera.camera.updateProjectionMatrix();
        } else {
          camera.camera.left = width / -2;
          camera.camera.right = width / 2;
          camera.camera.top = height / 2;
          camera.camera.bottom = height / -2;
          camera.camera.updateProjectionMatrix();
        }
      }
    }

    this.renderer.setSize(width, height);
  }

  @autobind
  _onWindowMousemove(event) {
    const guiContainer = window.gui.domElement.parentNode;
    if (guiContainer.contains(event.target)) {
      if (this.controls) {
        this.controls.enabled = false;
      }
    } else {
      if (this.controls) {
        this.controls.enabled = true;
      }
    }
  }

  // Update ---------

  render() {
    // this.time = this._clock.getElapsedTime()
    // this.renderer.render(this.scene, this.camera)
  }
}
