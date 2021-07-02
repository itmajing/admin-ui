import { App, Plugin } from 'vue';
import { LoggerOption } from './types/logger';
import { AuLogger } from './logger';

let instance = new AuLogger();

const plugin: Plugin = {
  install(app: App, options?: LoggerOption) {
    if (options) {
      instance = new AuLogger(options);
    }
    app.config.globalProperties.$logger = instance;
  },
};

const useLogger = (): AuLogger => {
  return instance;
};

export { instance as AuLogger, useLogger };

export default plugin;
