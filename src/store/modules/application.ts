import utils from '@/libs/utils/utils'
import { HashRouterTab, RouterTab } from '@/libs/utils/types/utils'
import routes from '@/router/routes'
import { RouteConfig } from 'vue-router'
import { AUTH_HEADER } from '@/libs/global/constant'

interface State {
  accessToken: string
  openedTabs: HashRouterTab[]
  activeTab: HashRouterTab
}

const OPENED_TABS = 'open-tabs'

const application = {
  state: {
    accessToken: '',
    openedTabs: [],
    activeTab: {},
  },
  mutations: {
    initOpenedTab(state: State, route: RouteConfig) {
      console.log(`init opened menu, current route: ${route.name}`)
      const storageTabs = utils.getSessionStorageItem(OPENED_TABS)
      if (storageTabs) {
        state.activeTab = storageTabs.activeTab
        state.openedTabs = storageTabs.openedTabs
        // TODO filter not exist menu
      } else {
        const routerTab = utils.generateDefaultRouterTab()
        ;(this as any).commit('addOpenedTab', routerTab)
      }

      // 解析路由
      if (route.name) {
        const routerTab = utils.generateRouterTab(route.name)
        ;(this as any).commit('addOpenedTab', routerTab)
      }
    },
    addOpenedTab(state: State, source: RouterTab) {
      if (source) {
        const routerTab = utils.generateHashRouterTab(source)
        const openedTab = state.openedTabs.find(t => t.hash === routerTab.hash)
        if (!openedTab) {
          state.openedTabs.push(routerTab)
        }
        state.activeTab = routerTab
        utils.setSessionStorageItem(OPENED_TABS, {
          activeTab: state.activeTab,
          openedTabs: state.openedTabs,
        })
      }
    },
    setActiveTab(state: State, hash: string) {
      const openedTab = state.openedTabs.find(t => t.hash === hash)
      if (openedTab) {
        state.activeTab = openedTab
      }
      utils.setSessionStorageItem(OPENED_TABS, {
        activeTab: state.activeTab,
        openedTabs: state.openedTabs,
      })
    },
    removeOpenedTab(state: State, hash: string) {
      const openedTabs = state.openedTabs
      if (openedTabs.length > 1) {
        for (let i = 0; i < openedTabs.length; i++) {
          if (openedTabs[i].hash === hash) {
            if (state.activeTab.hash === hash) {
              if (i >= 1) {
                state.activeTab = openedTabs[i - 1]
              } else {
                state.activeTab = openedTabs[i + 1]
              }
            }
            openedTabs.splice(i, 1)
            break
          }
        }
      } else {
        const routerTab = utils.generateDefaultRouterTab()
        state.openedTabs = [routerTab]
        state.activeTab = routerTab
      }
      utils.setSessionStorageItem(OPENED_TABS, {
        activeTab: state.activeTab,
        openedTabs: state.openedTabs,
      })
    },
    removeAllOpenedTab(state: State) {
      const routerTab = utils.generateDefaultRouterTab()
      state.openedTabs = []
      ;(this as any).commit('addOpenedTab', routerTab)
    },
    removeOtherOpenedTab(state: State) {
      state.openedTabs = state.openedTabs.filter(tab => {
        return !tab.closable || tab.hash === state.activeTab.hash
      })

      utils.setSessionStorageItem(OPENED_TABS, {
        activeTab: state.activeTab,
        openedTabs: state.openedTabs,
      })
    },
    setAccessToken(state: State, accessToken: string) {
      state.accessToken = accessToken
      utils.setSessionStorageItem(AUTH_HEADER, accessToken)
    },
    removeAccessToken(state: State) {
      state.accessToken = ''
      utils.removeSessionStorageItem(AUTH_HEADER)
    },
  },
  actions: {},
  getters: {
    menuList() {
      return utils.generateMenuList(routes)
    },
  },
}

export default application
