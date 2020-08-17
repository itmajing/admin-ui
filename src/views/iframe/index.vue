<template>
  <div class="au-page-iframe" :style="{ height: containerHeight + 'px' }">
    <iframe v-if="iframe" :src="iframe" @load="handleIframeOnload" />
    <div v-else>
      <a-result status="404" title="404" />
    </div>
    <div class="iframe-loading" v-if="iframeLoading">
      <a-spin />
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator'
import { Getter } from 'vuex-class'

@Component
export default class Iframe extends Vue {
  iframeLoading = true

  @Prop({
    type: String,
    default: () => {
      return ''
    },
  })
  readonly iframe!: string

  @Getter('containerHeight') containerHeight!: number

  @Watch('iframe')
  onIframeChange() {
    this.iframeLoading = true
  }

  handleIframeOnload() {
    this.iframeLoading = false
  }
}
</script>

<style lang="less" scoped>
@import '../../style/index';
.au-page-iframe {
  position: relative;

  iframe {
    border: none;
    padding: 0;
    margin: 0;
    width: 100%;
    height: 100%;
  }

  .iframe-loading {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }
}
</style>
