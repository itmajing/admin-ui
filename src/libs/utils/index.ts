import { App, Plugin } from 'vue';
import { UtilsObject } from './types/utils';
import AuUtils from './utils';

const plugin: Plugin = {
  install(app: App) {
    app.config.globalProperties.$utils = AuUtils;
  },
};

const useUtils = (): UtilsObject => {
  return AuUtils;
};

export { AuUtils, useUtils };

export default plugin;
