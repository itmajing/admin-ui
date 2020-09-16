import { App, Plugin } from 'vue';
import AuDate from './date'

const plugin: Plugin = {
  install(app: App) {
    app.config.globalProperties.$date = AuDate;
  },
}

export default plugin
