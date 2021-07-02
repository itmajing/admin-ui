<template>
  <div class="account-setting-info">
    <a-row :gutter="16">
      <a-col :md="24" :lg="16">
        <a-form :model="baseSettingForm" layout="vertical">
          <a-form-item label="昵称" prop="nickname">
            <a-input v-model="baseSettingForm.nickname" placeholder="请输入昵称" />
          </a-form-item>
          <a-form-item label="个人介绍" prop="bio">
            <a-textarea v-model="baseSettingForm.bio" :rows="4" placeholder="请输入个人介绍" />
          </a-form-item>
          <a-form-item label="电子邮件" prop="email">
            <a-input v-model="baseSettingForm.email" placeholder="请输入电子邮箱" />
          </a-form-item>
          <a-form-item style="text-align: right">
            <a-button type="primary">保存</a-button>
            <a-button style="margin-left: 8px">重置</a-button>
          </a-form-item>
        </a-form>
      </a-col>
      <a-col :md="24" :lg="8">
        <!--TODO-->
      </a-col>
    </a-row>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive } from 'vue';

export default defineComponent({
  setup() {
    const baseSettingForm = reactive({
      nickname: '',
      bio: '',
      email: '',
    });
    return {
      baseSettingForm,
    };
  },
});
</script>

<style lang="less" scoped></style>
