import { App, Plugin } from 'vue';
import { AxiosInstance } from 'axios';
import AuAxios from './axios';

const plugin: Plugin = {
  install(app: App) {
    app.config.globalProperties.$axios = AuAxios;
  },
};

const useAxios = (): AxiosInstance => {
  return AuAxios;
};

export { AuAxios, useAxios };

export default plugin;
