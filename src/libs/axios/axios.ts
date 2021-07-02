import Axios, { AxiosInstance } from 'axios';
import router from '@/router';
import { AuUtils } from '@/libs/utils';
import { AuGlobal } from '@/libs/global';
import { AUTH_HEADER } from '@/constant';

const formHeader = {
  'Content-Type': 'application/x-www-form-urlencoded',
  'X-Requested-With': 'XMLHttpRequest',
};

const jsonHeader = {
  'Content-Type': 'application/json; charset=UTF-8',
  'X-Requested-With': 'XMLHttpRequest',
};

const instance: AxiosInstance = Axios.create({
  timeout: 30 * 1000,
  baseURL: AuGlobal.httpBaseUrl,
  headers: jsonHeader,
});

instance.interceptors.request.use(
  (config) => {
    // add token for all request
    const accessToken = AuUtils.getSessionStorageItem(AUTH_HEADER);
    if (accessToken) {
      config.headers[AUTH_HEADER] = accessToken;
    }

    // add timestamp for get request
    if (config.method === 'get') {
      config.params = {
        ...config.params,
        _timestamp: new Date().getTime(),
      };
    }
    return config;
  },
  (err) => {
    return Promise.reject(err);
  },
);

instance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response) {
      // 401跳转登录
      if (error.response.status === 401) {
        router.replace({
          name: 'login',
        });
      }
    }
    return Promise.reject(error);
  },
);

export { jsonHeader, formHeader };

export default instance;
