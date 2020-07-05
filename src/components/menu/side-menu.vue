<template>
  <div>
    <a-menu
      mode="inline"
      theme="light"
      :inlineCollapsed="collapsed"
      :openKeys.sync="openKeys"
      :selectedKeys.sync="selectedKeys"
      @click="handleMenuClick"
      @select="handleMenuSelect"
    >
      <template v-for="menu in menuList">
        <a-menu-item :key="menu.name" v-if="!menu.children || menu.children.length === 0">
          <a-icon :type="menu.icon" />
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
import { Menu } from '@/libs/utils/types/utils'

/**
 * 子菜单
 */
const SideSubMenu = {
  template: `
    <a-sub-menu :key="menu.name" v-bind="$props" v-on="$listeners" v-else>
      <template slot="title">
        <a-icon :type="menu.icon" />
        <span>{{ menu.title }}</span>
      </template>
      <template v-for="child in menu.children">
        <a-menu-item :key="child.name" v-if="!child.children || child.children.length === 0">
          <a-icon :type="child.icon" />
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
  @Prop(Array) readonly menuList!: Menu[]

  openKeys: string[] = []
  selectedKeys: string[] = []

  @Watch('selectedKey')
  onSelectedKeyChange(key: string) {
    this.selectedKeys = key ? [key] : []
    const menus = this.$utils.findParentMenuByName(this.menuList, key)
    this.openKeys = menus.map(menu => menu.name)
  }

  handleMenuClick(payload: any) {
    this.$emit('click', payload)
  }

  handleMenuSelect(payload: any) {
    this.$emit('select', payload)
  }
}
</script>
