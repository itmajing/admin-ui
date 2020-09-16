import { App, Plugin } from 'vue';
import AuUtils from './utils'

const plugin: Plugin = {
  install(app: App) {
    app.config.globalProperties.$utils = AuUtils
  },
}

export { AuUtils }

export default plugin
