import _Vue, { PluginObject } from 'vue'
import { LoggerOption } from './types/logger'
import AuLogger from './logger'

const plugin: PluginObject<LoggerOption> = {
  install(Vue: typeof _Vue, options?: LoggerOption) {
    Vue.prototype.$logger = new AuLogger(options)
  },
}

export default plugin
