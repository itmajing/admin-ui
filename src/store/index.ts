import { createStore } from 'vuex';

import application from './modules/application';
import permission from './modules/permission';

export default createStore({
  state: {},
  mutations: {},
  actions: {},
  modules: {
    application,
    permission,
  },
});
