import { AuUtils } from '@/libs/utils'
import { AUTH_HEADER, SUCCESS_CODE } from '@/constant'
import { Module } from 'vuex'
import { generateMenu, Menu, optimizeRoutes } from '@/router/utils'
import { appRoutes } from '@/router/routes'
import { RouteConfig } from 'vue-router'
import { getUserPermission, userLogout, userMobileLogin, userPasswordLogin } from '@/api/user'

function hasPermission(route: RouteConfig, permissions: string[]) {
  if (route.meta && route.meta.permission) {
    const permission = route.meta && route.meta.permission
    return permissions.indexOf(permission) > -1
  }
  return true
}

function filterRoutes(routes: RouteConfig[], permissions: string[]) {
  return routes.filter(route => {
    if (hasPermission(route, permissions)) {
      if (route.children && route.children.length) {
        route.children = filterRoutes(route.children, permissions)
      }
      return true
    }
    return false
  })
}

interface State {
  accessedMenus: Menu[]
  accessedRoutes: RouteConfig[]
  accessToken?: string
  userInfo?: any
  permissions?: []
}

const application: Module<State, any> = {
  state: {
    accessedMenus: [],
    accessedRoutes: [],
    accessToken: undefined,
    userInfo: undefined,
    permissions: undefined,
  },
  mutations: {
    setAccessToken(state: State, accessToken: string) {
      state.accessToken = accessToken
      AuUtils.setSessionStorageItem(AUTH_HEADER, accessToken)
    },
    removeAccessToken(state: State) {
      state.accessToken = ''
      AuUtils.removeSessionStorageItem(AUTH_HEADER)
    },
    setAccessedRoutes(state: State, accessedRoutes: RouteConfig[]) {
      state.accessedRoutes = accessedRoutes
    },
    setAccessedMenus(state: State, accessedMenus: Menu[]) {
      state.accessedMenus = accessedMenus
    },
    setUserInfo(state: State, userInfo: any) {
      state.userInfo = userInfo
    },
    setPermissions(state: State, permissions: []) {
      state.permissions = permissions
    },
  },
  actions: {
    userPasswordLogin({ commit }, loginInfo: object) {
      return new Promise((resolve, reject) => {
        userPasswordLogin(loginInfo)
          .then(({ data = {} }) => {
            if (data.code === SUCCESS_CODE) {
              commit('setAccessToken', data.data)
              resolve()
            } else {
              reject(data.code)
            }
          })
          .catch(err => {
            reject(err)
          })
      })
    },
    userMobileLogin({ commit }, loginInfo: object) {
      return new Promise((resolve, reject) => {
        userMobileLogin(loginInfo)
          .then(({ data = {} }) => {
            if (data.code === SUCCESS_CODE) {
              commit('setAccessToken', data.data)
              resolve()
            } else {
              reject(data.code)
            }
          })
          .catch(err => {
            reject(err)
          })
      })
    },
    userLogout({ commit }) {
      return new Promise((resolve, reject) => {
        userLogout()
          .then(({ data = {} }) => {
            if (data.code === SUCCESS_CODE) {
              commit('removeAccessToken')
              resolve()
            } else {
              reject(data.code)
            }
          })
          .catch(err => {
            reject(err)
          })
      })
    },
    generateRoutes({ commit }, permissions: string[]) {
      return new Promise(resolve => {
        const optimizedRoutes = optimizeRoutes(appRoutes)
        const accessedRoutes = filterRoutes(optimizedRoutes, permissions)
        const accessedMenus = generateMenu(accessedRoutes)
        commit('setAccessedRoutes', accessedRoutes)
        commit('setAccessedMenus', accessedMenus)
        resolve()
      })
    },
    getPermissions({ commit }) {
      return new Promise((resolve, reject) => {
        getUserPermission()
          .then(({ data = {} }) => {
            const permissions = data.data || []
            commit('setPermissions', permissions)
            resolve(permissions)
          })
          .catch(err => {
            reject(err)
          })
      })
    },
  },
  getters: {
    loginStatus(state: State) {
      return !!state.accessToken
    },
    accessToken(state: State) {
      return state.accessToken
    },
    accessedRoutes(state: State) {
      return state.accessedRoutes
    },
    accessedMenus(state: State) {
      return state.accessedMenus
    },
    userInfo(state: State) {
      return state.userInfo
    },
    permissions(state: State) {
      return state.permissions
    },
  },
}

export default application
