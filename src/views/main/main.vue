<template>
  <div class="au-main">
    <div class="au-layout">
      <div class="au-layout-side" :class="{ 'au-layout-side-collapsed': collapsed }">
        <div class="au-layout-logo">
          <img src="../../assets/logo.png" alt="logo" />
          <transition name="fade">
            <h1 v-if="!collapsed">Admin UI</h1>
          </transition>
        </div>
        <div class="au-layout-menu">
          <side-menu
            :collapsed="collapsed"
            :menu-list="menuList"
            :selectedKey="activeTab.name"
            @select="handleMenuSelect"
          ></side-menu>
        </div>
      </div>
      <div class="au-layout-inside">
        <div class="au-layout-header">
          <div class="au-layout-header-trigger" @click.stop="handleMenuFold">
            <a-icon type="menu-fold" :style="{ fontSize: '18px' }" v-if="!collapsed" />
            <a-icon type="menu-unfold" :style="{ fontSize: '18px' }" v-else />
          </div>
          <div class="au-layout-header-placeholder"></div>
          <div class="au-layout-header-trigger">
            <a-icon type="fullscreen" :style="{ fontSize: '18px' }" />
          </div>
          <div class="au-layout-header-trigger">
            <a-icon type="bell" :style="{ fontSize: '18px' }" />
          </div>
          <a-dropdown class="au-layout-header-trigger au-layout-header-user">
            <div>
              <a-avatar size="small">A</a-avatar>
              <span>Admin</span>
            </div>
            <a-menu slot="overlay" @click="handleDropdownClick">
              <a-menu-item key="user">
                <a-icon type="user" />
                <span>个人中心</span>
              </a-menu-item>
              <a-menu-item key="setting">
                <a-icon type="setting" />
                <span>个人设置</span>
              </a-menu-item>
              <a-menu-divider />
              <a-menu-item key="exit">
                <a-icon type="export" />
                <span>退出登录</span>
              </a-menu-item>
            </a-menu>
          </a-dropdown>
        </div>
        <div class="au-layout-tabs">
          <a-tabs
            type="editable-card"
            size="small"
            :hideAdd="true"
            :activeKey="activeTab.hash"
            @edit="handleTabEdit"
            @change="handleTabChange"
          >
            <a-tab-pane
              v-for="tab in openedTabs"
              :tab="tab.title"
              :key="tab.hash"
              :closable="tab.closable"
            ></a-tab-pane>
          </a-tabs>
          <div class="au-layout-tabs-menu">
            <a-dropdown>
              <div class="au-layout-tabs-menu-trigger">
                <a-icon type="down" :style="{ fontSize: '16px' }" />
              </div>
              <a-menu slot="overlay" @click="handleTabMenuClick">
                <a-menu-item key="close-other">
                  <a-icon type="close" />
                  <span>关闭其他</span>
                </a-menu-item>
                <a-menu-item key="close-all">
                  <a-icon type="close-circle" />
                  <span>关闭所有</span>
                </a-menu-item>
                <a-menu-item key="reload-page">
                  <a-icon type="reload" />
                  <span>刷新页面</span>
                </a-menu-item>
              </a-menu>
            </a-dropdown>
          </div>
        </div>
        <div class="au-layout-content">
          <router-view v-if="routerView"></router-view>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Provide, Vue, Watch } from 'vue-property-decorator';
import SideMenu from '@/components/menu/side-menu.vue';
import { Getter, Mutation, State } from 'vuex-class';
import { HashRouterTab, Menu } from '@/libs/utils/types/utils';

@Component({
  components: {
    SideMenu
  }
})
export default class Main extends Vue {
  cachedTitle = '';
  collapsed = false;
  routerView = true;

  @State(state => state.application.openedTabs) openedTabs!: HashRouterTab[];
  @State(state => state.application.activeTab) activeTab!: HashRouterTab;
  @Mutation initOpenedTab!: Function;
  @Mutation addOpenedTab!: Function;
  @Mutation setActiveTab!: Function;
  @Mutation removeOpenedTab!: Function;
  @Mutation removeAllOpenedTab!: Function;
  @Mutation removeOtherOpenedTab!: Function;
  @Mutation removeAccessToken!: Function;
  @Getter menuList!: Menu[];

  @Provide('handleOpenTab') handleOpenTabFunction = this.handleOpenTab;
  @Provide('handleCloseTab') handleCloseTabFunction = this.handleCloseTab;

