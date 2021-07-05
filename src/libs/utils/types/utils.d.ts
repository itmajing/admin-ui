import Vue from 'vue';

interface UtilsObject {
  setSessionStorageItem(key: string, data: any): void;

  getSessionStorageItem(key: string, data?: any): any;

  removeSessionStorageItem(key: string): void;

  setLocalStorageItem(key: string, data: any): void;

  getLocalStorageItem(key: string, data?: any): any;

  removeLocalStorageItem(key: string): void;

  generateUniqueId(): string;
}

declare module 'vue/types/vue' {
  interface Vue {
    $utils: UtilsObject;
  }
}
