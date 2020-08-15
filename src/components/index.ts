import _Vue, { PluginObject } from 'vue'
import AIconfont from './icon/index'

const components: any = {
  AIconfont,
}

const AuComponents: PluginObject<any> = {
  install(Vue: typeof _Vue) {
    Object.keys(components).forEach(key => {
      Vue.component(key, components[key])
    })
  },
}

export default AuComponents
