import * as pages from 'core/pages'
import { autobind } from 'core-decorators'
import States from 'core/States'
import HomeView from 'views/desktop/Home'

export default class DesktopAppView {

  // Setup ---------------------------------------------------------------------

  constructor() {
    console.info('desktop application initializing')
    this.el = document.getElementById('application')

    this._setupDOMClasses()

    this._views = []
    this._home = this._setupHome()

    this._views.push(this._home)

    this._setupEvents()
  }

  _setupDOMClasses() {

    if (States.MOBILE) {
      document.documentElement.classList.add('mobile');
    } else if (States.TABLET) {
      document.documentElement.classList.add('tablet');
    } else if (States.DESKTOP) {
      document.documentElement.classList.add('desktop');
    }

    if (States.IOS) {
      document.documentElement.classList.add('ios');
    }
    if (States.ANDROID) {
      document.documentElement.classList.add('android');
    }
    if (States.IS_IE) {
      document.documentElement.classList.add('ie');
    }
    if (States.IS_SAFARI) {
      document.documentElement.classList.add('safari');
    }
    if (States.IS_CHROME) {
      document.documentElement.classList.add('chrome');
    }
    if (States.IS_FF) {
      document.documentElement.classList.add('firefox');
    }

  }

  _setupHome() {
    const view = new HomeView({
      parent: this.el,
    })

    return view
  }

  _setupEvents() {
    window.addEventListener("resize", this._onResize)

    if (States.DESKTOP) {
      window.addEventListener("scroll", this._onScroll)
      if (States.IS_FF) {
        window.addEventListener("wheel", this._onScrollWheel)
      } else {
        window.addEventListener("mousewheel", this._onScrollWheel)
        window.addEventListener("DOMMouseScroll", this._onScrollWheel)
      }
      window.addEventListener("mousemove", this._onWindowMousemove)
      window.addEventListener("mousedown", this._onWindowMousedown)
      window.addEventListener("mouseup", this._onWindowMouseup)
    } else {
      window.addEventListener("touchstart", this._onWindowTouchstart)
      window.addEventListener("touchmove", this._onWindowTouchmove)
      window.addEventListener("touchend", this._onWindowTouchend)
    }

    this._onResize()
  }

  // State ---------------------------------------------------------------------
  start() { }

  // Events --------------------------------------------------------------------

  updatePage(page) {

    switch (page) {
      case pages.HOME:
        this._home.show()
        break
      default:
        this._home.hide()
    }
  }

  @autobind
  _onResize() {
    Signals.onResize.dispatch(window.innerWidth, window.innerHeight)
  }

  @autobind
  _onScroll(event) {
    Signals.onScroll.dispatch(event)
  }

  @autobind
  _onScrollWheel(event) {
    Signals.onScrollWheel.dispatch(event)
  }

  @autobind
  _onWindowMousemove(event) {
    Signals.onWindowMousemove.dispatch(event)
  }

  @autobind
  _onWindowMousedown(event) {
    Signals.onWindowMousedown.dispatch(event)
  }

  @autobind
  _onWindowMouseup(event) {
    Signals.onWindowMouseup.dispatch(event)
  }

  @autobind
  _onWindowTouchstart(event) {
    Signals.onWindowTouchstart.dispatch(event)
  }

  @autobind
  _onWindowTouchmove(event) {
    Signals.onWindowTouchmove.dispatch(event)
  }

  @autobind
  _onWindowTouchend(event) {
    Signals.onWindowTouchend.dispatch(event)
  }

  update() { }

}
