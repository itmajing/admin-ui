import { App, Plugin } from 'vue';
import AuAxios from './axios'

const plugin: Plugin = {
  install(app: App) {
    app.config.globalProperties.$axios = AuAxios;
  },
}

export { AuAxios }

export default plugin
