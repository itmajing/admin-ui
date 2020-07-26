<template>
  <div class="au-context-menu" :style="contextStyle">
    <a-dropdown
      :trigger="['click']"
      v-model="insideVisible"
      overlayClassName="au-context-menu-overlay"
      @visibleChange="handleVisibleChange"
    >
      <a ref="contextMenuTrigger"></a>
      <a-menu slot="overlay" @click="handleMenuClick">
        <template v-for="menu in insideMenuList">
          <a-menu-item :key="menu.key" v-if="!menu.children || menu.children.length === 0">
            <a-icon v-if="menu.icon" :type="menu.icon" />
            <span>{{ menu.title }}</span>
          </a-menu-item>
          <context-sub-menu :key="menu.key" :menu="menu" v-else />
        </template>
      </a-menu>
    </a-dropdown>
  </div>
</template>

<script lang="ts">
import { Component, Model, Prop, Vue, Watch } from 'vue-property-decorator'
import { Menu as AntMenu } from 'ant-design-vue'

/**
 * 子菜单
 */
const ContextSubMenu = {
  template: `
    <a-sub-menu :key="menu.key" v-bind="$props" v-on="$listeners" v-else>
      <template slot="title">
        <a-icon v-if="menu.icon" :type="menu.icon" />
        <span>{{ menu.title }}</span>
      </template>
      <template v-for="child in menu.children">
        <a-menu-item :key="child.key" v-if="!child.children || child.children.length === 0">
          <a-icon v-if="child.icon" :type="child.icon" />
          <span>{{ child.title }}</span>
        </a-menu-item>
        <side-sub-menu :key="child.key" :menu="child" v-else />
      </template>
    </a-sub-menu>
  `,
  name: 'ContextSubMenu',
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

interface Menu {
  key: string
  title: string
  icon: string
  children?: Array<Menu>
}

interface Position {
  x: number
  y: number
}

@Component({
  name: 'ContextMenu',
  components: {
    ContextSubMenu: ContextSubMenu,
  },
})
export default class ContextMenu extends Vue {
  $refs!: { contextMenuTrigger: HTMLFormElement }
  insideVisible = true
  insideMenuList: Array<Menu> = []
  insidePosition: Position = {
    x: 0,
    y: 0,
  }

  @Model('change', {
    type: Boolean,
    default: () => {
      return false
    },
  })
  readonly visible!: boolean

  @Prop({
    type: Array,
    default: () => {
      return []
    },
  })
  readonly menuList!: Array<any>

  @Prop({
    type: Object,
    default: () => {
      return {}
    },
  })
  readonly position!: Position

  get contextStyle() {
    return {
      left: `${this.insidePosition.x || 0}px`,
      top: `${this.insidePosition.y || 0}px`,
    }
  }

  @Watch('visible')
  onVisibleChange(visible: boolean) {
    this.insideVisible = visible
  }

  @Watch('menuList')
  onMenuListChange(menuList: []) {
    this.insideMenuList = menuList
  }

  @Watch('position')
  onPositionChange(position: Position) {
    this.insidePosition = position
  }

  setVisible(visible: boolean) {
    this.$nextTick(() => {
      this.insideVisible = visible
    })
  }

  setPosition(position: Position) {
    this.$nextTick(() => {
      this.insidePosition = position
    })
  }

  setMenuList(menuList: Array<Menu>) {
    this.$nextTick(() => {
      this.insideMenuList = menuList
    })
  }

  handleVisibleChange(visible: boolean) {
    this.$emit('change', visible)
  }

  handleMenuClick(payload: any) {
    this.insideVisible = false
    this.$emit('change', false)
    this.$emit('action', payload)
  }
}
</script>

<style lang="less" scoped>
.au-context-menu {
  position: fixed;
}
</style>
