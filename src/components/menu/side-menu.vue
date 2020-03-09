<template>
  <div>
    <a-menu
      mode="inline"
      theme="light"
      :inlineCollapsed="collapsed"
      :openKeys.sync="openKeys"
      :selectedKeys.sync="selectedKeys"
      @openChange="handleOpenedChange"
      @select="handleMenuSelect"
    >
      <template v-for="menu in menuList">
        <a-menu-item :key="menu.name" v-if="menu.children.length === 0">
          <a-icon :type="menu.icon" />
          <span>{{ menu.title }}</span>
        </a-menu-item>
        <a-sub-menu :key="menu.name" v-else>
          <template slot="title">
            <a-icon :type="menu.icon" />
            <span>{{ menu.title }}</span>
          </template>
          <template v-for="child1 in menu.children">
            <a-menu-item :key="child1.name" v-if="child1.children.length === 0">
              <a-icon :type="child1.icon" />
              <span>{{ child1.title }}</span>
            </a-menu-item>
            <a-sub-menu :key="child1.name" v-else>
              <template slot="title">
                <a-icon :type="menu.icon" />
                <span>{{ menu.title }}</span>
              </template>
              <template v-for="child2 in child1.children">
                <a-menu-item :key="child2.name">
                  <a-icon :type="child2.icon" />
                  <span>{{ child2.title }}</span>
                </a-menu-item>
              </template>
            </a-sub-menu>
          </template>
        </a-sub-menu>
      </template>
    </a-menu>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import { Menu } from '@/libs/utils/types/utils';

@Component({
  name: 'side-menu'
})
export default class SideMenu extends Vue {
  @Prop(String) selectedKey!: string;
  @Prop(Boolean) readonly collapsed!: boolean;
  @Prop(Array) readonly menuList!: Menu[];

  openKeys: string[] = [];
  selectedKeys: string[] = [];

  @Watch('selectedKey')
  onSelectedKeyChange(key: string) {
    const menu = this.$utils.findTopMenuByName(this.menuList, key);
    this.openKeys = menu ? [menu.name] : [];
    this.selectedKeys = key ? [key] : [];
  }

  handleOpenedChange(openKeys: string[]) {
    if (openKeys.length > 0) {
      this.$nextTick(() => {
        this.openKeys = [openKeys[openKeys.length - 1]];
      });
    }
  }

  handleMenuSelect(obj: any) {
    this.$emit('select', obj);
  }
}
</script>
