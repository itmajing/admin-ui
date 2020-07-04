import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

import application from './modules/application'

export default new Vuex.Store({
  state: {},
  mutations: {},
  actions: {},
  modules: {
    application,
  },
})
