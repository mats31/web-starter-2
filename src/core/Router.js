import { autobind } from 'core-decorators';
import * as pages from 'core/pages';
import Navigo from 'navigo';

export default class Router {

  // Setup ---------------------------------------------------------------------

  constructor(options) {

    this.updatePageCallback = options.updatePageCallback;

    this.setupRouter();
  }

  setupRouter() {
    this.navigo = new Navigo(`${window.location.protocol}//${window.location.host}`);

    this.navigo.notFound(this.onRouteNotFound);
    this.navigo.on({
      '/': { as: pages.HOME, uses: this.onRouteHome },
      '/home': { as: pages.HOME, uses: this.onRouteHome },
    });
  }

  // State ---------------------------------------------------------------------

  navigateTo(id, options) {
    this.navigo.navigate(this.navigo.generate(id, options));
  }

  // Events --------------------------------------------------------------------

  @autobind
  onRouteNotFound() {
    this.updatePageCallback(pages.HOME);
  }

  @autobind
  onRouteHome() {
    this.updatePageCallback(pages.HOME);
  }

}
