import _Vue, { PluginObject } from 'vue'
import { LoggerOption } from './types/logger'
import { AuLogger } from './logger'

let instance = new AuLogger()

const plugin: PluginObject<LoggerOption> = {
  install(Vue: typeof _Vue, options?: LoggerOption) {
    if (options) {
      instance = new AuLogger(options)
    }
    Vue.prototype.$logger = instance
  },
}

export { instance as AuLogger }

export default plugin
