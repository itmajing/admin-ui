import { HashRouterTab, RouterTab, Menu, UtilsObject } from './types/utils';
import { RouteConfig } from 'vue-router';
import sha256 from 'js-sha256';
import routes from '@/router/routes';

class AuUtils implements UtilsObject {
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
   * @returns {*} 值
   */
  getSessionStorageItem(key: string) {
    const json = sessionStorage.getItem(key);
    if (json) {
      return JSON.parse(json);
    } else {
      return undefined;
    }
  }

  /**
   * 生成菜单列表
   */
  generateMenuList(routes: RouteConfig[], parent?: Menu): Menu[] {
    const menuList: Menu[] = [];
    for (const route of routes) {
      const meta = route.meta;
      // 判断是否隐藏
      if (!meta || (meta && !meta.hide)) {
        if (!route.name) {
          throw new Error('route name must not be null');
        }

        const menu: Menu = {
          name: route.name,
          title: (meta && meta.title) || route.name,
          icon: (meta && meta.icon) || 'smile',
          children: []
        };

        if (parent) {
          menu.parent = parent;
        }

        // 遍历子菜单
        const children = route.children;
        if (children && children.length > 0) {
          const submenu = this.generateMenuList(children, menu);
          if (submenu.length > 0) {
            menu.children = submenu;
          }
        }

        menuList.push(menu);
      }
    }
    return menuList;
  }

  /**
   * 生成路由标签
   */
  generateRouterTab(name: string): RouterTab | null {
    const router = this.getRouter(routes, name);
    if (router.children) {
      return null;
    }

    const tabName = router.name || '';
    const tabTitle = (router.meta && router.meta.title) || tabName;

    return {
      name: tabName,
      title: tabTitle,
      closable: !(router.meta && router.meta.closable === false),
      query: {},
      params: {}
    };
  }

  generateDefaultRouterTab() {
    const defaultTab: RouterTab = {
      name: 'home',
      title: '首页',
      closable: false,
      query: {},
      params: {}
    };

    return this.generateHashRouterTab(defaultTab);
  }

  /**
   * 生成摘要标签
   */
  generateHashRouterTab(tab: RouterTab) {
    if (tab) {
      const menuTab: HashRouterTab = {
        name: tab.name || '',
        title: tab.title || '',
        closable: tab.closable,
        query: tab.query || {},
        params: tab.params || {}
      };

      // 路由参数类型转换
      for (const key of Object.keys(menuTab.params as object)) {
        menuTab.params[key] = `${menuTab.params[key]}`;
      }
      for (const key of Object.keys(menuTab.query as object)) {
        menuTab.query[key] = `${menuTab.query[key]}`;
      }

      menuTab.hash = sha256.sha256(JSON.stringify(menuTab));
      return menuTab;
    } else {
      throw new Error(`Illegal menu tab: ${JSON.stringify(tab)} `);
    }
  }

  /**
   * 查找菜单
   */
  findMenuByName(menuList: Menu[], name: string) {
    let result!: Menu;
    for (const menu of menuList) {
      if (menu.name === name) {
        result = menu;
        break;
      }

      if (menu.children.length > 0) {
        result = this.findMenuByName(menu.children, name);
        if (result) {
          break;
        }
      }
    }

    return result;
  }

  /**
   * 查找顶级菜单
   */
  findTopMenuByName(menuList: Menu[], name: string) {
    let result!: Menu;
    let menu = this.findMenuByName(menuList, name);
    if (menu) {
      while (menu.parent) {
        menu = menu.parent;
      }
      result = menu;
    }
    return result;
  }

  /**
   * 根据路由名称获取路由信息
   * @param routes 路由列表
   * @param name 路由名称
   * @returns {*} 路由信息
   */
  getRouter(routes: RouteConfig[], name: string) {
    let result!: RouteConfig;
    for (const router of routes) {
      if (name === router.name) {
        result = router;
      } else {
        if (router.children && router.children.length > 0) {
          result = this.getRouter(router.children, name);
        }
      }
      if (result) {
        break;
      }
    }
    return result;
  }
}

export default new AuUtils();
