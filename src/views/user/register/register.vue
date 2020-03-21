<template>
  <div class="au-register">
    <div class="au-register-content">
      <div class="au-register-wrapper">
        <div class="au-register-content-header">
          <img src="../../../assets/logo.png" alt="logo" />
          <span>Admin UI</span>
        </div>
        <a-card class="au-register-content-body" :hoverable="true" :bordered="false">
          <a-form-model ref="registerForm" :model="registerForm" :rules="registerRules" @submit="handleUserRegister">
            <a-form-model-item prop="username">
              <a-input v-model="registerForm.username" placeholder="用户名">
                <a-icon slot="prefix" type="user" style="color: rgba(0,0,0,.25)" />
              </a-input>
            </a-form-model-item>
            <a-form-model-item prop="password">
              <a-input v-model="registerForm.password" placeholder="密码">
                <a-icon slot="prefix" type="lock" style="color: rgba(0,0,0,.25)" />
              </a-input>
            </a-form-model-item>
            <a-form-model-item prop="confirm">
              <a-input v-model="registerForm.confirm" placeholder="确认密码">
                <a-icon slot="prefix" type="lock" style="color: rgba(0,0,0,.25)" />
              </a-input>
            </a-form-model-item>
            <a-form-model-item prop="mobile">
              <a-input v-model="registerForm.mobile" placeholder="手机号码">
                <a-icon slot="prefix" type="mobile" style="color: rgba(0,0,0,.25)" />
              </a-input>
            </a-form-model-item>
            <a-form-model-item prop="captcha">
              <a-input v-model="registerForm.captcha" placeholder="验证码" style="width: calc(100% - 110px)">
                <a-icon slot="prefix" type="lock" style="color: rgba(0,0,0,.25)" />
              </a-input>
              <a-button style="width: 102px; margin-left: 8px" @click="handleSendCaptcha" :disabled="captchaSending">
                <span v-if="captchaSending">{{ captchaCountdown }}s</span>
                <span v-else>获取验证码</span>
              </a-button>
            </a-form-model-item>
            <a-button type="primary" html-type="submit" :loading="registerLoading" :block="true">
              注册
            </a-button>
          </a-form-model>
          <div class="au-register-other">
            <a class="au-register-login" @click="handleLoginAccount">使用已有账户登录</a>
          </div>
        </a-card>
      </div>
    </div>
    <div class="au-register-footer">
      <span>Copyright © 2020 Admin UI</span>
    </div>
    <vue-particles class="au-register-background"></vue-particles>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

@Component
export default class Register extends Vue {
  $refs!: { registerForm: HTMLFormElement };
  registerForm = {
    username: '',
    password: '',
    confirm: '',
    mobile: '',
    captcha: ''
  };
  registerRules = {
    username: [{ required: true, message: '请输入用户名!' }],
    password: [{ required: true, message: '请输入密码!' }],
    confirm: [{ required: true, message: '请输入确认密码!' }],
    mobile: [{ required: true, message: '请输入手机号码!' }],
    captcha: [{ required: true, message: '请输入验证码!' }]
  };
  registerLoading = false;
  captchaSending = false;
  captchaInterval = -1;
  captchaCountdown = 60;

  handleSendCaptcha() {
    this.$refs.registerForm.validateField('mobile', (error: string) => {
      if (!error) {
        this.$axios
          .post('api/captcha/mobile', { mobile: this.registerForm.mobile, service: 'user-register' })
          .then(({ data = {} }) => {
            if (data.success) {
              this.captchaSending = true;
              this.captchaCountdown = 60;
              this.captchaInterval = setInterval(() => {
                if (this.captchaCountdown > 1) {
                  this.captchaCountdown--;
                } else {
                  this.captchaSending = false;
                  clearInterval(this.captchaInterval);
                }
              }, 1000);
            } else {
              this.$message.error('发送失败');
            }
          })
          .catch(() => {
            this.$message.error('发送失败');
          });
      }
    });
  }

  handleUserRegister(e: any) {
    e.preventDefault();
    this.$refs.registerForm.validate((validate: boolean) => {
      if (validate) {
        this.registerLoading = true;
        this.$axios
          .post('api/user/register', this.registerForm)
          .then(({ data = {} }) => {
            if (data.success) {
              this.$message.success('注册成功');
              setTimeout(() => {
                this.handleRegisterSuccess();
              }, 500);
            } else {
              this.handleRegisterFailed();
            }
          })
          .catch(() => {
            this.handleRegisterFailed();
          })
          .finally(() => {
            this.registerLoading = false;
          });
      }
    });
  }

  handleRegisterSuccess() {
    this.$router.replace({
      name: 'main'
    });
  }

  handleRegisterFailed() {
    this.$message.error('注册失败');
  }

  handleLoginAccount(e: any) {
    e.preventDefault();
    this.$router.replace({
      name: 'login'
    });
  }
}
</script>

<style lang="less" scoped>
@import './register.less';
</style>
<style lang="less">
.au-register {
  .ant-tabs-bar {
    border: none;
  }

  .ant-tabs-nav-scroll {
    text-align: center;
  }
  .ant-card-hoverable {
    cursor: auto;
  }
}
</style>
