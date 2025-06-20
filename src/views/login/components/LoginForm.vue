<template>
  <el-form ref="formRef" :model="loginForm" :rules="loginRules" size="large" class="auth-form">
    <div class="login-type-switch">
      <div class="flex-center gap-20 lt-md:gap-10">
        <span
          class="login-type-item cursor-pointer transition-all duration-300 relative"
          :class="[
            loginForm.loginType === 'password' ? 'text-primary font-medium scale-110' : 'text-gray-400 hover:text-gray-600',
          ]"
          @click="switchLoginType('password')"
        >
          账号密码登录
        </span>
        <span
          class="login-type-item cursor-pointer transition-all duration-300 relative"
          :class="[
            loginForm.loginType === 'email' ? 'text-primary font-medium scale-110' : 'text-gray-400 hover:text-gray-600',
          ]"
          @click="switchLoginType('email')"
        >
          邮箱验证码登录
        </span>
      </div>
    </div>

    <div class="form-container relative overflow-hidden">
      <transition name="form-slide" mode="out-in">
        <div v-if="loginForm.loginType === 'password'" key="account" class="form-content">
          <el-form-item prop="username" class="lt-md:mb-5">
            <el-input v-model="loginForm.username" placeholder="请输入用户名或邮箱" />
          </el-form-item>

          <el-form-item prop="password">
            <el-input v-model="loginForm.password" type="password" placeholder="请输入密码" show-password />
          </el-form-item>
        </div>
        <div v-else key="email" class="form-content">
          <el-form-item prop="email" class="lt-md:mb-5">
            <el-input v-model="loginForm.email" placeholder="请输入邮箱地址" />
          </el-form-item>

          <el-form-item prop="emailCode">
            <div class="verify-code-container">
              <el-input v-model="loginForm.emailCode" placeholder="请输入验证码" class="verify-code-input" />
              <el-button
                :disabled="!canSendCode || isCountingDown"
                class="verify-code-btn lt-md:text-sm lt-md:w-[100px]"
                :class="{ 'is-disabled': !canSendCode || isCountingDown }"
                @click="sendVerificationCode"
              >
                {{ codeButtonText }}
              </el-button>
            </div>
          </el-form-item>
        </div>
      </transition>
    </div>

    <el-button
      type="primary"
      :loading="loading"
      class="submit-btn animate-button w-full lt-md:text-sm"
      @click="login"
    >
      {{ loginForm.loginType === 'password' ? '登录' : '验证并登录' }}
    </el-button>
  </el-form>
</template>

<script setup lang="ts">
import { ElMessage } from 'element-plus';
// import { sendEmailCodeApi } from '@/api/auth';
import { useVerifycode } from '@/hooks/useVerifycode';
import useLoginAndRegister from '@/views/login/hook';

const { loading, loginForm, login, formRef, loginRules } = useLoginAndRegister();
const { isCountingDown, codeButtonText } = useVerifycode();
const { canSendCode, sendVerificationCode } = useSendEmailCode();

// 发送邮箱验证码
function useSendEmailCode() {
  const canSendCode = computed(() => {
    return loginForm.loginType === 'email' && loginForm.email && !isCountingDown.value;
  });

  const sendVerificationCode = async () => {
    try {
      // const { success, message } = await sendEmailCodeApi(loginForm.email);
      // if (success) {
      //   ElMessage.success('验证码已发送至您的邮箱');
      //   startCountdown();
      // } else {
      //   ElMessage.error(message || '验证码发送失败，请稍后重试');
      // }
    } catch {
      ElMessage.error('验证码发送失败，请稍后重试');
    }
  };

  return {
    canSendCode,
    sendVerificationCode
  };
}

const switchLoginType = (type: 'password' | 'email') => {
  if (loginForm.loginType === type) return;
  loginForm.loginType = type;
  formRef.value?.clearValidate();
};
</script>

<style scoped lang="scss">
@use '../styles/forms.scss';

// 添加登录类型下划线样式
.login-type-item {
  position: relative;
  padding: 4px 8px;

  &::after {
    position: absolute;
    bottom: -8px;
    left: 50%;
    width: 0;
    height: 2px;
    content: '';
    background-color: var(--el-color-primary);
    opacity: 0;
    transition: all 0.3s ease-in-out;
    transform: translateX(-50%);
  }

  &:hover::after {
    width: 20px;
    opacity: 0.5;
  }

  &.text-primary::after {
    width: 30px;
    opacity: 1;
  }
}
</style>
