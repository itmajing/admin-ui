<template>
  <div id="app">
    <a-config-provider :locale="locale">
      <router-view />
    </a-config-provider>
  </div>
</template>

<script>
import { defineComponent } from 'vue';
import zhCN from 'ant-design-vue/lib/locale-provider/zh_CN';

export default defineComponent({
  setup() {
    const locale = zhCN;
    return {
      locale,
    };
  },
});
</script>

<style lang="less">
html,
body,
#app {
  height: 100%;
  width: 100%;
}
</style>
