<template>
  <div class="au-elastic-panel">
    <au-toolkit
      v-if="transformative"
      class="au-elastic-panel-trigger"
      init-position="right"
      direction="vertical"
      @click="handleModelTriggerClick"
      title="拖拽调整位置，点击切换视图"
    >
      <slot name="toolkit">
        <au-iconfont
          v-if="iTransformed"
          type="vertical"
          :style="{ fontSize: '20px' }"
        ></au-iconfont>
        <au-iconfont v-else type="horizontal" :style="{ fontSize: '20px' }"></au-iconfont>
      </slot>
    </au-toolkit>
    <div
      class="au-elastic-panel-wrapper"
      :class="`au-elastic-panel-${
        iTransformed ? 'horizontal' : 'vertical'
      } au-elastic-panel-${placement}`"
    >
      <div
        class="au-elastic-panel-search"
        :class="`au-elastic-panel-search-${placement} au-elastic-panel-search-${
          iCollapsed ? 'collapsed' : ''
        }`"
      >
        <div class="search-content">
          <slot name="form">You should provide a slot named "form"</slot>
        </div>
        <div class="search-collapsed" title="点击展开或收起" @click="handleCollapsedTriggerClick">
          <au-iconfont :type="collapsedIcon"></au-iconfont>
        </div>
      </div>
      <div class="au-elastic-panel-content">
        <slot name="data">You should provide a slot named "data"</slot>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, getCurrentInstance, onMounted, ref, toRef, watch } from 'vue';

export default defineComponent({
  props: {
    transformative: {
      type: Boolean,
      default: () => {
        return true;
      },
    },
    collapsible: {
      type: Boolean,
      default: () => {
        return true;
      },
    },
    transformed: {
      type: Boolean,
      required: true,
      default: () => {
        return false;
      },
    },
    collapsed: {
      type: Boolean,
      default: () => {
        return false;
      },
    },
    placement: {
      type: String,
      validator(value: any): boolean {
        return ['left', 'right'].indexOf(value) !== -1;
      },
      default: () => {
        return 'left';
      },
    },
  },
  setup(props) {
    const instance = getCurrentInstance();

    const iTransformed = ref(false);
    const iCollapsed = ref(false);

    const transformedProp = toRef<any, string>(props, 'transformed');
    const collapsedProp = toRef<any, string>(props, 'collapsed');
    const placementProp = toRef<any, string>(props, 'placement');

    const collapsedIcon = computed(() => {
      if (iTransformed.value) {
        if (placementProp.value === 'left') {
          return iCollapsed.value ? 'double-right' : 'double-left';
        } else {
          return iCollapsed.value ? 'double-left' : 'double-right';
        }
      } else {
        return iCollapsed.value ? 'double-bottom' : 'double-top';
      }
    });

    const handleModelTriggerClick = () => {
      iTransformed.value = !iTransformed.value;
      instance?.emit('update:transformed', iTransformed.value);
      instance?.emit('transform', iTransformed.value);
    };

    const handleCollapsedTriggerClick = () => {
      iCollapsed.value = !iCollapsed.value;
      instance?.emit('update:collapsed', iCollapsed.value);
      instance?.emit('collapse', iCollapsed.value);
    };

    watch(transformedProp, (value: boolean) => {
      iTransformed.value = value;
    });

    watch(collapsedProp, (value: boolean) => {
      iCollapsed.value = value;
    });

    onMounted(() => {
      iTransformed.value = transformedProp.value;
      iCollapsed.value = collapsedProp.value;
    });

    return {
      iTransformed,
      iCollapsed,
      collapsedIcon,
      handleModelTriggerClick,
      handleCollapsedTriggerClick,
    };
  },
});
</script>

<style lang="less" scoped>
@import '../../style/index';

.au-elastic-panel {
  width: 100%;

  .au-elastic-panel-trigger {
    height: 36px;
    width: 36px;
    border-radius: 50%;
    box-shadow: rgba(29, 35, 41, 0.05) 0 1px 4px 0;
    color: rgb(255, 255, 255);
    background-color: @primary-color;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .au-elastic-panel-wrapper {
    display: flex;

    .au-elastic-panel-search {
      flex-shrink: 0;
      position: relative;

      .search-collapsed {
        position: absolute;
        cursor: pointer;
        color: rgba(0, 0, 0, 0.35);

        &:hover {
          color: @primary-color;
        }
      }
    }

    .au-elastic-panel-content {
      flex: 1;
    }
  }

  .au-elastic-panel-vertical {
    flex-flow: column;
    flex-direction: column;

    .au-elastic-panel-search {
      //margin: 0 8px;
      min-height: 30px;
      transition: all 0.3s;
      border-bottom: 1px solid #e8e8e8;

      &-collapsed {
        height: 0;
        min-height: 0;
        transition: all 0.3s;

        .search-content {
          display: none;
        }
      }

      .search-collapsed {
        width: 100%;
        bottom: -10px;
        left: 0;
        text-align: center;
      }
    }

    .au-elastic-panel-content {
      margin-top: 10px;
    }
  }

  .au-elastic-panel-horizontal {
    flex-flow: row;

    .au-elastic-panel-search {
      width: 20%;
      min-width: 300px;
      max-width: 500px;
    }

    .au-elastic-panel-content {
      margin: 0 10px;
    }

    &.au-elastic-panel-left {
      .au-elastic-panel-search {
        padding: 0 16px 0 6px;
        transition: all 0.3s;
        border-right: 1px solid #e8e8e8;

        .search-collapsed {
          right: -8px;
          top: 0;
          height: 100%;
          display: flex;
          justify-content: center;
          align-items: center;
        }

        &-collapsed {
          width: 0;
          min-width: 0;
          padding: 0 0 0 6px;

          .search-content {
            overflow: hidden;
          }
        }
      }
    }

    &.au-elastic-panel-right {
      flex-direction: row-reverse;

      .au-elastic-panel-search {
        padding: 0 6px 0 16px;
        transition: all 0.3s;
        border-left: 1px solid #e8e8e8;

        .search-collapsed {
          left: -8px;
          top: 0;
          height: 100%;
          display: flex;
          justify-content: center;
          align-items: center;
        }

        &-collapsed {
          width: 0;
          min-width: 0;
          padding: 0 0 0 6px;

          .search-content {
            overflow: hidden;
          }
        }
      }
    }
  }
}
</style>
