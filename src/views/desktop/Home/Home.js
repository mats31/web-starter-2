import States from 'core/States';
import createDOM from 'utils/dom/createDOM';
import { autobind } from 'core-decorators';
import { visible } from 'core/decorators';
import template from './home.tpl.html';
import './home.scss';


@visible()
export default class DesktopHomeView {

  // Setup ---------------------------------------------------------------------

  constructor(options) {

    this.el = options.parent.appendChild(
      createDOM(template()),
    );

    this.setupEvents();
  }

  setupEvents() {
    Signals.onAssetsLoaded.add(this.onAssetsLoaded);
  }

  // State ---------------------------------------------------------------------

  show({ delay = 0 } = {}) {
    this.el.style.display = 'block';
  }

  hide({ delay = 0 } = {}) {
    this.el.style.display = 'none';
  }

  // Events --------------------------------------------------------------------
  @autobind
  onAssetsLoaded() {

    const image = States.resources.getImage('twitter').media;
    this.el.appendChild(image);
  }

}
