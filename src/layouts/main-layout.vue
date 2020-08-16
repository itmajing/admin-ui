<template>
  <div class="au-main-layout">
    <div class="au-main-layout-side" :class="{ 'au-main-layout-side-collapsed': collapsed }">
      <div class="au-main-layout-logo">
        <img src="../assets/logo.png" alt="logo" />
        <transition name="fade">
          <h1 v-if="!collapsed">Admin UI</h1>
        </transition>
      </div>
      <div class="au-main-layout-menu">
        <side-menu
          :collapsed="collapsed"
          :menu-list="accessedMenus"
          :accordion="true"
          :selectedKey="activeMultiTab && activeMultiTab.name"
          @select="handleMenuSelect"
        ></side-menu>
      </div>
    </div>
    <div class="au-main-layout-inside" :class="{ 'au-main-layout-inside-collapsed': collapsed }">
      <div class="au-main-layout-header">
        <div class="au-main-layout-header-trigger" @click.stop="handleMenuFold">
          <a-icon type="menu-fold" :style="{ fontSize: '18px' }" v-if="!collapsed" />
          <a-icon type="menu-unfold" :style="{ fontSize: '18px' }" v-else />
        </div>
        <div class="au-main-layout-header-placeholder"></div>
        <div class="au-main-layout-header-trigger">
          <a-icon type="fullscreen" :style="{ fontSize: '18px' }" />
        </div>
        <div class="au-main-layout-header-trigger">
          <a-icon type="bell" :style="{ fontSize: '18px' }" />
        </div>
        <a-dropdown class="au-main-layout-header-trigger au-main-layout-header-user">
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
      <div class="au-main-layout-tabs">
        <a-tabs
          type="editable-card"
          size="small"
          :hideAdd="true"
          :activeKey="activeMultiTab && activeMultiTab.digest"
          @edit="handleTabEdit"
          @change="handleTabChange"
        >
          <a-tab-pane
            v-for="multiTab in openedMultiTabs"
            :tab="multiTab.title"
            :key="multiTab.digest"
            :closable="multiTab.closable"
          ></a-tab-pane>
        </a-tabs>
        <div class="au-main-layout-tabs-menu">
          <a-dropdown>
            <div class="au-main-layout-tabs-menu-trigger">
              <a-icon type="down" :style="{ fontSize: '12px' }" />
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
      <div class="au-main-layout-content">
        <div class="au-main-layout-content-body">
          <div class="au-main-layout-content-body-wrapper">
            <router-view v-if="routerView"></router-view>
          </div>
        </div>
        <div class="au-main-layout-content-footer">
          Copyright © 2020 C2olShare
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Provide, Vue, Watch } from 'vue-property-decorator'
import SideMenu from '@/components/menu/side-menu.vue'
import { Action, Getter } from 'vuex-class'
import { findMenuByName, Menu } from '@/router/utils'
import { MultiOptions, MultiTab } from '@/store/modules/application'

@Component({
  name: 'MainLayout',
  components: {
    SideMenu,
  },
})
export default class MainLayout extends Vue {
  cachedTitle = ''
  collapsed = false
  routerView = true

  @Getter('accessedMenus') accessedMenus!: Menu[]
  @Getter('openedMultiTabs') openedMultiTabs!: MultiTab[]
  @Getter('activeMultiTab') activeMultiTab!: MultiTab
  @Action('initMultiTabs') initMultiTabs!: Function
  @Action('addMultiTab') addMultiTab!: Function
  @Action('removeMultiTab') removeMultiTab!: Function
  @Action('removeAllMultiTab') removeAllMultiTab!: Function
  @Action('removeOtherMultiTab') removeOtherMultiTab!: Function
  @Action('activateMultiTab') activateMultiTab!: Function
  @Action('userLogout') userLogout!: () => Promise<any>

  @Provide('handleOpenMultiTab') handleOpenMultiTabFunction = this.handleOpenMultiTab
  @Provide('handleCloseMultiTab') handleCloseMultiTabFunction = this.handleCloseMultiTab

  @Watch('activeMultiTab')
  onActiveTabChange(multiTab: MultiTab) {
    // 缓存标题
    if (!this.cachedTitle) {
      this.cachedTitle = document.title
    }

    // 更新标题
    if (multiTab.title) {
      document.title = `${multiTab.title} - ${this.cachedTitle} `
    } else {
      document.title = this.cachedTitle
    }

    // 跳转路由
    if (multiTab.name) {
      this.$logger.info(`current route: ${this.$route.name}, target route: ${multiTab.name}`)

      if (this.$route.name !== multiTab.name) {
        this.$router.replace({
          name: multiTab.name,
          params: multiTab.params,
          query: multiTab.query,
        })
      }
    }
  }

  /**
   * 选择菜单
   */
  handleMenuSelect(param: any) {
    this.$logger.info(`select menu, key: ${param.key}, path: ${param.keyPath}`)
    const accessedMenu = findMenuByName(this.accessedMenus, param.key)
    const multiOptions: MultiOptions = {
      name: accessedMenu.name,
      title: accessedMenu.title,
    }
    this.handleOpenMultiTab(multiOptions)
  }

  /**
   * 侧边栏收起/展开
   */
  handleMenuFold() {
    this.collapsed = !this.collapsed
  }

  /**
   * 点击标签
   */
  handleTabChange(digest: string) {
    this.$logger.info(`click tab, digest: ${digest}`)
    this.activateMultiTab(digest)
  }

