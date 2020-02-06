/* eslint no-unused-vars: "off" */
import { autobind } from "core-decorators"
import domready from "domready"
import gsap from "gsap"
// import AudioController from 'helpers/AudioController' /* exported AudioController */
import AssetLoader from "core/AssetLoader"
import States from "core/States"
import Signals from "core/Signals" /* exported Signals */
import Stage3d from "core/Stage3d"
import Router from "core/Router"
import LoaderView from "views/common/Loader"
import Application from "views/desktop/Application"
import raf from "raf"

import 'stylesheets/main.scss';

class Main {
  // Setup ---------------------------------------------------------------------

  constructor() {
    window.gsap = gsap
    window.Stage3d = new Stage3d({
      alpha: true,
      antialias: true,
      autoClear: true,
      preserveDrawingBuffer: false
    })

    this._loader = this._setupLoader();
    Signals.onAssetsLoaded.add(this.onAssetsLoaded);
  }

  _setupLoader() {
    const view = new LoaderView({
      parent: document.body
    });

    return view;
  }

  _start() {
    this._application = new Application();
    this._onLoadApplication();

    this.update()
  }

  _onLoadApplication() {
    States.router = new Router({
      updatePageCallback: this.updatePage
    });

    States.router.navigo.resolve();
    this._application.start();
  }

  // Events --------------------------------------------------------------------
  @autobind
  onAssetsLoaded() {
    this._start();
  }

  @autobind
  updatePage(page, options) {
    if (this._application) {
      this._application.updatePage(page, options);
    }
  }

  // Update ----------

  @autobind
  update() {
    // window.Stage3d.render()

    if (this._application) {
      this._application.update()
    }

    raf(this.update)
  }
}

domready(() => {
  new Main();
});
