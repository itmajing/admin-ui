<template>
  <div>
    <a-menu
      mode="inline"
      theme="light"
      :inlineCollapsed="collapsed"
      :openKeys="openKeys"
      :selectedKeys="selectedKeys"
      @click="handleMenuClick"
      @select="handleMenuSelect"
      @openChange="handleOpenChange"
    >
      <template v-for="menu in menuList">
        <a-menu-item :key="menu.name" v-if="!menu.children || menu.children.length === 0">
          <a-icon v-if="menu.icon" :type="menu.icon" />
          <span>{{ menu.title }}</span>
        </a-menu-item>
        <side-sub-menu :key="menu.name" :menu="menu" v-else />
      </template>
    </a-menu>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator'
import { Menu as AntMenu } from 'ant-design-vue'
import { findParentMenuByName } from '@/router/utils'

/**
 * 子菜单
 */
const SideSubMenu = {
  template: `
    <a-sub-menu :key="menu.name" v-bind="$props" v-on="$listeners" v-else>
      <template slot="title">
        <a-icon v-if="menu.icon" :type="menu.icon" />
        <span>{{ menu.title }}</span>
      </template>
      <template v-for="child in menu.children">
        <a-menu-item :key="child.name" v-if="!child.children || child.children.length === 0">
          <a-icon v-if="child.icon" :type="child.icon" />
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
}

@Component({
  name: 'SideMenu',
  components: {
    SideSubMenu: SideSubMenu,
  },
})
export default class SideMenu extends Vue {
  @Prop(String) selectedKey!: string
  @Prop(Boolean) readonly collapsed!: boolean
  @Prop(Boolean) readonly accordion!: boolean
  @Prop(Array) readonly menuList!: Array<any>

  openKeys: string[] = []
  selectedKeys: string[] = []

  cacheOpenKeys: string[] = []

  @Watch('selectedKey')
  onSelectedKeyChange(key: string) {
    this.selectedKeys = key ? [key] : []
    const parentMenus = findParentMenuByName(this.menuList, key)
    if (this.collapsed) {
      this.cacheOpenKeys = parentMenus.map(menu => menu.name)
    } else {
      this.openKeys = parentMenus.map(menu => menu.name)
    }
  }

  @Watch('collapsed')
  onCollapsedChange(collapsed: string) {
    if (!collapsed) {
      this.openKeys = this.cacheOpenKeys
    } else {
      this.openKeys = []
    }
  }

  handleOpenChange(openKeys: string[]) {
    if (this.accordion) {
      const latestOpenKey = openKeys.find(key => this.openKeys.indexOf(key) === -1)
      if (latestOpenKey) {
        const parentMenus = findParentMenuByName(this.menuList, latestOpenKey)
        const parentKeys = parentMenus.map(menu => menu.name)
        this.openKeys = [...parentKeys, latestOpenKey]
        return
      }
    }

    this.openKeys = openKeys
  }

  handleMenuClick(payload: any) {
    this.$emit('click', payload)
  }

  handleMenuSelect(payload: any) {
    this.$emit('select', payload)
  }
}
</script>
