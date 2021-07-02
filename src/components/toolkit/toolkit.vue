<template>
  <div ref="triggerRef" class="au-toolkit" @mousedown="handleTriggerMouseDown($event)">
    <slot></slot>
  </div>
</template>

<script lang="ts">
import * as lodash from 'lodash';
import { defineComponent, getCurrentInstance, onMounted, ref, toRef } from 'vue';

interface Point {
  x: number;
  y: number;
}

export default defineComponent({
  props: {
    getContainer: {
      type: Function,
    },
    initPosition: {
      type: String,
      validator(value: any): boolean {
        return (
          [
            'top',
            'left',
            'right',
            'bottom',
            'topLeft',
            'topRight',
            'bottomLeft',
            'bottomRight',
            'leftTop',
            'leftBottom',
            'rightTop',
            'rightBottom',
          ].indexOf(value) !== -1
        );
      },
      default: () => {
        return 'right';
      },
    },
    direction: {
      type: String,
      default: () => {
        return 'both';
      },
    },
  },
  setup(props: any) {
    const triggerRef = ref<HTMLElement>();
    const mouseCounter = ref(0);
    let mousePosition = ref<Point>({
      x: 0,
      y: 0,
    });
    const getContainer = props.getContainer;
    const directionProp = toRef<any, string>(props, 'direction');
    const initPositionProp = toRef<any, string>(props, 'initPosition');

    const getTrigger = () => {
      return triggerRef.value;
    };

    const getTriggerContainer = () => {
      if (getContainer && getContainer()) {
        return getContainer();
      }

      return triggerRef.value?.parentElement;
    };

    const handTriggerMouseMove = lodash.throttle((event: MouseEvent) => {
      mouseCounter.value++;

      const trigger = getTrigger();
      const container = getTriggerContainer();
      const direction = directionProp.value;

      if (trigger) {
        if (direction === 'vertical' || direction === 'both') {
          const top = trigger.style.top ? parseInt(trigger.style.top) : 0;
          const diffY = event.pageY - mousePosition.value.y;
          // move to bottom
          if (diffY > 0) {
            if (top + diffY <= container.clientHeight - trigger.clientHeight) {
              trigger.style.top = `${top + diffY}px`;
            } else {
              trigger.style.top = `${container.clientHeight - trigger.clientHeight}px`;
            }
          }
          // move to top
          else if (diffY < 0) {
            if (top + diffY > 0) {
              trigger.style.top = `${top + diffY}px`;
            } else {
              trigger.style.top = '0px';
            }
          }
        }

        if (direction === 'horizontal' || direction === 'both') {
          const left = trigger.style.left ? parseInt(trigger.style.left) : 0;
          const diffX = event.pageX - mousePosition.value.x;
          // move to right
          if (diffX > 0) {
            if (left + diffX <= container.clientWidth - trigger.clientWidth) {
              trigger.style.left = `${left + diffX}px`;
            } else {
              trigger.style.left = `${container.clientWidth - trigger.clientWidth}px`;
            }
          }
          // move to left
          else if (diffX < 0) {
            if (left + diffX > 0) {
              trigger.style.left = `${left + diffX}px`;
            } else {
              trigger.style.left = '0px';
            }
          }
        }
      }

      mousePosition.value = {
        x: event.pageX,
        y: event.pageY,
      };
    }, 20);

    const handleTriggerMouseUp = () => {
      const trigger = getTrigger();
      if (trigger) {
        trigger.style.cursor = 'pointer';

        const container = getTriggerContainer();
        container.style.userSelect = 'text';

        window.removeEventListener('mousemove', handTriggerMouseMove);
        window.removeEventListener('mouseup', handleTriggerMouseUp);

        if (mouseCounter.value <= 2) {
          getCurrentInstance()?.emit('onclick');
        }
      }
    };

    const handleTriggerMouseDown = (event: MouseEvent) => {
      mouseCounter.value = 0;
      mousePosition.value = {
        x: event.pageX,
        y: event.pageY,
      };

      const trigger = getTrigger();
      if (trigger) {
        trigger.style.cursor = 'move';

        const container = getTriggerContainer();
        container.style.userSelect = 'none';

        window.addEventListener('mousemove', handTriggerMouseMove);
        window.addEventListener('mouseup', handleTriggerMouseUp);
      }
    };

    onMounted(() => {
      const container = getTriggerContainer();
      const containerPosition = window.getComputedStyle(container, null).position;
      if (containerPosition === 'static') {
        container.style.position = 'relative';
      }

      const trigger = getTrigger();
      if (trigger) {
        const triggerStyle: CSSStyleDeclaration = trigger.style;
        switch (initPositionProp.value) {
          case 'top':
            triggerStyle.top = '0px';
            triggerStyle.left = `${(container.clientWidth - trigger.clientWidth) / 2}px`;
            break;
          case 'left':
            triggerStyle.top = `${(container.clientHeight - trigger.clientHeight) / 2}px`;
            triggerStyle.left = '0px';
            break;
          case 'right':
            triggerStyle.top = `${(container.clientHeight - trigger.clientHeight) / 2}px`;
            triggerStyle.left = `${container.clientWidth - trigger.clientHeight}px`;
            break;
          case 'bottom':
            triggerStyle.top = `${container.clientHeight - trigger.clientHeight}px`;
            triggerStyle.left = `${(container.clientWidth - trigger.clientWidth) / 2}px`;
            break;
          case 'topLeft':
          case 'leftTop':
            triggerStyle.top = '0px';
            triggerStyle.left = '0px';
            break;
          case 'topRight':
          case 'rightTop':
            triggerStyle.top = '0px';
            triggerStyle.left = `${container.clientWidth - trigger.clientHeight}px`;
            break;
          case 'bottomLeft':
          case 'leftBottom':
            triggerStyle.top = `${container.clientHeight - trigger.clientHeight}px`;
            triggerStyle.left = '0px';
            break;
          case 'bottomRight':
          case 'rightBottom':
            triggerStyle.top = `${container.clientHeight - trigger.clientHeight}px`;
            triggerStyle.left = `${container.clientWidth - trigger.clientWidth}px`;
            break;
          default:
            break;
        }
      }
    });

    return {
      triggerRef,
      handleTriggerMouseDown,
    };
  },
});
</script>

<style scoped lang="less">
@import '../../style/index';
.au-toolkit {
  position: absolute;
  cursor: pointer;
  z-index: 999;
}
</style>
