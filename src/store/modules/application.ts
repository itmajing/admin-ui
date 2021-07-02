import { Module } from 'vuex';
import { RouteLocationNormalizedLoaded, RouteRecordRaw } from 'vue-router';
import { AuUtils } from '@/libs/utils';
import { homeRoute } from '@/router/routes';
import { sha256 } from 'js-sha256';
import { findRouteByName } from '@/router/utils';

export interface MultiOptions {
  name: string;
  title?: string;
  query?: any;
  params?: any;
}

export interface MultiTab {
  name: string;
  path: string;
  title: string;
  closable: boolean;
  query: any;
  params: any;
  digest?: string;
}

function generateDefaultMultiTab(): MultiTab {
  const { name, path } = homeRoute;
  if (!name) {
    throw new Error(`The route name must be provided, path: ${path}`);
  }

  const { title } = homeRoute.meta || {};

  return {
    name: String(name),
    path: path,
    title: String(title) || String(name),
    closable: false,
    query: {},
    params: {},
  };
}

function generateRouteMultiTab(route: RouteLocationNormalizedLoaded): MultiTab {
  if (!route) {
    throw new Error('The route must be not null');
  }

  const { name, fullPath, query, params } = route || {};
  if (!String(name)) {
    throw new Error(`The route name must be provided, path: ${fullPath}`);
  }

  const { title, closable } = route.meta || {};

  return {
    name: String(name),
    path: fullPath,
    title: String(title) || String(name),
    closable: !(closable === false),
    query: query,
    params: params,
  };
}

function generateMultiTab(options: MultiOptions, routes: RouteRecordRaw[]): MultiTab | null {
  const route = findRouteByName(routes, options.name);

  if (route) {
    const { name, path } = route;
    const { title } = route.meta || {};

    // replace path params
    let newPath = path;
    if (options.params) {
      for (const key of Object.keys(options.params)) {
        const regex = new RegExp(`:${key}`, 'g');
        const value = `${options.params[key]}`;
        newPath = newPath.replace(regex, value);
      }
    }

    return {
      path: newPath,
      name: options.name,
      title: options.title || String(title) || String(name),
      closable: true,
      query: options.query || {},
      params: options.params || {},
    };
  }

  return null;
}

function injectMultiTabDigest(multiTab: MultiTab) {
  if (multiTab) {
    const newMultiTab: MultiTab = {
      name: multiTab.name,
      path: multiTab.path,
      // 获取摘要时不需要标题字段
      title: 'needless',
      closable: multiTab.closable,
      query: multiTab.query || {},
      params: multiTab.params || {},
    };

    // convert prop type
    for (const key of Object.keys(newMultiTab.params)) {
      newMultiTab.params[key] = `${newMultiTab.params[key]}`;
    }
    for (const key of Object.keys(newMultiTab.query)) {
      newMultiTab.query[key] = `${newMultiTab.query[key]}`;
    }

    newMultiTab.digest = sha256.hex(JSON.stringify(newMultiTab));
    newMultiTab.title = multiTab.title;
    return newMultiTab;
  } else {
    throw new Error(`Illegal multi-tab: ${JSON.stringify(multiTab)} `);
  }
}

interface State {
  openedMultiTabs: MultiTab[];
  activeMultiTab?: MultiTab;
  containerHeight: number;
}

interface StoreMultiTabs {
  openedMultiTabs: MultiTab[];
  activeMultiTab: MultiTab;
}

const OPENED_TABS = 'OpenedMultiTabs';