  @Watch('activeTab')
  onActiveTabChange(routerTab: HashRouterTab) {
    // 缓存标题
    if (!this.cachedTitle) {
      this.cachedTitle = document.title;
    }

    // 更新标题
    if (routerTab.title) {
      document.title = `${routerTab.title} - ${this.cachedTitle} `;
    } else {
      document.title = this.cachedTitle;
    }

    // 跳转路由
    if (routerTab.name) {
      this.$logger.info(`current route: ${this.$route.name}, target route: ${routerTab.name}`);

      if (this.$route.name !== routerTab.name) {
        this.$router.replace({
          name: routerTab.name,
          params: routerTab.params,
          query: routerTab.query
        });
      }
    }
  }

  /**
   * 选择菜单
   */
  handleMenuSelect(param: any) {
    this.$logger.info(`select menu, key: ${param.key}, path: ${param.keyPath}`);
    this.handleOpenTab(param.key);
  }

  /**
   * 侧边栏收起/展开
   */
  handleMenuFold() {
    this.collapsed = !this.collapsed;
  }

  /**
   * 点击标签
   */
  handleTabChange(hash: string) {
    this.$logger.info(`click tab, hash: ${hash}`);
    this.setActiveTab(hash);
  }

  /**
   * 编辑标签
   */
  handleTabEdit(hash: string, action: string) {
    if (action === 'remove') {
      this.$logger.info(`remove tab, hash: ${hash}`);
      this.removeOpenedTab(hash);
    }
  }

  handleRefreshView() {
    this.routerView = false;
    this.$nextTick(() => {
      this.routerView = true;
    });
  }

  handleTabMenuClick({ key = '' }) {
    if (key === 'close-all') {
      this.removeAllOpenedTab();
    } else if (key === 'close-other') {
      this.removeOtherOpenedTab();
    } else if (key === 'reload-page') {
      this.handleRefreshView();
    }
  }

  /**
   * 下拉菜单
   */
  handleDropdownClick({ key = '' }) {
    if (key === 'user') {
      const name = 'account-center';
      this.handleOpenTab(name);
    } else if (key === 'setting') {
      const name = 'account-setting';
      this.handleOpenTab(name);
    } else if (key === 'exit') {
      this.removeAccessToken();
      this.$router.replace({
        name: 'login'
      });
    }
  }

  /**
   * 打开标签页
   * @param name 路由名称
   * @param query 路由参数
   * @param params 路由参数
   */
  handleOpenTab(name: string, query?: any, params?: any) {
    const routerTab = this.$utils.generateRouterTab(name);
    if (routerTab) {
      if (query) {
        routerTab.query = query;
      }
      if (params) {
        routerTab.query = params;
      }
      this.addOpenedTab(routerTab);
    }
  }

  /**
   * 关闭当前标签页
   */
  handleCloseTab() {
    this.removeOpenedTab(this.activeTab.hash);
  }

  mounted(): void {
    this.$logger.info(window.navigator.userAgent);
    this.initOpenedTab(this.$route);
  }

  beforeDestroy(): void {
    document.title = this.cachedTitle;
  }
}
</script>

<style lang="less" scoped>
@import 'main.less';
</style>
<style lang="less">
/*重写组件样式*/
.au-layout {
  .ant-menu-inline {
    border: none;
  }
}

/*全局滚动条样式*/
::-webkit-scrollbar {
  width: 6px;
  height: 6px;
  background: rgba(0, 0, 0, 0.1);
}
::-webkit-scrollbar:hover {
  background: rgba(0, 0, 0, 0.2);
}
::-webkit-scrollbar-thumb {
  background: rgba(0, 0, 0, 0.3);
  -webkit-border-radius: 5px;
  -moz-border-radius: 5px;
  -ms-border-radius: 5px;
  -o-border-radius: 5px;
  border-radius: 5px;
}
::-webkit-scrollbar-thumb:hover {
  -webkit-box-shadow: inset 1px 1px 1px rgba(0, 0, 0, 0.25);
  /* Webkit browsers */
  -moz-box-shadow: inset 1px 1px 1px rgba(0, 0, 0, 0.25);
  /* Firefox */
  -ms-box-shadow: inset 1px 1px 1px rgba(0, 0, 0, 0.25);
  /* IE9 */
  -o-box-shadow: inset 1px 1px 1px rgba(0, 0, 0, 0.25);
  /* Opera(Old) */
  box-shadow: inset 1px 1px 1px rgba(0, 0, 0, 0.25);
  /* IE9+, News */
  background-color: rgba(0, 0, 0, 0.4);
}
</style>
