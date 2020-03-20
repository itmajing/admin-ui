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
                <span>个人信息</span>
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
            @tabClick="handleTabClick"
            @edit="handleTabEdit"
          >
            <a-tab-pane
              v-for="tab in openedTabs"
              :tab="tab.title"
              :key="tab.hash"
              :closable="tab.closable"
            ></a-tab-pane>
          </a-tabs>
        </div>
        <div class="au-layout-content">
          <router-view></router-view>
        </div>
        <div class="au-layout-footer">
          <div class="au-layout-footer-copyright">Copyright © 2020 Admin UI</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator';
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

  @State(state => state.application.openedTabs) openedTabs!: HashRouterTab[];
  @State(state => state.application.activeTab) activeTab!: HashRouterTab;
  @Mutation initOpenedTab!: Function;
  @Mutation addOpenedTab!: Function;
  @Mutation setActiveTab!: Function;
  @Mutation removeOpenedTab!: Function;
  @Mutation removeAccessToken!: Function;
  @Getter menuList!: Menu[];

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
      this.$logger.info(`target route: ${routerTab.name}, current route: ${this.$route.name}`);

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
    const routerTab = this.$utils.generateRouterTab(param.key);
    this.addOpenedTab(routerTab);
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
  handleTabClick(hash: string) {
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

  /**
   * 下拉菜单
   */
  handleDropdownClick({ key = '' }) {
    if (key === 'user') {
      console.log('个人信息');
    } else if (key === 'setting') {
      console.log('个人设置');
    } else if (key === 'exit') {
      console.log('退出登录');
      this.removeAccessToken();
      this.$router.replace({
        name: 'login'
      });
    }
  }

  mounted() {
    this.$logger.info(window.navigator.userAgent);
    this.initOpenedTab(this.$route);
  }
}
</script>

<style lang="less" scoped>
@import 'main.less';
</style>
<style lang="less">
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
