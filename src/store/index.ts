import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

import application from './modules/application'
import permission from './modules/permission'

export default new Vuex.Store({
  state: {},
  mutations: {},
  actions: {},
  modules: {
    application,
    permission,
  },
})
