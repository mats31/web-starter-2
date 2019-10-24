import Signal from 'min-signal'

class Signals {

  constructor() {

    // Assets
    this.onAssetLoaded = new Signal()
    this.onAssetsLoaded = new Signal()

    // General
    this.onScrollWheel = new Signal()
    this.onMobileScroll = new Signal()
    this.onResize = new Signal()
    this.onScroll = new Signal()
    this.onWindowMousemove = new Signal()
    this.onWindowMousedown = new Signal()
    this.onWindowMouseup = new Signal()
    this.onWindowTouchstart = new Signal()
    this.onWindowTouchmove = new Signal()
    this.onWindowTouchend = new Signal()
  }
}

window.Signals = new Signals()

export default window.Signals
