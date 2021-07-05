import { UtilsObject } from './types/utils';

class AuUtils implements UtilsObject {
  base: number;

  constructor() {
    this.base = new Date().getTime();
  }

  /**
   * 保存SessionStorageItem
   * @param key 键
   * @param data 值
   */
  setSessionStorageItem(key: string, data: any) {
    sessionStorage.setItem(key, JSON.stringify(data));
  }

  /**
   * 获取SessionStorageItem
   * @param key 键
   * @param data 默认值
   * @returns {*} 值
   */
  getSessionStorageItem(key: string, data?: any) {
    const json = sessionStorage.getItem(key);
    if (json) {
      return JSON.parse(json);
    } else {
      return data || undefined;
    }
  }

  removeSessionStorageItem(key: string) {
    sessionStorage.removeItem(key);
  }

  /**
   * 保存LocalStorageItem
   * @param key 键
   * @param data 值
   */
  setLocalStorageItem(key: string, data: any) {
    localStorage.setItem(key, JSON.stringify(data));
  }

  /**
   * 获取LocalStorageItem
   * @param key 键
   * @param data 默认值
   * @returns {*} 值
   */
  getLocalStorageItem(key: string, data?: any) {
    const json = localStorage.getItem(key);
    if (json) {
      return JSON.parse(json);
    } else {
      return data || undefined;
    }
  }

  removeLocalStorageItem(key: string) {
    localStorage.removeItem(key);
  }

  generateUniqueId(): string {
    const uid = this.base.toString(32);
    this.base++;
    return uid;
  }
}

export default new AuUtils();
