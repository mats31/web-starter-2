import States from 'core/States'
import { createDOM } from 'utils/dom'
import { autobind } from 'core-decorators'
import { visible } from 'core/decorators'
import template from './home.tpl.html'
import './home.scss'


@visible()
export default class DesktopHomeView {

  // Setup ---------------------------------------------------------------------

  constructor(options) {

    this.el = options.parent.appendChild(
      createDOM(template()),
    )

    this._addImage()
    this._setupEvents()
  }

  _addImage() {
    const image = States.resources.getImage('twitter').media
    this.el.appendChild(image)
  }

  _setupEvents() {
    Signals.onResize.add(this._onResize)
  }

  // State ---------------------------------------------------------------------

  show({ delay = 0 } = {}) {
    this.el.style.display = 'block'
  }

  hide({ delay = 0 } = {}) {
    this.el.style.display = 'none'
  }

  // Events --------------------------------------------------------------------

  @autobind
  _onResize(vw, vh) {
    this.resize(vw, vh)
  }

  resize(vw, vh) {
    
  }

}
