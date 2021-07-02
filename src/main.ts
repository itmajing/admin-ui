import { createApp } from 'vue';

import App from './App.vue';
import Router from './router';
import Store from './store';
import Logger from '@/libs/logger';
import Utils from '@/libs/utils';
import Date from '@/libs/date';
import Global from '@/libs/global';
import Axios from '@/libs/axios';
import Particles from 'vue-particles';
import AntDesign from 'ant-design-vue';
import AuComponents from '@/components';
import './style/index.less';

createApp(App)
  .use(Logger)
  .use(Logger)
  .use(Utils)
  .use(Date)
  .use(Global)
  .use(Axios)
  .use(Particles)
  .use(AntDesign)
  .use(AuComponents)
  .use(Store)
  .use(Router)
  .mount('#app');
