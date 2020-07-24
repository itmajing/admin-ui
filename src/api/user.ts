import { AuApi } from '@/api/utils'
import { AuAxios } from '@/libs/axios'

const USER_PASSWORD_LOGIN: AuApi = {
  url: 'api/auth/login/password',
  method: 'POST',
}

const USER_MOBILE_LOGIN: AuApi = {
  url: 'api/auth/login/mobile',
  method: 'POST',
}

const USER_LOGOUT: AuApi = {
  url: 'api/auth/logout',
  method: 'POST',
}

const USER_INFO: AuApi = {
  url: 'api/user/info',
  method: 'GET',
}

const USER_PERMISSION: AuApi = {
  url: 'api/user/permission',
  method: 'GET',
}

export function userPasswordLogin(loginInfo: object) {
  return AuAxios.request({
    ...USER_PASSWORD_LOGIN,
    data: loginInfo,
  })
}

export function userMobileLogin(loginInfo: object) {
  return AuAxios.request({
    ...USER_MOBILE_LOGIN,
    data: loginInfo,
  })
}

export function userLogout() {
  return AuAxios.request({
    ...USER_LOGOUT,
  })
}

export function getUserInfo() {
  return AuAxios.request({
    ...USER_INFO,
  })
}

export function getUserPermission() {
  return AuAxios.request({
    ...USER_PERMISSION,
  })
}