const application: Module<State, any> = {
  state: {
    openedMultiTabs: [],
    activeMultiTab: undefined,
    containerHeight: 0,
  },
  mutations: {
    setInitMultiTabs(state: State, storeMultiTabs: StoreMultiTabs) {
      state.openedMultiTabs = storeMultiTabs.openedMultiTabs;
      state.activeMultiTab = storeMultiTabs.activeMultiTab;

      AuUtils.setSessionStorageItem(OPENED_TABS, storeMultiTabs);
    },
    addOpenedTab(state: State, multiTab: MultiTab) {
      const newMultiTab = injectMultiTabDigest(multiTab);
      const openedMultiTab = state.openedMultiTabs.find((t) => t.digest === newMultiTab.digest);
      if (!openedMultiTab) {
        state.openedMultiTabs.push(newMultiTab);
      }
      state.activeMultiTab = newMultiTab;

      AuUtils.setSessionStorageItem(OPENED_TABS, {
        activeMultiTab: state.activeMultiTab,
        openedMultiTabs: state.openedMultiTabs,
      });
    },
    setActiveTab(state: State, digest: string) {
      const openedMultiTab = state.openedMultiTabs.find((t) => t.digest === digest);
      if (openedMultiTab) {
        state.activeMultiTab = openedMultiTab;
      }

      AuUtils.setSessionStorageItem(OPENED_TABS, {
        activeMultiTab: state.activeMultiTab,
        openedMultiTabs: state.openedMultiTabs,
      });
    },
    removeOpenedTab(state: State, digest: string) {
      const openedMultiTabs = state.openedMultiTabs;
      if (openedMultiTabs.length > 1) {
        for (let i = 0; i < openedMultiTabs.length; i++) {
          if (openedMultiTabs[i].digest === digest) {
            if (state.activeMultiTab && state.activeMultiTab.digest === digest) {
              if (i >= 1) {
                state.activeMultiTab = openedMultiTabs[i - 1];
              } else {
                state.activeMultiTab = openedMultiTabs[i + 1];
              }
            }
            openedMultiTabs.splice(i, 1);
            break;
          }
        }
      } else {
        let multiTab = generateDefaultMultiTab();
        multiTab = injectMultiTabDigest(multiTab);
        state.openedMultiTabs = [multiTab];
        state.activeMultiTab = multiTab;
      }

      AuUtils.setSessionStorageItem(OPENED_TABS, {
        activeMultiTab: state.activeMultiTab,
        openedMultiTabs: state.openedMultiTabs,
      });
    },
    removeAllOpenedTab(state: State) {
      let multiTab = generateDefaultMultiTab();
      multiTab = injectMultiTabDigest(multiTab);
      state.openedMultiTabs = [multiTab];
      state.activeMultiTab = multiTab;

      AuUtils.setSessionStorageItem(OPENED_TABS, {
        activeMultiTab: state.activeMultiTab,
        openedMultiTabs: state.openedMultiTabs,
      });
    },
    removeOtherOpenedTab(state: State) {
      state.openedMultiTabs = state.openedMultiTabs.filter((tab) => {
        return (
          !tab.closable || tab.digest === (state.activeMultiTab ? state.activeMultiTab.digest : '')
        );
      });

      AuUtils.setSessionStorageItem(OPENED_TABS, {
        activeMultiTab: state.activeMultiTab,
        openedMultiTabs: state.openedMultiTabs,
      });
    },
    setContainerHeight(state: State, height: number) {
      state.containerHeight = height;
    },
  },
  actions: {
    initMultiTabs({ commit }, route: RouteLocationNormalizedLoaded) {
      return new Promise((resolve) => {
        const storageTabs: StoreMultiTabs = AuUtils.getSessionStorageItem(OPENED_TABS);
        if (storageTabs) {
          commit('setInitMultiTabs', {
            openedMultiTabs: storageTabs.openedMultiTabs,
            activeMultiTab: storageTabs.activeMultiTab,
          });
        } else {
          const multiTab = generateDefaultMultiTab();
          commit('addOpenedTab', multiTab);
        }

        const multiTab = generateRouteMultiTab(route);
        commit('addOpenedTab', multiTab);
        resolve(true);
      });
    },
    addMultiTab({ commit, getters }, options: MultiOptions) {
      return new Promise((resolve, reject) => {
        const multiTab = generateMultiTab(options, getters.accessedRoutes);
        if (multiTab) {
          commit('addOpenedTab', multiTab);
          resolve(true);
        } else {
          reject(`The route not exist, name: ${options.name} `);
        }
      });
    },
    removeMultiTab({ commit }, digest: string) {
      return new Promise((resolve) => {
        commit('removeOpenedTab', digest);
        resolve(true);
      });
    },
    removeAllMultiTab({ commit }) {
      return new Promise((resolve) => {
        commit('removeAllOpenedTab');
        resolve(true);
      });
    },
    removeOtherMultiTab({ commit }) {
      return new Promise((resolve) => {
        commit('removeOtherOpenedTab');
        resolve(true);
      });
    },
    activateMultiTab({ commit }, digest: string) {
      return new Promise((resolve) => {
        commit('setActiveTab', digest);
        resolve(true);
      });
    },
    updateContainerHeight({ commit }, height: number) {
      return new Promise((resolve) => {
        commit('setContainerHeight', height);
        resolve(true);
      });
    },
  },
  getters: {
    openedMultiTabs(state: State) {
      return state.openedMultiTabs;
    },
    activeMultiTab(state: State) {
      return state.activeMultiTab;
    },
    containerHeight(state: State) {
      return state.containerHeight;
    },
  },
};

export default application;
