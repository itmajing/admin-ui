import _Vue, { PluginObject } from 'vue'
import AuGlobal from './global'

const plugin: PluginObject<any> = {
  install(Vue: typeof _Vue) {
    Vue.prototype.$global = AuGlobal
  },
}

export default plugin
