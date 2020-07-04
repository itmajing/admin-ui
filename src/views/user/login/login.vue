<template>
  <div class="au-login">
    <div class="au-login-content">
      <div class="au-login-wrapper">
        <div class="au-login-content-header">
          <img src="../../../assets/logo.png" alt="logo" />
          <span>Admin UI</span>
        </div>
        <a-card class="au-login-content-body" :hoverable="true" :bordered="false">
          <a-tabs defaultActiveKey="password" :animated="false" @change="handleTabsChange">
            <a-tab-pane key="password">
              <span slot="tab">
                <a-icon type="user" />
                <span>账号密码登录</span>
              </span>
              <div class="au-login-password">
                <a-form-model
                  ref="passwordForm"
                  :model="passwordForm"
                  :rules="passwordRules"
                  @submit="handlePasswordLogin"
                >
                  <a-form-model-item prop="username">
                    <a-input v-model="passwordForm.username" placeholder="用户名/邮箱/手机号">
                      <a-icon slot="prefix" type="user" style="color: rgba(0,0,0,.25)" />
                    </a-input>
                  </a-form-model-item>
                  <a-form-model-item prop="password">
                    <a-input v-model="passwordForm.password" placeholder="密码">
                      <a-icon slot="prefix" type="lock" style="color: rgba(0,0,0,.25)" />
                    </a-input>
                  </a-form-model-item>
                  <a-form-model-item prop="remember">
                    <a-checkbox v-model="passwordForm.remember">
                      记住密码
                    </a-checkbox>
                    <a class="au-login-password-forgot" @click="handleForgotPassword">忘记密码</a>
                  </a-form-model-item>
                  <a-button type="primary" html-type="submit" :loading="loginLoading" :block="true">
                    登录
                  </a-button>
                </a-form-model>
              </div>
            </a-tab-pane>
            <a-tab-pane key="mobile">
              <span slot="tab">
                <a-icon type="mobile" />
                <span>手机号码登录</span>
              </span>
              <div class="au-login-mobile">
                <a-form-model ref="mobileForm" :model="mobileForm" :rules="mobileRules" @submit="handleMobileLogin">
                  <a-form-model-item prop="mobile">
                    <a-input v-model="mobileForm.mobile" placeholder="手机号码">
                      <a-icon slot="prefix" type="mobile" style="color: rgba(0,0,0,.25)" />
                    </a-input>
                  </a-form-model-item>
                  <a-form-model-item prop="captcha">
                    <a-input v-model="mobileForm.captcha" placeholder="验证码" style="width: calc(100% - 110px)">
                      <a-icon slot="prefix" type="mail" style="color: rgba(0,0,0,.25)" />
                    </a-input>
                    <a-button
                      style="width: 102px; margin-left: 8px"
                      @click="handleSendCaptcha"
                      :disabled="captchaSending"
                    >
                      <span v-if="captchaSending">{{ captchaCountdown }}s</span>
                      <span v-else>获取验证码</span>
                    </a-button>
                  </a-form-model-item>
                  <a-button type="primary" html-type="submit" :loading="loginLoading" :block="true">
                    登录
                  </a-button>
                </a-form-model>
              </div>
            </a-tab-pane>
          </a-tabs>
          <div class="au-login-other">
            <span>其他登录方式</span>
            <div class="au-login-third">
              <a-icon type="weibo" :style="{ fontSize: '18px' }" />
              <a-icon type="wechat" :style="{ fontSize: '18px' }" />
              <a-icon type="qq" :style="{ fontSize: '18px' }" />
            </div>
            <a class="au-login-register" @click="handleRegisterAccount">注册账户</a>
          </div>
        </a-card>
      </div>
    </div>
    <div class="au-login-footer">
      <span>Copyright © 2020 Admin UI</span>
    </div>
    <vue-particles class="au-login-background"></vue-particles>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { Mutation } from 'vuex-class'

@Component
export default class Login extends Vue {
  $refs!: { passwordForm: HTMLFormElement; mobileForm: HTMLFormElement }
  passwordForm = {
    username: '',
    password: '',
    remember: false,
  }
  passwordRules = {
    username: [{ required: true, message: '请输入用户名!' }],
    password: [{ required: true, message: '请输入密码!' }],
  }
  mobileForm = {
    mobile: '',
    captcha: '',
  }
  mobileRules = {
    mobile: [{ required: true, message: '请输入手机号!' }],
    captcha: [{ required: true, message: '请输入验证码!' }],
  }
  loginLoading = false
  captchaSending = false
  captchaInterval = -1
  captchaCountdown = 60

  @Mutation setAccessToken!: Function

  handleTabsChange() {
    if (this.$refs.passwordForm) {
      this.$refs.passwordForm.clearValidate()
    }
    if (this.$refs.mobileForm) {
      this.$refs.mobileForm.clearValidate()
    }
  }

  handleSendCaptcha() {
    this.$refs.mobileForm.validateField('mobile', (error: string) => {
      if (!error) {
        this.$axios
          .post('api/captcha/mobile', { mobile: this.mobileForm.mobile, service: 'user-login' })
          .then(({ data = {} }) => {
            if (data.success) {
              this.captchaSending = true
              this.captchaCountdown = 60
              this.captchaInterval = setInterval(() => {
                if (this.captchaCountdown > 1) {
                  this.captchaCountdown--
                } else {
                  this.captchaSending = false
                  clearInterval(this.captchaInterval)
                }
              }, 1000)
            } else {
              this.$message.error('发送失败')
            }
          })
          .catch(() => {
            this.$message.error('发送失败')
          })
      }
    })
  }

  /**
   * 使用账号密码登录
   */
  handlePasswordLogin(e: any) {
    e.preventDefault()
    this.$refs.passwordForm.validate((validate: boolean) => {
      if (validate) {
        this.loginLoading = true
        this.$axios
          .post('api/auth/password', this.mobileForm)
          .then(({ data = {} }) => {
            if (data.success) {
              this.$message.success('登录成功')
              setTimeout(() => {
                this.handleLoginSuccess(data.data.accessToken)
              }, 500)
            } else {
              this.handleLoginFailed()
            }
          })
          .catch(() => {
            this.handleLoginFailed()
          })
          .finally(() => {
            this.loginLoading = false
          })
      }
    })
  }

  /**
   * 使用手机验证码登录
   */
  handleMobileLogin(e: any) {
    e.preventDefault()
    this.$refs.mobileForm.validate((validate: boolean) => {
      if (validate) {
        this.$axios
          .post('api/auth/mobile', this.passwordForm)
          .then(({ data = {} }) => {
            if (data.success) {
              this.$message.success('登录成功')
              setTimeout(() => {
                this.handleLoginSuccess(data.data.accessToken)
              }, 500)
            } else {
              this.handleLoginFailed()
            }
          })
          .catch(() => {
            this.handleLoginFailed()
          })
          .finally(() => {
            this.loginLoading = false
          })
      }
    })
  }

  handleLoginSuccess(accessToken: string) {
    this.setAccessToken(accessToken)
    this.$router.replace({
      name: 'main',
    })
  }

  handleLoginFailed() {
    this.$message.error('登录失败')
  }

  handleForgotPassword(e: any) {
    e.preventDefault()
    console.log('忘记密码')
  }

  handleRegisterAccount(e: any) {
    e.preventDefault()
    this.$router.replace({
      name: 'register',
    })
  }
}
</script>

<style lang="less" scoped>
@import './login.less';
</style>
<style lang="less">
.au-login {
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
