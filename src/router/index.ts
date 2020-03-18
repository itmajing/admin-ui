import Vue from 'vue';
import VueRouter from 'vue-router';
import routes from './routes';
import store from '@/store/index';

Vue.use(VueRouter);

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
});

router.beforeEach((to, from, next) => {
  const accessToken = (store.state as any).application.accessToken;
  if (accessToken) {
    // TODO 检查token是否有效
    if (to.name === 'login') {
      next({ path: '/' });
    } else {
      // TODO 权限控制meta.xxx
      next();
    }
  } else {
    if (to.name === 'login' || to.name === 'register') {
      next();
    } else {
      next({ name: 'login' });
    }
  }
});

export default router;
