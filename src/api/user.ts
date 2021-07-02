import { AuApi } from '@/api/utils';
import { AuAxios } from '@/libs/axios';

export interface LoginInfo {
  [key: string]: any;
}

const USER_PASSWORD_LOGIN: AuApi = {
  url: 'api/auth/login/password',
  method: 'POST',
};

const USER_MOBILE_LOGIN: AuApi = {
  url: 'api/auth/login/mobile',
  method: 'POST',
};

const USER_LOGOUT: AuApi = {
  url: 'api/auth/logout',
  method: 'POST',
};

const USER_INFO: AuApi = {
  url: 'api/user/info',
  method: 'GET',
};

const USER_PERMISSION: AuApi = {
  url: 'api/user/permission',
  method: 'GET',
};

export function userPasswordLogin(loginInfo: LoginInfo): Promise<any> {
  return AuAxios.request({
    ...USER_PASSWORD_LOGIN,
    data: loginInfo,
  });
}

export function userMobileLogin(loginInfo: LoginInfo): Promise<any> {
  return AuAxios.request({
    ...USER_MOBILE_LOGIN,
    data: loginInfo,
  });
}

export function userLogout(): Promise<any> {
  return AuAxios.request({
    ...USER_LOGOUT,
  });
}

export function getUserInfo(): Promise<any> {
  return AuAxios.request({
    ...USER_INFO,
  });
}

export function getUserPermission(): Promise<any> {
  return AuAxios.request({
    ...USER_PERMISSION,
  });
}
