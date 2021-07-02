<template>
  <div class="au-user-login">
    <a-tabs
      class="au-user-login-tabs"
      defaultActiveKey="password"
      :animated="false"
      @change="onTabsChange"
    >
      <a-tab-pane key="password">
        <template #tab>
          <user-outlined />
          <span>账号密码登录</span>
        </template>
        <div class="au-user-login-password">
          <a-form
            ref="passwordFormRef"
            :model="passwordFormData"
            :rules="passwordFormRules"
            :wrapper-col="formItemCol.wrapperCol"
          >
            <a-form-item name="username">
              <a-input v-model:value="passwordFormData.username" placeholder="用户名/邮箱/手机号">
                <template #prefix>
                  <user-outlined style="color: rgba(0, 0, 0, 0.25)" />
                </template>
              </a-input>
            </a-form-item>
            <a-form-item name="password">
              <a-input-password v-model:value="passwordFormData.password" placeholder="密码">
                <template #prefix>
                  <lock-outlined style="color: rgba(0, 0, 0, 0.25)" />
                </template>
              </a-input-password>
            </a-form-item>
            <a-form-item name="remember">
              <a-checkbox v-model:checked="passwordFormData.remember"> 记住密码 </a-checkbox>
              <a class="au-user-login-password-forgot" @click="onForgotPasswordClick">忘记密码</a>
            </a-form-item>
            <a-button
              type="primary"
              :loading="passwordLoading"
              :block="true"
              @click="onPasswordFormSubmit"
            >
              登录
            </a-button>
          </a-form>
        </div>
      </a-tab-pane>
      <a-tab-pane key="mobile">
        <template #tab>
          <mobile-outlined />
          <span>手机号码登录</span>
        </template>
        <div class="au-user-login-mobile">
          <a-form
            ref="mobileFormRef"
            :model="mobileFormData"
            :rules="mobileFormRules"
            :wrapper-col="formItemCol.wrapperCol"
          >
            <a-form-item name="mobile">
              <a-input v-model:value="mobileFormData.mobile" placeholder="手机号码">
                <template #prefix>
                  <mobile-outlined style="color: rgba(0, 0, 0, 0.25)" />
                </template>
              </a-input>
            </a-form-item>
            <a-form-item name="captcha">
              <a-input
                v-model:value="mobileFormData.captcha"
                placeholder="验证码"
                style="width: calc(100% - 110px)"
              >
                <template #prefix>
                  <mail-outlined style="color: rgba(0, 0, 0, 0.25)" />
                </template>
              </a-input>
              <a-button
                style="width: 102px; margin-left: 8px"
                @click="onSendCaptchaClick"
                :disabled="captchaSending"
              >
                <span v-if="captchaSending">{{ captchaCountdown }}s</span>
                <span v-else>获取验证码</span>
              </a-button>
            </a-form-item>
            <a-button
              type="primary"
              :loading="mobileLoading"
              :block="true"
              @click="onMobileFormSubmit"
            >
              登录
            </a-button>
          </a-form>
        </div>
      </a-tab-pane>
    </a-tabs>
    <div class="au-user-login-other">
      <span>其他登录方式</span>
      <div class="au-user-login-third">
        <github-outlined :style="{ fontSize: '18px' }" />
        <wechat-outlined :style="{ fontSize: '18px' }" />
        <qq-outlined :style="{ fontSize: '18px' }" />
      </div>
      <a class="au-user-login-register" @click="oRegisterAccountClick">注册账户</a>
    </div>
  </div>
</template>

<script lang="ts">
import { sendMobileCaptcha } from '@/api/captcha';
import { SUCCESS_CODE } from '@/constant';
import { defineComponent, reactive, ref, Ref } from 'vue';
import { useStore } from 'vuex';
import { message } from 'ant-design-vue';
import {
  UserOutlined,
  LockOutlined,
  MobileOutlined,
  MailOutlined,
  GithubOutlined,
  WechatOutlined,
  QqOutlined,
} from '@ant-design/icons-vue';
import { useRouter } from 'vue-router';
import { addRoutes } from '@/router/utils';

const usePasswordLogin = (formRef: Ref, success: () => void, fail: (err: any) => void) => {
  const passwordFormData = reactive({
    username: '',
    password: '',
    remember: false,
  });
  const passwordFormRules = reactive({
    username: [{ required: true, message: '请输入用户名!' }],
    password: [{ required: true, message: '请输入密码!' }],
  });
  const passwordLoading = ref(false);

  const store = useStore();
  const userPasswordLogin = (data: any) => store.dispatch('userPasswordLogin', data);

  const onPasswordFormSubmit = (e: any) => {
    e.preventDefault();
    formRef.value?.validate().then(() => {
      handlePasswordLogin();
    });
  };

  const onForgotPasswordClick = (e: any) => {
    e.preventDefault();
  };

  const handlePasswordLogin = () => {
    passwordLoading.value = true;
    userPasswordLogin(passwordFormData)
      .then(() => {
        success();
      })
      .catch((err) => {
        fail(err);
      })
      .finally(() => {
        passwordLoading.value = false;
      });
  };

  return {
    passwordFormData,
    passwordFormRules,
    passwordLoading,
    onPasswordFormSubmit,
    onForgotPasswordClick,
  };
};

