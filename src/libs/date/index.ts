import _Vue, { PluginObject } from 'vue'
import AuDate from './date'

const plugin: PluginObject<any> = {
  install(Vue: typeof _Vue) {
    Vue.prototype.$date = AuDate
    Vue.filter('timestamp', AuDate.format)
  },
}

export default plugin
