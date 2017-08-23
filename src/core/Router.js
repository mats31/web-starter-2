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
    this.router = new Navigo(`${window.location.protocol}//${window.location.host}`);

    this.router.notFound(this.onRouteNotFound);
    this.router.on({
      '/': { as: pages.HOME, uses: this.onRouteHome },
      '/home': { as: pages.HOME, uses: this.onRouteHome },
    });
    this.router.resolve();
  }

  // State ---------------------------------------------------------------------

  navigateTo(id, options) {
    this.router.navigate(this.router.generate(id, options));
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
