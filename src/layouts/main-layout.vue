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
          <menu-fold-outlined :style="{ fontSize: '18px' }" v-if="!collapsed" />
          <menu-unfold-outlined :style="{ fontSize: '18px' }" v-else />
        </div>
        <div class="au-main-layout-header-placeholder"></div>
        <div class="au-main-layout-header-trigger">
          <fullscreen-outlined :style="{ fontSize: '18px' }" />
        </div>
        <div class="au-main-layout-header-trigger">
          <bell-outlined :style="{ fontSize: '18px' }" />
        </div>
        <a-dropdown class="au-main-layout-header-trigger au-main-layout-header-user">
          <div>
            <a-avatar size="small">A</a-avatar>
            <span>Admin</span>
          </div>
          <template #overlay>
            <a-menu @click="handleDropdownClick">
              <a-menu-item key="user">
                <user-outlined />
                <span>个人中心</span>
              </a-menu-item>
              <a-menu-item key="setting">
                <setting-outlined />
                <span>个人设置</span>
              </a-menu-item>
              <a-menu-divider />
              <a-menu-item key="exit">
                <export-outlined />
                <span>退出登录</span>
              </a-menu-item>
            </a-menu>
          </template>
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
              <down-outlined :style="{ fontSize: '12px' }" />
            </div>
            <template #overlay>
              <a-menu @click="handleTabMenuClick">
                <a-menu-item key="close-other">
                  <close-outlined />
                  <span>关闭其他</span>
                </a-menu-item>
                <a-menu-item key="close-all">
                  <close-circle-outlined />
                  <span>关闭所有</span>
                </a-menu-item>
                <a-menu-item key="reload-page">
                  <reload-outlined />
                  <span>刷新页面</span>
                </a-menu-item>
              </a-menu>
            </template>
          </a-dropdown>
        </div>
      </div>
      <div class="au-main-layout-content" ref="contentRef">
        <div class="au-main-layout-content-body" ref="bodyRef">
          <div class="au-main-layout-content-body-wrapper" ref="wrapperRef">
            <router-view v-if="routerView"></router-view>
          </div>
        </div>
        <div class="au-main-layout-content-footer" ref="footerRef" v-if="showFooter">
          Copyright © 2020 C2olShare
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import SideMenu from '@/components/menu/side-menu.vue';
import * as lodash from 'lodash';
import {
  computed,
  defineComponent,
  nextTick,
  onMounted,
  onUnmounted,
  provide,
  ref,
  watch,
} from 'vue';
import { useStore } from 'vuex';
import { useRoute, useRouter } from 'vue-router';
import { findMenuByName } from '@/router/utils';
import { useLogger } from '@/libs/logger';
import { MultiOptions, MultiTab } from '@/store/modules/application';
import { message } from 'ant-design-vue';
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  FullscreenOutlined,
  BellOutlined,
  UserOutlined,
  SettingOutlined,
  ExportOutlined,
  CloseOutlined,
  CloseCircleOutlined,
  ReloadOutlined,
  DownOutlined,
} from '@ant-design/icons-vue';

const useInitMultiTabs = () => {
  const store = useStore();
  const router = useRouter();
  const route = useRoute();
  const logger = useLogger();
  const cachedTitle = ref('');
  const routerView = ref(true);

  const addMultiTab = (options: MultiOptions) => store.dispatch('addMultiTab', options);
  const removeMultiTab = (digest: string) => store.dispatch('removeMultiTab', digest);
  const removeAllMultiTab = () => store.dispatch('removeAllMultiTab');
  const removeOtherMultiTab = () => store.dispatch('removeOtherMultiTab');
  const activateMultiTab = (digest: string) => store.dispatch('activateMultiTab', digest);

  const handleOpenMultiTab = (multiOptions: MultiOptions) => {
    addMultiTab(multiOptions);
  };

  const handleCloseMultiTab = (digest: string) => {
    removeMultiTab(digest);
  };

  const handleTabChange = (digest: string) => {
    logger.info(`click tab, digest: ${digest}`);
    activateMultiTab(digest);
  };

  const handleTabEdit = (digest: string, action: string) => {
    if (action === 'remove') {
      logger.info(`remove tab, digest: ${digest}`);
      removeMultiTab(digest);
    }
  };

  const handleRefreshView = () => {
    routerView.value = false;
    nextTick(() => {
      routerView.value = true;
    });
  };

  const handleTabMenuClick = ({ key = '' }) => {
    if (key === 'close-all') {
      removeAllMultiTab();
    } else if (key === 'close-other') {
      removeOtherMultiTab();
    } else if (key === 'reload-page') {
      handleRefreshView();
    }
  };

  provide('handleOpenMultiTab', handleOpenMultiTab);
  provide('handleCloseMultiTab', handleCloseMultiTab);

  watch(
    () => store.getters.activeMultiTab,
    (multiTab: MultiTab) => {
      if (!cachedTitle.value) {
        cachedTitle.value = document.title;
      }

      // 更新标题
      if (multiTab.title) {
        document.title = `${multiTab.title} - ${cachedTitle.value} `;
      } else {
        document.title = cachedTitle.value;
      }

      // 跳转路由
      if (multiTab.name) {
        logger.info(`current route: ${String(route.name)}, target route: ${multiTab.name}`);

        if (route.name !== multiTab.name) {
          router.replace({
            name: multiTab.name,
            params: multiTab.params,
            query: multiTab.query,
          });
        }
      }
    },
  );

  onMounted(() => {
    store.dispatch('initMultiTabs', router.currentRoute.value);
  });

  onUnmounted(() => {
    document.title = cachedTitle.value;
  });

  return {
    routerView,
    accessedMenus: computed(() => store.getters.accessedMenus),
    openedMultiTabs: computed(() => store.getters.openedMultiTabs),
    activeMultiTab: computed(() => store.getters.activeMultiTab),
    handleOpenMultiTab,
    handleCloseMultiTab,
    handleTabChange,
    handleTabEdit,
    handleTabMenuClick,
  };
};

