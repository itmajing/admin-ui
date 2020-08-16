<template>
  <div id="app">
    <a-locale-provider :locale="locale">
      <router-view />
    </a-locale-provider>
  </div>
</template>

<script>
import zhCN from 'ant-design-vue/lib/locale-provider/zh_CN'

export default {
  data() {
    return {
      locale: zhCN,
    }
  },
}
</script>

<style lang="less">
html,
body,
#app {
  height: 100%;
  width: 100%;
}
</style>
