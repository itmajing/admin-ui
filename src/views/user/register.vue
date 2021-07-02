<template>
  <div class="au-user-register">
    <div class="au-user-register-title">注册账户</div>
    <a-form
      ref="registerFormRef"
      :model="registerFormData"
      :rules="registerFormRules"
      :wrapper-col="formItemCol.wrapperCol"
    >
      <a-form-item name="username">
        <a-input v-model:value="registerFormData.username" placeholder="用户名">
          <a-icon slot="prefix" type="user" style="color: rgba(0, 0, 0, 0.25)" />
        </a-input>
      </a-form-item>
      <a-form-item name="password">
        <a-input-password v-model:value="registerFormData.password" placeholder="密码">
          <a-icon slot="prefix" type="lock" style="color: rgba(0, 0, 0, 0.25)" />
        </a-input-password>
      </a-form-item>
      <a-form-item name="confirm">
        <a-input-password v-model:value="registerFormData.confirm" placeholder="确认密码">
          <a-icon slot="prefix" type="lock" style="color: rgba(0, 0, 0, 0.25)" />
        </a-input-password>
      </a-form-item>
      <a-form-item name="mobile">
        <a-input v-model:value="registerFormData.mobile" placeholder="手机号码">
          <a-icon slot="prefix" type="mobile" style="color: rgba(0, 0, 0, 0.25)" />
        </a-input>
      </a-form-item>
      <a-form-item name="captcha">
        <a-input
          v-model:value="registerFormData.captcha"
          placeholder="验证码"
          style="width: calc(100% - 110px)"
        >
          <a-icon slot="prefix" type="lock" style="color: rgba(0, 0, 0, 0.25)" />
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
        :loading="registerLoading"
        :block="true"
        @click="onRegisterFormSubmit"
      >
        注册
      </a-button>
    </a-form>
    <div class="au-user-register-other">
      <a class="au-user-register-login" @click="onLoginAccountClick">使用已有账户登录</a>
    </div>
  </div>
</template>

<script lang="ts">
import { sendMobileCaptcha } from '@/api/captcha';
import { SUCCESS_CODE } from '@/constant';
import { defineComponent, reactive, Ref, ref } from 'vue';
import { useRouter } from 'vue-router';
import { message } from 'ant-design-vue';
import { useAxios } from '@/libs/axios';

const useRegister = (formRef: Ref, success: () => void, fail: (err: any) => void) => {
  const registerFormData = reactive({
    username: '',
    password: '',
    confirm: '',
    mobile: '',
    captcha: '',
  });
  const registerFormRules = reactive({
    username: [{ required: true, message: '请输入用户名!' }],
    password: [{ required: true, message: '请输入密码!' }],
    confirm: [{ required: true, message: '请输入确认密码!' }],
    mobile: [{ required: true, message: '请输入手机号码!' }],
    captcha: [{ required: true, message: '请输入验证码!' }],
  });
  const registerLoading = ref(false);
  const captchaSending = ref(false);
  const captchaInterval = ref(-1);
  const captchaCountdown = ref(60);

  const axios = useAxios();

  const onRegisterFormSubmit = (e: any) => {
    e.preventDefault();
    formRef.value?.validate().then(() => {
      registerLoading.value = true;
      axios
        .post('api/user/register', registerFormData)
        .then(({ data = {} }) => {
          if (data.success) {
            success();
          } else {
            fail(data.message);
          }
        })
        .catch((err) => {
          fail(err);
        })
        .finally(() => {
          registerLoading.value = false;
        });
    });
  };

  const onSendCaptchaClick = () => {
    formRef.value?.validateField('mobile').then(() => {
      sendMobileCaptcha({ receiver: registerFormData.mobile, operation: 'USER-REGISTER' })
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
    registerFormData,
    registerFormRules,
    registerLoading,
    captchaSending,
    captchaInterval,
    captchaCountdown,
    onRegisterFormSubmit,
    onSendCaptchaClick,
  };
};

export default defineComponent({
  setup() {
    const registerFormRef = ref();
    const formItemCol = reactive({
      wrapperCol: {
        span: 24,
      },
    });
    const router = useRouter();

    const handleRegisterSuccess = () => {
      message.success('注册成功');

      setTimeout(() => {
        router.replace({
          name: 'login',
        });
      }, 500);
    };

    const handleRegisterFailed = () => {
      message.error('注册失败');
    };

    const onLoginAccountClick = (e: any) => {
      e.preventDefault();
      router.replace({
        name: 'login',
      });
    };

    const {
      registerFormData,
      registerFormRules,
      registerLoading,
      captchaSending,
      captchaInterval,
      captchaCountdown,
      onRegisterFormSubmit,
      onSendCaptchaClick,
    } = useRegister(registerFormRef, handleRegisterSuccess, handleRegisterFailed);

    return {
      formItemCol,
      registerFormRef,
      registerFormData,
      registerFormRules,
      registerLoading,
      captchaSending,
      captchaInterval,
      captchaCountdown,
      onRegisterFormSubmit,
      onSendCaptchaClick,
      onLoginAccountClick,
    };
  },
});
</script>

<style lang="less" scoped>
.au-user-register-title {
  margin-bottom: 20px;
  font-size: 14px;
}
.au-user-register-other {
  margin-top: 24px;
  display: flex;
  justify-content: flex-start;
  align-items: center;

  .au-user-register-login {
    flex: 1;
    text-align: center;
  }
}
</style>
