<template>
  <div class="account-setting-info">
    <a-row :gutter="16">
      <a-col :md="24" :lg="16">
        <a-form-model :model="baseSettingForm" layout="vertical">
          <a-form-model-item label="昵称" prop="nickname">
            <a-input v-model="baseSettingForm.nickname" placeholder="请输入昵称" />
          </a-form-model-item>
          <a-form-model-item label="个人介绍" prop="bio">
            <a-textarea v-model="baseSettingForm.bio" :rows="4" placeholder="请输入个人介绍" />
          </a-form-model-item>
          <a-form-model-item label="电子邮件" prop="email">
            <a-input v-model="baseSettingForm.email" placeholder="请输入电子邮箱" />
          </a-form-model-item>
          <a-form-item style="text-align: right">
            <a-button type="primary">保存</a-button>
            <a-button style="margin-left: 8px">重置</a-button>
          </a-form-item>
        </a-form-model>
      </a-col>
      <a-col :md="24" :lg="8">
        <!--TODO-->
      </a-col>
    </a-row>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

@Component
export default class Base extends Vue {
  baseSettingForm = {
    nickname: '',
    bio: '',
    email: '',
  }
}
</script>

<style lang="less" scoped></style>
