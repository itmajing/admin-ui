import { App, Plugin } from 'vue';
import AuIconfont from './icon/index';
import AuToolkit from './toolkit/toolkit.vue';
import AuElasticPanel from './panel/elastic-panel.vue';

const components: any = {
  AuIconfont,
  AuToolkit,
  AuElasticPanel,
}

const AuComponents: Plugin = {
  install(app: App) {
    Object.keys(components).forEach(key => {
      app.component(key, components[key])
    })
  },
}

export default AuComponents
