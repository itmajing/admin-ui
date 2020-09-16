import { App, Plugin } from 'vue';
import AuGlobal from './global'

const plugin: Plugin = {
  install(app: App) {
    app.config.globalProperties.$global = AuGlobal
  },
}

export { AuGlobal }

export default plugin
