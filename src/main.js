/* eslint no-unused-vars: "off" */
import { autobind } from 'core-decorators';
import domready from 'domready';
import gsap from 'gsap';
import AssetLoader from 'core/AssetLoader';
import Signals from 'core/Signals'; /* exported Signals */
import Router from 'core/Router';
import Application from 'views/desktop/Application/Application';
// import Router from 'core/Router';


import './stylesheets/main.scss';

class Main {

  // Setup ---------------------------------------------------------------------

  constructor() {

    this.setup();
  }

  setup() {

    this.start();
    this.router = new Router({
      updatePageCallback: this.updatePage,
    });
    this.router.navigo.resolve();
  }

  // State ---------------------------------------------------------------------

  start() {
    this.application = new Application({
      router: this.router,
    });
  }

  // Events --------------------------------------------------------------------
  @autobind
  updatePage(page) {
    this.application.updatePage(page);
  }
}

domready(() => {

  new Main();
});