const useResizeWindows = () => {
  const store = useStore();

  const contentRef = ref<HTMLElement>();
  const wrapperRef = ref<HTMLElement>();
  const footerRef = ref<HTMLElement>();

  const calcMainLayoutContainerHeight = () => {
    const contentHeight = contentRef.value?.clientHeight || 0;
    const footerHeight = footerRef.value?.clientHeight || 0;

    const wrapperEle = wrapperRef.value;
    if (wrapperEle) {
      const wrapperPaddingTop = parseFloat(window.getComputedStyle(wrapperEle, null).paddingTop);
      const wrapperPaddingBottom = parseFloat(
        window.getComputedStyle(wrapperEle, null).paddingBottom,
      );
      const wrapperPadding = wrapperPaddingTop + wrapperPaddingBottom;

      // minus 1 px to avoid accuracy problems
      return contentHeight - footerHeight - wrapperPadding - 1;
    }
  };

  const windowResizeHandler = lodash.debounce(() => {
    const containerHeight = calcMainLayoutContainerHeight();
    if (containerHeight) {
      store.dispatch('updateContainerHeight', containerHeight);
    }
  }, 150);

  onMounted(() => {
    // init by window resize
    windowResizeHandler();
    window.addEventListener('resize', windowResizeHandler);
  });

  onUnmounted(() => {
    window.removeEventListener('resize', windowResizeHandler);
  });

  return {
    contentRef,
    wrapperRef,
    footerRef,
  };
};

export default defineComponent({
  name: 'MainLayout',
  components: {
    SideMenu,
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    FullscreenOutlined,
    BellOutlined,
    UserOutlined,
    SettingOutlined,
    ExportOutlined,
    CloseOutlined,
    CloseCircleOutlined,
    ReloadOutlined,
    DownOutlined,
  },
  setup() {
    const { contentRef, wrapperRef, footerRef } = useResizeWindows();
    const {
      routerView,
      accessedMenus,
      openedMultiTabs,
      activeMultiTab,
      handleOpenMultiTab,
      handleTabChange,
      handleTabEdit,
      handleTabMenuClick,
    } = useInitMultiTabs();
    console.log('=======accessed menus=====', accessedMenus);

    const store = useStore();
    const logger = useLogger();
    const collapsed = ref(false);
    const showFooter = computed(() => {
      const route = useRoute();
      const { footer = true } = route.meta || {};
      return footer;
    });

    /**
     * 选择菜单
     */
    const handleMenuSelect = (param: any) => {
      logger.info(`select menu, key: ${param.key}, path: ${param.keyPath}`);
      const accessedMenu = findMenuByName(accessedMenus.value, param.key);
      const multiOptions: MultiOptions = {
        name: accessedMenu.name,
        title: accessedMenu.title,
      };
      handleOpenMultiTab(multiOptions);
    };

    /**
     * 侧边栏收起/展开
     */
    const handleMenuFold = () => {
      collapsed.value = !collapsed.value;
    };

    const handleUserLogout = () => {
      store
        .dispatch('userLogout')
        .then(() => {
          message.success('退出成功');

          setTimeout(() => {
            location.reload();
          }, 600);
        })
        .catch(() => {
          message.error('退出失败');
        });
    };

    /**
     * 下拉菜单
     */
    const handleDropdownClick = ({ key = '' }) => {
      if (key === 'user') {
        const name = 'account-center';
        handleOpenMultiTab({ name: name });
      } else if (key === 'setting') {
        const name = 'account-setting';
        handleOpenMultiTab({ name: name });
      } else if (key === 'exit') {
        handleUserLogout();
      }
    };

    onMounted(() => {
      logger.info(window.navigator.userAgent);
    });

    return {
      contentRef,
      wrapperRef,
      footerRef,
      collapsed,
      routerView,
      showFooter,
      accessedMenus,
      openedMultiTabs,
      activeMultiTab,
      handleTabEdit,
      handleTabChange,
      handleTabMenuClick,
      handleMenuSelect,
      handleMenuFold,
      handleDropdownClick,
    };
  },
});
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

      & ::v-deep(.ant-menu-inline),
      & ::v-deep(.ant-menu-vertical) {
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

      ::v-deep(.ant-tabs) {
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
