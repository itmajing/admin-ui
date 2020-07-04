import _Vue, { PluginObject } from 'vue'
import AuUtils from './utils'

const plugin: PluginObject<any> = {
  install(Vue: typeof _Vue) {
    Vue.prototype.$utils = AuUtils
  },
}

export default plugin
