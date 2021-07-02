import { App, Plugin } from 'vue';
import { DateObject } from './types/date';
import AuDate from './date';

const plugin: Plugin = {
  install(app: App) {
    app.config.globalProperties.$date = AuDate;
  },
};

const useDate = (): DateObject => {
  return AuDate;
};

export { useDate };

export default plugin;
