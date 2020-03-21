import { RouteConfig } from 'vue-router';

// 登录/注册
import Login from '@/views/user/login/login.vue';
import Register from '@/views/user/register/register.vue';

// 主框架
import Main from '@/views/main/main.vue';

// 首页
import Home from '@/views/home/home.vue';

// 账号
import AccountCenter from '@/views/account/account-center.vue';
import AccountSetting from '@/views/account/account-setting.vue';

// 控制台
import Analysis from '@/views/dashboard/analysis.vue';
import Monitor from '@/views/dashboard/monitor.vue';
import Workplace from '@/views/dashboard/workplace.vue';

// 表单页
import BasicForm from '@/views/form/basic-form.vue';
import StepForm from '@/views/form/step-form.vue';
import AdvancedForm from '@/views/form/advanced-form.vue';

// 错误页
import NotFound from '@/views/exception/notfound.vue';
import Forbidden from '@/views/exception/forbidden.vue';

/**
 * meta 可选参数:
 * title: 菜单标题
 * icon: 菜单图标
 * hide: 菜单隐藏
 * closable: 关闭标签
 */
const routes: RouteConfig[] = [
  {
    path: '/',
    name: 'main',
    meta: {
      hide: true
    },
    component: Main,
    children: [
      {
        name: 'home',
        path: 'home',
        meta: {
          title: '首页',
          closable: false
        },
        component: Home
      }
    ]
  },
  {
    path: '/account',
    name: 'account',
    meta: {
      hide: true
    },
    component: Main,
    children: [
      {
        name: 'account-center',
        path: 'center',
        meta: {
          title: '个人中心'
        },
        component: AccountCenter
      },
      {
        name: 'account-setting',
        path: 'setting',
        meta: {
          title: '个人设置'
        },
        component: AccountSetting
      }
    ]
  },
  {
    path: '/dashboard',
    name: 'dashboard',
    meta: {
      title: 'Dashboard',
      icon: 'dashboard'
    },
    component: Main,
    children: [
      {
        name: 'analysis',
        path: 'analysis',
        meta: {
          title: '分析页'
        },
        component: Analysis
      },
      {
        name: 'monitor',
        path: 'monitor',
        meta: {
          title: '监控页'
        },
        component: Monitor
      },
      {
        name: 'workplace',
        path: 'workplace',
        meta: {
          title: '工作台'
        },
        component: Workplace
      }
    ]
  },
  {
    path: '/form',
    name: 'form',
    meta: {
      title: '表单页',
      icon: 'form'
    },
    component: Main,
    children: [
      {
        path: 'basic-form',
        name: 'basic-form',
        meta: {
          title: '基础表单'
        },
        component: BasicForm
      },
      {
        path: 'step-form',
        name: 'step-form',
        meta: {
          title: '分步表单'
        },
        component: StepForm
      },
      {
        path: 'advanced-form',
        name: 'advanced-form',
        meta: {
          title: '高级表单'
        },
        component: AdvancedForm
      }
    ]
  },
  {
    path: '/exception',
    name: 'exception',
    meta: {
      title: '异常页',
      icon: 'warning'
    },
    component: Main,
    children: [
      {
        path: '403',
        name: 'forbidden',
        meta: {
          title: '403'
        },
        component: Forbidden
      },
      {
        path: '404',
        name: 'notfound',
        meta: {
          title: '404'
        },
        component: NotFound
      }
    ]
  },
  {
    path: '/login',
    name: 'login',
    meta: {
      hide: true
    },
    component: Login
  },
  {
    path: '/register',
    name: 'register',
    meta: {
      hide: true
    },
    component: Register
  },
  {
    path: '*',
    name: '404',
    meta: {
      hide: true
    },
    component: NotFound
  }
];

export default routes;