const useMobileLogin = (formRef: Ref, success: () => void, fail: (err: any) => void) => {
  const mobileFormData = reactive({
    mobile: '',
    captcha: '',
  });
  const mobileFormRules = reactive({
    mobile: [{ required: true, message: '请输入手机号!' }],
    captcha: [{ required: true, message: '请输入验证码!' }],
  });
  const mobileLoading = ref(false);
  const captchaSending = ref(false);
  const captchaInterval = ref(-1);
  const captchaCountdown = ref(60);

  const store = useStore();
  const userMobileLogin = (data: any) => store.dispatch('userMobileLogin', data);

  const onMobileFormSubmit = (e: any) => {
    e.preventDefault();
    handleMobileLogin();
  };

  const handleMobileLogin = () => {
    mobileLoading.value = true;
    userMobileLogin(mobileFormData)
      .then(() => {
        success();
      })
      .catch((err) => {
        fail(err);
      })
      .finally(() => {
        mobileLoading.value = false;
      });
  };

  const onSendCaptchaClick = () => {
    formRef.value?.validateField('mobile').then(() => {
      sendMobileCaptcha({ receiver: mobileFormData.mobile, operation: 'USER-LOGIN' })
        .then(({ data = {} }) => {
          if (data.code === SUCCESS_CODE) {
            message.success('发送成功');
            captchaSending.value = true;
            captchaCountdown.value = 60;
            captchaInterval.value = setInterval(() => {
              if (captchaCountdown.value > 1) {
                captchaCountdown.value--;
              } else {
                captchaSending.value = false;
                clearInterval(captchaInterval.value);
              }
            }, 1000);
          } else {
            message.error('发送失败');
          }
        })
        .catch(() => {
          message.error('发送失败');
        });
    });
  };

  return {
    mobileFormData,
    mobileFormRules,
    mobileLoading,
    captchaSending,
    captchaInterval,
    captchaCountdown,
    onMobileFormSubmit,
    onSendCaptchaClick,
  };
};

export default defineComponent({
  name: 'Login',
  components: {
    UserOutlined,
    LockOutlined,
    MobileOutlined,
    MailOutlined,
    GithubOutlined,
    WechatOutlined,
    QqOutlined,
  },
  setup() {
    const passwordFormRef = ref();
    const mobileFormRef = ref();

    const formItemCol = reactive({
      wrapperCol: {
        span: 24,
      },
    });

    const router = useRouter();
    const store = useStore();

    const onTabsChange = () => {
      passwordFormRef.value?.clearValidate();
      mobileFormRef.value?.clearValidate();
    };

    const handleLoginSuccess = async () => {
      message.success('登录成功');

      const userPermissions = await store.dispatch('getPermissions');
      const accessedRoutes = await store.dispatch('generateRoutes', userPermissions);
      addRoutes(router, accessedRoutes);

      router.push({
        name: 'home',
      });
    };

    const handleLoginFailed = () => {
      message.error('登录失败');
    };

    const {
      passwordFormData,
      passwordFormRules,
      passwordLoading,
      onPasswordFormSubmit,
      onForgotPasswordClick,
    } = usePasswordLogin(passwordFormRef, handleLoginSuccess, handleLoginFailed);
    const {
      mobileFormData,
      mobileFormRules,
      mobileLoading,
      captchaSending,
      captchaInterval,
      captchaCountdown,
      onMobileFormSubmit,
      onSendCaptchaClick,
    } = useMobileLogin(mobileFormRef, handleLoginSuccess, handleLoginFailed);

    const oRegisterAccountClick = (e: any) => {
      e.preventDefault();
      router.replace({
        name: 'register',
      });
    };

    return {
      onTabsChange,
      oRegisterAccountClick,
      formItemCol,
      passwordFormRef,
      passwordFormData,
      passwordFormRules,
      passwordLoading,
      onPasswordFormSubmit,
      onForgotPasswordClick,
      mobileFormRef,
      mobileFormData,
      mobileFormRules,
      mobileLoading,
      captchaSending,
      captchaInterval,
      captchaCountdown,
      onMobileFormSubmit,
      onSendCaptchaClick,
    };
  },
});
</script>

<style lang="less" scoped>
@import '../../style/index';
.au-user-login {
  position: relative;

  & ::v-deep(.ant-tabs-bar) {
    border: none;
  }

  & ::v-deep(.ant-tabs-nav-scroll) {
    text-align: center;
  }

  & ::v-deep(.ant-card-hoverable) {
    cursor: auto;
  }
}

.au-user-login-password {
  .au-user-login-password-forgot {
    float: right;
  }
}

.au-user-login-other {
  margin-top: 24px;
  display: flex;
  justify-content: flex-start;
  align-items: center;

  .au-user-login-third {
    margin-left: 15px;
    display: flex;
    flex: 1;

    span {
      height: 24px;
      width: 24px;
      margin-right: 10px;
      cursor: pointer;
      background-color: rgba(192, 194, 196, 0.6);
      border-radius: 12px;
      display: flex;
      justify-content: center;
      align-items: center;
      color: white;

      &:hover {
        color: @primary-color;
      }
    }
  }
}
</style>
