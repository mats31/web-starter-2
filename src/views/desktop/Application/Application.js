import * as pages from 'core/pages';
import { autobind } from 'core-decorators';
import LoaderView from 'views/common/Loader/Loader';
import HomeView from 'views/desktop/Home/Home';

export default class DesktopAppView {

  // Setup ---------------------------------------------------------------------

  constructor() {
    this.el = document.getElementById('application');

    this.views = [];
    this.loader = this.setupLoader();
    this.home = this.setupHome();

    this.views.push(this.loader, this.home);

    this._setupEvents();
  }

  setupLoader() {
    const view = new LoaderView({
      parent: this.el,
    });

    return view;
  }

  setupHome() {
    const view = new HomeView({
      parent: this.el,
    });

    return view;
  }

  _setupEvents() {
    window.addEventListener('resize', this.onResize);
    window.addEventListener('scroll', this.onScroll);

    this.onResize();
  }

  // Events --------------------------------------------------------------------

  updatePage(page) {

    switch (page) {
      case pages.HOME:
        this.loader.hide();
        this.home.show();
        break;
      default:
        this.home.hide();
    }
  }

  @autobind
  onResize() {
    Signals.onResize.dispatch( window.innerWidth, window.innerHeight );
  }

  @autobind
  onScroll() {
    Signals.onScroll.dispatch();
  }

}
