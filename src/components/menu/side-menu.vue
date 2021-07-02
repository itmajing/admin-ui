<template>
  <div class="au-side-menu">
    <a-menu
      mode="inline"
      :theme="theme"
      :inlineCollapsed="collapsed"
      :openKeys="openKeys"
      v-model:selectedKeys="selectedKeys"
      @click="handleMenuClick"
      @select="handleMenuSelect"
      @openChange="handleOpenChange"
    >
      <template v-for="menu in menuList">
        <a-menu-item :key="menu.name" v-if="!menu.children || menu.children.length === 0">
          <au-iconfont v-if="menu.icon" :type="menu.icon" />
          <span>{{ menu.title }}</span>
        </a-menu-item>
        <side-sub-menu :key="menu.name" :menu="menu" v-else />
      </template>
    </a-menu>
  </div>
</template>

<script lang="ts">
import { defineComponent, getCurrentInstance, ref, toRef, watch } from 'vue';
import { Menu as AntMenu } from 'ant-design-vue';
import { findParentMenuByName } from '@/router/utils';

/**
 * 子菜单
 */
const SideSubMenu = {
  template: `
    <a-sub-menu :key="menu.name" v-bind="$props">
      <template #title>
        <au-iconfont v-if="menu.icon" :type="menu.icon" />
        <span>{{ menu.title }}</span>
      </template>
      <template v-for="child in menu.children">
        <a-menu-item :key="child.name" v-if="!child.children || child.children.length === 0">
          <au-iconfont v-if="child.icon" :type="child.icon" />
          <span>{{ child.title }}</span>
        </a-menu-item>
        <side-sub-menu :key="child.name" :menu="child" v-else />
      </template>
    </a-sub-menu>
  `,
  name: 'SideSubMenu',
  // must add isSubMenu: true
  isSubMenu: true,
  props: {
    ...(AntMenu.SubMenu as any).props,
    // Cannot overlap with properties within Menu.SubMenu.props
    menu: {
      type: Object,
      default: () => ({}),
    },
  },
};

export default defineComponent({
  name: 'SideMenu',
  components: {
    SideSubMenu: SideSubMenu,
  },
  props: {
    theme: {
      type: String,
      default: () => {
        return 'light';
      },
    },
    selectedKey: {
      type: String,
    },
    collapsed: {
      type: Boolean,
    },
    accordion: {
      type: Boolean,
    },
    menuList: {
      type: Array,
    },
  },
  setup(props: any) {
    const instance = getCurrentInstance();
    const selectedKey = toRef(props, 'selectedKey');
    const collapsed = toRef(props, 'collapsed');
    const accordion = toRef(props, 'accordion');
    const menuList = toRef(props, 'menuList');

    let openKeys = ref<string[]>([]);
    let selectedKeys = ref<string[]>([]);

    let cacheOpenKeys = ref<string[]>([]);

    watch(selectedKey, (key: string) => {
      selectedKeys.value = key ? [key] : [];
      const parentMenus = findParentMenuByName(menuList.value, key);
      if (collapsed.value) {
        cacheOpenKeys.value = parentMenus.map((menu) => menu.name);
      } else {
        openKeys.value = parentMenus.map((menu) => menu.name);
      }
    });

    watch(collapsed, (value: string) => {
      if (!value) {
        openKeys.value = [...cacheOpenKeys.value];
      } else {
        openKeys.value = [];
      }
    });

    const handleOpenChange = (keys: string[]) => {
      if (accordion.value) {
        const latestOpenKey = keys.find((key) => openKeys.value.indexOf(key) === -1);
        if (latestOpenKey) {
          const parentMenus = findParentMenuByName(menuList.value, latestOpenKey);
          const parentKeys = parentMenus.map((menu) => menu.name);
          openKeys.value = [...parentKeys, latestOpenKey];
          return;
        }
      }

      openKeys.value = keys;
    };

    const handleMenuClick = (payload: any) => {
      instance?.emit('click', payload);
    };

    const handleMenuSelect = (payload: any) => {
      console.log('=========select', instance);
      instance?.emit('select', payload);
    };

    return {
      openKeys,
      selectedKeys,
      handleOpenChange,
      handleMenuClick,
      handleMenuSelect,
    };
  },
});
</script>
