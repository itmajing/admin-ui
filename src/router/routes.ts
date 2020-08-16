import { RouteConfig } from 'vue-router'
import { MainLayout, UserLayout } from '@/layouts'

const userRoutes: RouteConfig[] = [
  {
    path: '/user',
    component: UserLayout,
    redirect: '/user/login',
    children: [
      {
        path: 'login',
        name: 'login',
        component: () => import(/* webpackChunkName: "user" */ '@/views/user/login.vue'),
      },
      {
        path: 'register',
        name: 'register',
        component: () => import(/* webpackChunkName: "user" */ '@/views/user/register.vue'),
      },
    ],
  },
]

/**
 * meta 可选参数:
 *  title {string}: 菜单标题
 *  icon {string}: 菜单图标，仅支持ant.design内置图标
 *  hidden {boolean}: 是否隐藏菜单，默认值：false
 *  permission {array}: 权限列表
 *  target {_view|_blank|_self}: 文档打开位置
 *  closable {boolean}: 是否允许关闭标签，默认值：true
 */
/**
 * 首页路由
 */
const homeRoute: RouteConfig = {
  name: 'home',
  path: '/home',
  meta: {
    title: '首页',
    closable: false,
  },
  component: () => import(/* webpackChunkName: "home" */ '@/views/home/home.vue'),
}

const appRoutes: RouteConfig[] = [
  {
    path: '/',
    name: 'main',
    redirect: '/home',
    component: MainLayout,
    meta: {
      hidden: true,
    },
    children: [homeRoute],
  },
  {
    path: '/account',
    name: 'account',
    component: MainLayout,
    meta: {
      hidden: true,
    },
    children: [
      {
        name: 'account-center',
        path: 'center',
        meta: {
          title: '个人中心',
        },
        component: () => import(/* webpackChunkName: "account" */ '@/views/account/center/index.vue'),
      },
      {
        name: 'account-setting',
        path: 'setting',
        meta: {
          title: '个人设置',
        },
        component: () => import(/* webpackChunkName: "account" */ '@/views/account/setting/index.vue'),
      },
    ],
  },
  {
    path: '/dashboard',
    name: 'dashboard',
    meta: {
      title: '仪表盘',
      icon: 'dashboard',
    },
    component: MainLayout,
    children: [
      {
        path: 'analysis',
        name: 'dashboard-analysis',
        meta: {
          title: '分析页',
        },
        component: () => import(/* webpackChunkName: "dashboard" */ '@/views/dashboard/analysis.vue'),
      },
      {
        path: 'monitor',
        name: 'dashboard-monitor',
        meta: {
          title: '监控页',
        },
        component: () => import(/* webpackChunkName: "dashboard" */ '@/views/dashboard/monitor.vue'),
      },
      {
        path: 'workplace',
        name: 'dashboard-workplace',
        meta: {
          title: '工作台',
        },
        component: () => import(/* webpackChunkName: "dashboard" */ '@/views/dashboard/workplace.vue'),
      },
    ],
  },
  {
    path: '/form',
    name: 'form',
    meta: {
      title: '表单页',
      icon: 'form',
    },
    component: MainLayout,
    children: [
      {
        path: 'basic',
        name: 'basic-form',
        meta: {
          title: '基础表单',
        },
        component: () => import(/* webpackChunkName: "form" */ '@/views/form/basic-form.vue'),
      },
      {
        path: 'step',
        name: 'step-form',
        meta: {
          title: '分步表单',
        },
        component: () => import(/* webpackChunkName: "form" */ '@/views/form/step-form.vue'),
      },
      {
        path: 'advanced',
        name: 'advanced-form',
        meta: {
          title: '高级表单',
        },
        component: () => import(/* webpackChunkName: "form" */ '@/views/form/advanced-form.vue'),
      },
    ],
  },
  {
    path: '/list',
    name: 'list',
    meta: {
      title: '列表页',
      icon: 'table',
    },
    component: MainLayout,
    children: [
      {
        path: 'table',
        name: 'table-list',
        meta: {
          title: '查询表格',
        },
        component: () => import(/* webpackChunkName: "list" */ '@/views/list/table-list.vue'),
      },
    ],
  },
]

export { userRoutes, appRoutes, homeRoute }
