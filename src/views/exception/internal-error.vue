<template>
  <div class="au-page-error">
    <a-result status="500" title="500" sub-title="抱歉，服务器出错了">
      <template #extra>
        <a-button type="primary" @click="handleGotoHome">
          返回首页
        </a-button>
      </template>
    </a-result>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

@Component
export default class InternalError extends Vue {
  handleGotoHome() {
    this.$router.replace({ path: '/' })
  }
}
</script>

<style lang="less" scoped></style>
