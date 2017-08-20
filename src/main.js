/* eslint no-unused-vars: "off" */

import domready from 'domready';
import gsap from 'gsap';
import Application from 'views/desktop/Application/Application';
// import Router from 'core/Router';
import Signals from 'core/Signals'; /* exported Signals */

import AssetLoader from 'core/AssetLoader';

import './stylesheets/main.styl';

class Main {

  constructor() {

    this.setup();
  }

  setup() {

    this.router = new Router();
    this.start();
  }

  start() {
    new Application({
      router: this.router,
    }).$mount('#application');
  }
}

domready(() => {

  new Main();
});
