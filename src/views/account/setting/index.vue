<template>
  <div class="au-page-account-setting">
    <div class="account-setting-left">
      <a-menu mode="inline" @select="handleMenuSelect" :selectedKeys="selectedKeys">
        <a-menu-item v-for="menu in settingMenus" :key="menu.key">
          {{ menu.title }}
        </a-menu-item>
      </a-menu>
    </div>
    <div class="account-setting-right">
      <div class="account-setting-title">
        <span>{{ currentMenu.title }}</span>
      </div>
      <component :is="currentMenu.component"></component>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, markRaw, reactive } from 'vue';
import Base from './base.vue';
import Security from './security.vue';
import Binding from './binding.vue';
import Notification from './notification.vue';

export interface Menu {
  key: string;
  title: string;
  component: any;
}

export default defineComponent({
  setup() {
    const settingMenus = reactive<Menu[]>([
      {
        key: 'base',
        title: '基本设置',
        component: markRaw(Base),
      },
      {
        key: 'security',
        title: '安全设置',
        component: markRaw(Security),
      },
      {
        key: 'binding',
        title: '账户绑定',
        component: markRaw(Binding),
      },
      {
        key: 'notification',
        title: '消息通知',
        component: markRaw(Notification),
      },
    ]);

    let currentMenu = reactive<Menu>(settingMenus[0]);
    let selectedKeys = reactive<string[]>([currentMenu.key]);

    const handleMenuSelect = ({ key = '' }) => {
      selectedKeys = [key];

      const menu = settingMenus.find((item) => item.key === key);
      if (menu) {
        currentMenu = menu;
      }
    };

    return {
      settingMenus,
      currentMenu,
      selectedKeys,
      handleMenuSelect,
    };
  },
});
</script>

<style lang="less" scoped>
.au-page-account-setting {
  width: 100%;
  display: flex;
  overflow: auto;

  .account-setting-left {
    border-right: 1px solid #e8e8e8;
    width: 224px;

    ::v-deep(.ant-menu) {
      border-right: none;
    }
  }

  .account-setting-right {
    flex: 1;
    padding: 5px 20px;

    .account-setting-title {
      height: 36px;
      line-height: 36px;
      color: rgba(0, 0, 0, 0.85);
      font-size: 16px;
      font-weight: 500;
      margin-bottom: 12px;
    }
  }
}
</style>
