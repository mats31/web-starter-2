import LoaderView from 'views/common/Loader/Loader';
import HomeView from 'views/desktop/Home/Home';

export default Vue.extend({

  template,

  emitterEvents: [],

  data() {

    return {};
  },

  ready() {},

  methods: {},

  components: {
    'loader-component': LoaderComponent,
  },
});

export default class DesktopAppView {

  // Setup ---------------------------------------------------------------------

  constructor() {

    this._el = document.getElementByID('application');

    this._home = this._setupHome();
  }

  _setupHome() {

    const view = new HomeView({
      parent: this._el,
    });
  }

}
