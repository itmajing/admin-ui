<template>
  <div class="au-page-error">
    <a-result status="404" title="404" sub-title="抱歉，你访问的页面不存在">
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
export default class NotFound extends Vue {
  handleGotoHome() {
    this.$router.replace({ path: '/' })
  }
}
</script>

<style lang="less" scoped></style>
