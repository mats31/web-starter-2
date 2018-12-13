/* eslint no-unused-vars: "off" */
import { autobind } from 'core-decorators'
import domready from 'domready'
import gsap from 'gsap'
// import AudioController from 'helpers/AudioController' /* exported AudioController */
import AssetLoader from 'core/AssetLoader'
import States from 'core/States'
import Signals from 'core/Signals' /* exported Signals */
import Router from 'core/Router'
import LoaderView from 'views/common/Loader'

class Main {

  // Setup ---------------------------------------------------------------------

  constructor() {

    this._loader = this._setupLoader()
    Signals.onAssetsLoaded.add(this.onAssetsLoaded)
  }

  _setupLoader() {
    const view = new LoaderView({
      parent: document.body,
    })

    return view
  }

  start() {


    // Comment in if using two builds
    if (!States.MOBILE) {
      import('views/desktop/Application').then((module) => {
        import('stylesheets/main.scss').then(() => {
          this._application = new module.default()
          this._onLoadApplication()
        })
      })
    } else {
      import('views/mobile/MobileApplication').then((module) => {
        import('stylesheets/mobile_main.scss').then(() => {
          this._application = new module.default()
          this._onLoadApplication()
        })
      })
    }

    // Comment out if using only one build
    // import('views/desktop/Application').then((module) => {
    //   import('stylesheets/main.scss').then(() => {
    //     this._application = new module.default()
    //     this._onLoadApplication()
    //   })
    // })
  }

  _onLoadApplication() {
    States.router = new Router({
      updatePageCallback: this.updatePage,
    })

    States.router.navigo.resolve()
    this._application.start()
  }

  // Events --------------------------------------------------------------------
  @autobind
  onAssetsLoaded() {
    this.start()
  }

  @autobind
  updatePage(page) {
    if (this._application) {
      this._application.updatePage(page)
    }
  }
}

domready(() => {

  new Main()
})
