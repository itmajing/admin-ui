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
import { computed, defineComponent, ref } from 'vue';
import { useStore } from 'vuex';

export default defineComponent({
  props: {
    iframe: {
      type: String,
      default: () => {
        return '';
      },
    },
  },
  setup() {
    const store = useStore();

    const iframeLoading = ref(true);
    const containerHeight = computed(() => store.getters.containerHeight);
    const handleIframeOnload = () => {
      iframeLoading.value = false;
    };

    return {
      iframeLoading,
      containerHeight,
      handleIframeOnload,
    };
  },
});
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
