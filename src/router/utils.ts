import { RouteConfig } from 'vue-router'
import { AuLogger } from '@/libs/logger'

export interface Menu {
  parent?: Menu
  name: string
  path: string
  icon?: string
  title: string
  children: Menu[]
}

export function optimizeRoutes(routes: RouteConfig[], parent?: RouteConfig): RouteConfig[] {
  return routes.map(route => {
    const { path, name, children } = route
    if (!name) {
      throw new Error(`The route name must not be null, path: ${path}`)
    }

    const currentRoute = {
      ...route,
      path: path
        ? path.startsWith('/')
          ? path
          : `${(parent && parent.path) || ''}/${path}`
        : `${(parent && parent.path) || ''}/${name}`,
    }

    if (children && children.length > 0) {
      currentRoute.children = optimizeRoutes(children, currentRoute)
    }

    return currentRoute
  })
}

export function findRouteByName(routes: RouteConfig[], name: string): RouteConfig {
  let result!: RouteConfig
  for (const router of routes) {
    if (name === router.name) {
      result = router
    } else {
      if (router.children && router.children.length > 0) {
        result = findRouteByName(router.children, name)
      }
    }
    if (result) {
      break
    }
  }
  return result
}

export function generateMenu(routes: RouteConfig[], parent?: Menu): Menu[] {
  const menus: Menu[] = []
  for (const route of routes) {
    const { title, icon, hidden } = route.meta || {}
    if (hidden) {
      AuLogger.debug('Ignore the route with hidden property, {}', route)
      continue
    }

    const { name, path, children } = route
    if (!name) {
      AuLogger.warn('Ignore the route with empty name, {}', route)
      continue
    }

    const menu: Menu = {
      parent: parent || undefined,
      name: name,
      path: path
        ? path.startsWith('/')
          ? path
          : `${(parent && parent.path) || ''}/${path}`
        : `${(parent && parent.path) || ''}/${name}`,
      title: title || name,
      icon: icon || undefined,
      children: [],
    }

    if (children && children.length > 0) {
      const submenu = generateMenu(children, menu)
      if (submenu.length > 0) {
        menu.children = submenu || []
      }
    }

    menus.push(menu)
  }

  return menus
}

export function findMenuByName(menus: Menu[], name: string): Menu {
  let result!: Menu
  for (const menu of menus) {
    if (menu.name === name) {
      result = menu
      break
    }

    if (menu.children.length > 0) {
      result = findMenuByName(menu.children, name)
      if (result) {
        break
      }
    }
  }

  return result
}

export function findTopMenuByName(menus: Menu[], name: string): Menu {
  let result!: Menu
  let menu = findMenuByName(menus, name)
  if (menu) {
    while (menu.parent) {
      menu = menu.parent
    }
    result = menu
  }
  return result
}

export function findParentMenuByName(menus: Menu[], name: string): Menu[] {
  const results = []
  let menu = findMenuByName(menus, name)
  if (menu) {
    while (menu.parent) {
      menu = menu.parent
      results.push(menu)
    }
  }
  return results
}