  /**
   * 编辑标签
   */
  handleTabEdit(digest: string, action: string) {
    if (action === 'remove') {
      this.$logger.info(`remove tab, digest: ${digest}`)
      this.removeMultiTab(digest)
    }
  }

  handleRefreshView() {
    this.routerView = false
    this.$nextTick(() => {
      this.routerView = true
    })
  }

  handleTabMenuClick({ key = '' }) {
    if (key === 'close-all') {
      this.removeAllMultiTab()
    } else if (key === 'close-other') {
      this.removeOtherMultiTab()
    } else if (key === 'reload-page') {
      this.handleRefreshView()
    }
  }

  /**
   * 下拉菜单
   */
  handleDropdownClick({ key = '' }) {
    if (key === 'user') {
      const name = 'account-center'
      this.handleOpenMultiTab({ name: name })
    } else if (key === 'setting') {
      const name = 'account-setting'
      this.handleOpenMultiTab({ name: name })
    } else if (key === 'exit') {
      this.handleUserLogout()
    }
  }

  handleUserLogout() {
    this.userLogout()
      .then(() => {
        this.$message.success('退出成功')

        setTimeout(() => {
          location.reload()
        }, 600)
      })
      .catch(() => {
        this.$message.error('退出失败')
      })
  }

  handleOpenMultiTab(multiOptions: MultiOptions) {
    this.addMultiTab(multiOptions)
  }

  handleCloseMultiTab(digest: string) {
    this.removeMultiTab(digest)
  }

  mounted(): void {
    this.$logger.info(window.navigator.userAgent)
    this.initMultiTabs(this.$route)
  }

  beforeDestroy(): void {
    document.title = this.cachedTitle
  }
}
</script>

<style lang="less" scoped>
@import '../style/index';

.au-main-layout {
  width: 100%;
  height: 100%;
  background-color: rgb(243, 245, 247);
  display: flex;

  .au-main-layout-side {
    width: 256px;
    display: flex;
    flex-direction: column;
    flex-shrink: 0;
    transition: all 0.2s ease-in-out;
    background-color: rgb(255, 255, 255);
    box-shadow: 2px 0 8px 0 rgba(29, 35, 41, 0.05);
    z-index: 1;

    &-collapsed {
      width: 80px;
    }

    .au-main-layout-logo {
      height: 64px;
      padding: 0 24px;
      display: flex;
      justify-content: flex-start;
      align-items: center;
      background-color: rgb(255, 255, 255);

      img {
        height: 32px;
      }

      h1 {
        flex: 1;
        height: 32px;
        overflow: hidden;
        margin-left: 12px;
        margin-bottom: 0;
        font-weight: 600;
        font-size: 20px;
        color: #ff6a00;
      }
    }

    .au-main-layout-menu {
      flex: 1;
      overflow-y: auto;
      overflow-x: hidden;
      border-top: rgba(29, 35, 41, 0.05) solid 1px;

      & /deep/ .ant-menu-inline,
      & /deep/ .ant-menu-vertical {
        border: none;
      }

      & > ul {
        border: none;
      }
    }
  }

  .au-main-layout-inside {
    flex: 1;
    width: 0;

    .au-main-layout-header {
      height: 64px;
      display: flex;
      background-color: rgb(255, 255, 255);
      box-shadow: 0 2px 2px 0 rgba(29, 35, 41, 0.05);

      .au-main-layout-header-trigger {
        display: flex;
        justify-content: center;
        align-items: center;
        cursor: pointer;
        padding: 0 15px;
        transition: all 0.2s ease-in-out;

        &:hover {
          background-color: rgb(248, 248, 249);
        }
      }

      .au-main-layout-header-placeholder {
        flex: 1;
      }

      .au-main-layout-header-user {
        span:last-child {
          padding-left: 12px;
          color: rgba(0, 0, 0, 0.65);
        }
      }
    }

    .au-main-layout-tabs {
      margin: 5px 5px 0 10px;
      height: 40px;
      overflow: hidden;
      display: flex;

      /deep/ .ant-tabs {
        width: calc(~'100% - 38px');

        .ant-tabs-nav-container-scrolling {
          padding-left: 36px;
          padding-right: 36px;
        }

        .ant-tabs-tab-prev,
        .ant-tabs-tab-next {
          background-color: #fff;
          border: 1px solid #e8e8e8;

          &:hover:not(.ant-tabs-tab-btn-disabled) {
            color: @primary-color;
          }
        }
      }

      .au-main-layout-tabs-menu {
        width: 38px;
        background-color: #fff;
        border: 1px solid #e8e8e8;

        .au-main-layout-tabs-menu-trigger {
          cursor: pointer;
          width: 100%;
          height: 100%;
          display: flex;
          justify-content: center;
          align-items: center;
          color: rgba(0, 0, 0, 0.45);

          &.ant-dropdown-open {
            color: @primary-color;
          }
        }
      }
    }

    .au-main-layout-content {
      height: calc(~'100% - 115px');
      margin: 5px 5px 0 10px;
      overflow-x: hidden;
      overflow-y: auto;
      border-radius: 2px;
      display: flex;
      flex-flow: column;

      .au-main-layout-content-body {
        flex: auto;

        .au-main-layout-content-body-wrapper {
          padding: 10px;
          background-color: #fff;
        }
      }

      .au-main-layout-content-footer {
        padding: 20px 0;
        text-align: center;
      }
    }
  }
}
</style>
