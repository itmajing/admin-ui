<template>
  <div>
    <div>登录</div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

@Component
export default class Main extends Vue {
  mounted() {
    console.log(window.navigator.userAgent);
  }
}
</script>

<style lang="less" scoped></style>
