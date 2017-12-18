/* eslint no-unused-vars: "off" */
import { autobind } from 'core-decorators';
import domready from 'domready';
import gsap from 'gsap';
import AssetLoader from 'core/AssetLoader';
import States from 'core/States';
import Signals from 'core/Signals'; /* exported Signals */
import Router from 'core/Router';
import Application from 'views/desktop/Application/Application';
// import Router from 'core/Router';


import './stylesheets/main.scss';

class Main {

  // Setup ---------------------------------------------------------------------

  constructor() {

    Signals.onAssetsLoaded.add(this.onAssetsLoaded);
  }

  start() {
    this.application = new Application({});

    States.router = new Router({
      updatePageCallback: this.updatePage,
    });

    States.router.navigo.resolve();
  }

  // Events --------------------------------------------------------------------
  @autobind
  onAssetsLoaded() {
    this.start();
  }

  @autobind
  updatePage(page) {
    this.application.updatePage(page);
  }
}

domready(() => {

  new Main();
});
