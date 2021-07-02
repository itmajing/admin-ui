import { App, Plugin } from 'vue';
import { GlobalObject } from './types/global';
import AuGlobal from './global';

const plugin: Plugin = {
  install(app: App) {
    app.config.globalProperties.$global = AuGlobal;
  },
};

const useGlobal = (): GlobalObject => {
  return AuGlobal;
};

export { AuGlobal, useGlobal };

export default plugin;
