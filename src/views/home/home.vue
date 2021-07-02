<template>
  <div>
    <div style="width: 100%; height: 500px; text-align: center">
      <img src="../../assets/svg/empty-develop.svg" alt="develop" style="height: 100%" />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted } from 'vue';
import { useLogger } from '@/libs/logger';
import { useGlobal } from '@/libs/global';

export default defineComponent({
  setup() {
    onMounted(() => {
      const logger = useLogger();
      const global = useGlobal();

      logger.info(global);
    });
  },
});
</script>

<style lang="less" scoped></style>
