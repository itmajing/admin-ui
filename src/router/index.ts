import { createRouter, createWebHistory, RouteLocationNormalized } from 'vue-router';
import store from '@/store/index';
import { userRoutes } from './routes';
import { AuUtils } from '@/libs/utils';
import { AUTH_HEADER } from '@/constant';
import { addRoutes } from '@/router/utils';

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes: [...userRoutes],
});

const loginRoute = 'login';
const defaultRoute = 'home';
const passRouteList = ['login', 'register'];

const initRoutes = () => {
  return new Promise((resolve) => {
    store.dispatch('getPermissions').then((userPermissions) => {
      store.dispatch('generateRoutes', userPermissions).then((accessedRoutes) => {
        addRoutes(router, accessedRoutes);
        resolve(true);
      });
    });
  });
};

router.beforeEach(async (to: RouteLocationNormalized, from: RouteLocationNormalized) => {
  const loginStatus = store.getters.loginStatus;
  if (loginStatus) {
    const permissions = store.getters.permissions;
    if (!permissions) {
      await initRoutes();
      const redirect = decodeURIComponent(`${(from.query && from.query.redirect) || to.path}`);
      if (to.path === redirect) {
        return { ...to, replace: true };
      } else {
        return { path: redirect, replace: true };
      }
    } else {
      if (to.name === loginRoute) {
        return { name: defaultRoute };
      } else {
        return true;
      }
    }
  } else {
    if (passRouteList.includes((to.name as string) || '')) {
      return true;
    } else {
      return { name: loginRoute, query: { redirect: to.fullPath } };
    }
  }
});

// reset access-token when refresh page
const accessToken = AuUtils.getSessionStorageItem(AUTH_HEADER);
if (accessToken) {
  store.commit('setAccessToken', accessToken);
}

export default router;
