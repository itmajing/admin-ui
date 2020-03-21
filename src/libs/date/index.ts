import _Vue, { PluginObject } from 'vue';
import AuDate from './date';

const plugin: PluginObject<any> = {
  install(Vue: typeof _Vue) {
    const date = new AuDate();
    Vue.prototype.$date = date;
    Vue.filter('timestamp', date.format);
  }
};

export default plugin;
