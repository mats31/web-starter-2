import * as pages from 'core/pages';
import HomeView from 'views/desktop/Home/Home';

export default class DesktopAppView {

  // Setup ---------------------------------------------------------------------

  constructor() {
    this.el = document.getElementById('application');

    this.home = this.setupHome();
  }

  setupHome() {

    const view = new HomeView({
      parent: this.el,
    });

    return view;
  }

  // Events --------------------------------------------------------------------

  updatePage(page) {

    switch (page) {
      case pages.HOME:
        this.home.show();
        break;
      default:
        this.home.hide();
    }
  }

}
