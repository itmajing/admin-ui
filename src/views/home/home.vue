<template>
  <div>
    <div>首页</div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

@Component
export default class Home extends Vue {
  mounted(): void {
    console.log(this.$global)
  }
}
</script>

<style lang="less" scoped></style>
