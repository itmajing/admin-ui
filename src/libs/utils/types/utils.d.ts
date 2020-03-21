import { RouteConfig } from 'vue-router';
import { Dictionary } from 'vue-router/types/router';

interface Menu {
  parent?: Menu;
  name: string;
  icon: string;
  title: string;
  children: Menu[];
}

interface RouterTab {
  name: string;
  title: string;
  closable: boolean;
  query: Dictionary<string | (string | null)[] | null | undefined>;
  params: Dictionary<string>;
}

interface HashRouterTab extends RouterTab {
  hash?: string;
}

interface UtilsObject {
  setSessionStorageItem(key: string, data: any): void;

  getSessionStorageItem(key: string): any;

  removeSessionStorageItem(key: string): void;

  setLocalStorageItem(key: string, data: any): void;

  getLocalStorageItem(key: string): any;

  removeLocalStorageItem(key: string): void;

  generateMenuList(routes: RouteConfig[]): Menu[];

  generateRouterTab(name: string): RouterTab | null;

  generateDefaultRouterTab(): RouterTab;

  generateHashRouterTab(tab: RouterTab): HashRouterTab;

  findMenuByName(menuList: Menu[], name: string): Menu;

  findTopMenuByName(menuList: Menu[], name: string): Menu;
}

declare module 'vue/types/vue' {
  interface Vue {
    $utils: UtilsObject;
  }
}
