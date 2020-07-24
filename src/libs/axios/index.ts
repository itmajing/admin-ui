import _Vue, { PluginObject } from 'vue'
import AuAxios from './axios'

const plugin: PluginObject<any> = {
  install(Vue: typeof _Vue) {
    Vue.prototype.$axios = AuAxios
  },
}

export { AuAxios }

export default plugin
