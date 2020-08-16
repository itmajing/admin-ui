<template>
  <div ref="trigger" class="au-toolkit" @mousedown="handleTriggerMouseDown($event)">
    <slot></slot>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import * as lodash from 'lodash'

@Component({})
export default class Toolkit extends Vue {
  $refs!: { trigger: HTMLFormElement }
  mouseCounter = 0
  mousePosition = {
    x: 0,
    y: 0,
  }
  mouseMoveHandler!: (event: MouseEvent) => void

  @Prop({
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
      )
    },
    default: () => {
      return 'right'
    },
  })
  readonly initPosition!: string

  @Prop({
    type: String,
    default: () => {
      return 'both'
    },
  })
  readonly direction!: string

  @Prop({
    type: Function,
  })
  readonly getContainer!: Function

  getTrigger() {
    return this.$refs.trigger
  }

  getTriggerContainer() {
    if (this.getContainer && this.getContainer()) {
      return this.getContainer()
    }

    return this.$refs.trigger.parentElement
  }

  handleTriggerMouseDown(event: MouseEvent) {
    this.mouseCounter = 0
    this.mousePosition = {
      x: event.pageX,
      y: event.pageY,
    }

    const trigger = this.getTrigger()
    trigger.style.cursor = 'move'

    const container = this.getTriggerContainer()
    container.style.userSelect = 'none'

    this.mouseMoveHandler = lodash.throttle(this.handleTriggerMouseMove, 20)
    window.addEventListener('mousemove', this.mouseMoveHandler)
    window.addEventListener('mouseup', this.handleTriggerMouseUp)
  }

  handleTriggerMouseUp() {
    const trigger = this.getTrigger()
    trigger.style.cursor = 'pointer'

    const container = this.getTriggerContainer()
    container.style.userSelect = 'text'

    window.removeEventListener('mousemove', this.mouseMoveHandler)
    window.removeEventListener('mouseup', this.handleTriggerMouseUp)

    if (this.mouseCounter <= 2) {
      this.$emit('onclick')
    }
  }

  handleTriggerMouseMove(event: MouseEvent) {
    this.mouseCounter++

    const trigger = this.getTrigger()
    const container = this.getTriggerContainer()

    if (this.direction === 'vertical' || this.direction === 'both') {
      const top = trigger.style.top ? parseInt(trigger.style.top) : 0
      const diffY = event.pageY - this.mousePosition.y
      // move to bottom
      if (diffY > 0) {
        if (top + diffY <= container.clientHeight - trigger.clientHeight) {
          trigger.style.top = `${top + diffY}px`
        } else {
          trigger.style.top = `${container.clientHeight - trigger.clientHeight}px`
        }
      }
      // move to top
      else if (diffY < 0) {
        if (top + diffY > 0) {
          trigger.style.top = `${top + diffY}px`
        } else {
          trigger.style.top = '0px'
        }
      }
    }

    if (this.direction === 'horizontal' || this.direction === 'both') {
      const left = trigger.style.left ? parseInt(trigger.style.left) : 0
      const diffX = event.pageX - this.mousePosition.x
      // move to right
      if (diffX > 0) {
        if (left + diffX <= container.clientWidth - trigger.clientWidth) {
          trigger.style.left = `${left + diffX}px`
        } else {
          trigger.style.left = `${container.clientWidth - trigger.clientWidth}px`
        }
      }
      // move to left
      else if (diffX < 0) {
        if (left + diffX > 0) {
          trigger.style.left = `${left + diffX}px`
        } else {
          trigger.style.left = '0px'
        }
      }
    }

    this.mousePosition = {
      x: event.pageX,
      y: event.pageY,
    }
  }

  mounted() {
    const container = this.getTriggerContainer()
    const containerPosition = window.getComputedStyle(container, null).position
    if (containerPosition === 'static') {
      container.style.position = 'relative'
    }

    const trigger = this.getTrigger()
    const triggerStyle: CSSStyleDeclaration = trigger.style

    const initPosition = this.initPosition
    switch (initPosition) {
      case 'top':
        triggerStyle.top = '0px'
        triggerStyle.left = `${(container.clientWidth - trigger.clientWidth) / 2}px`
        break
      case 'left':
        triggerStyle.top = `${(container.clientHeight - trigger.clientHeight) / 2}px`
        triggerStyle.left = '0px'
        break
      case 'right':
        triggerStyle.top = `${(container.clientHeight - trigger.clientHeight) / 2}px`
        triggerStyle.left = `${container.clientWidth - trigger.clientHeight}px`
        break
      case 'bottom':
        triggerStyle.top = `${container.clientHeight - trigger.clientHeight}px`
        triggerStyle.left = `${(container.clientWidth - trigger.clientWidth) / 2}px`
        break
      case 'topLeft':
      case 'leftTop':
        triggerStyle.top = '0px'
        triggerStyle.left = '0px'
        break
      case 'topRight':
      case 'rightTop':
        triggerStyle.top = '0px'
        triggerStyle.left = `${container.clientWidth - trigger.clientHeight}px`
        break
      case 'bottomLeft':
      case 'leftBottom':
        triggerStyle.top = `${container.clientHeight - trigger.clientHeight}px`
        triggerStyle.left = '0px'
        break
      case 'bottomRight':
      case 'rightBottom':
        triggerStyle.top = `${container.clientHeight - trigger.clientHeight}px`
        triggerStyle.left = `${container.clientWidth - trigger.clientWidth}px`
        break
      default:
        break
    }
  }
}
</script>

<style scoped lang="less">
@import '../../style/index';
.au-toolkit {
  position: absolute;
  cursor: pointer;
  z-index: 999;
}
</style>
