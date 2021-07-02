<template>
  <div class="au-page-error">
    <a-result status="500" title="500" sub-title="抱歉，服务器出错了">
      <template #extra>
        <a-button type="primary" @click="handleGotoHome"> 返回首页 </a-button>
      </template>
    </a-result>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { useRouter } from 'vue-router';

export default defineComponent({
  setup() {
    const router = useRouter();
    const handleGotoHome = () => {
      router.replace({ path: '/' });
    };
    return {
      handleGotoHome,
    };
  },
});
</script>

<style lang="less" scoped></style>
