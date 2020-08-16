import _Vue, { PluginObject } from 'vue'
import AuIconfont from './icon/index'
import AuToolkit from './toolkit/toolkit.vue'

const components: any = {
  AuIconfont,
  AuToolkit,
}

const AuComponents: PluginObject<any> = {
  install(Vue: typeof _Vue) {
    Object.keys(components).forEach(key => {
      Vue.component(key, components[key])
    })
  },
}

export default AuComponents
