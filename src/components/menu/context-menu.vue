<template>
  <div
    class="context-menu"
    :style="{ position: 'fixed', left: `${position.x}px`, top: `${position.y}px` }"
    style="background-color: #f5222d"
  >
    <a href="javascript:void(0)" @blur="handleMenuBlur" :ref="triggerRef"></a>
    <a-dropdown :visible="syncedVisible">
      <a @click="e => e.preventDefault()"></a>
      <a-menu slot="overlay" @click="handleClickMenuItem">
        <a-menu-item v-for="item in items" :key="item.key">
          <a-icon :type="item.icon" v-if="item.icon" />
          <span>{{ item.label }}</span>
        </a-menu-item>
      </a-menu>
    </a-dropdown>
  </div>
</template>

<script lang="ts">
import { Component, Prop, PropSync, Vue, Watch } from 'vue-property-decorator';
import UUID from 'uuidjs';

@Component
export default class ContextMenu extends Vue {
  $refs!: any;
  unique: string = UUID.generate();

  @Prop({ type: Object, required: true }) position!: any;

  @PropSync('visible', { type: Boolean, required: true }) syncedVisible!: boolean;

  @Prop({ type: Array, required: true }) items!: Array<any>;

  @Watch('visible')
  onTabVisibleChange(visible: boolean) {
    if (visible) {
      const trigger = this.$refs[this.triggerRef];
      if (trigger) {
        trigger.focus();
      }
    }
  }

  get triggerRef() {
    return `context-menu-trigger-${this.unique}`;
  }

  handleMenuBlur() {
    setTimeout(() => {
      this.syncedVisible = false;
    }, 100);
  }

  handleClickMenuItem({ key = '' }) {
    if (key) {
      this.$emit('on-click', key);
    }
  }
}
</script>
