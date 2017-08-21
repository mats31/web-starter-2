import createDOM from 'utils/dom/createDOM';
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
  }

  // State ---------------------------------------------------------------------

  show({ delay = 0 } = {}) {
    this.el.style.display = 'block';
  }

  hide({ delay = 0 } = {}) {
    this.el.style.display = 'none';
  }

}
