import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import Logger from '@/libs/logger'
import Utils from '@/libs/utils'
import Date from '@/libs/date'
import Global from '@/libs/global'
import Axios from '@/libs/axios'
import Particles from 'vue-particles'
import AntDesign from 'ant-design-vue'
import './style/index.less'

Vue.use(Logger)
Vue.use(Utils)
Vue.use(Date)
Vue.use(Global)
Vue.use(Axios)
Vue.use(Particles)
Vue.use(AntDesign)

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app')
