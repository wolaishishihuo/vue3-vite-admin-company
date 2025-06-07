<template>
  <el-form ref="formRef" :model="registerForm" :rules="loginRules" size="large" class="auth-form">
    <el-form-item prop="username">
      <el-input v-model="registerForm.username" placeholder="请输入用户名" autocomplete="off">
        <template #prefix>
          <el-icon class="el-input__icon text-gray-400">
            <User />
          </el-icon>
        </template>
      </el-input>
    </el-form-item>
    <el-form-item prop="email">
      <el-input v-model="registerForm.email" placeholder="请输入邮箱" autocomplete="off">
        <template #prefix>
          <el-icon class="el-input__icon text-gray-400">
            <Message />
          </el-icon>
        </template>
      </el-input>
    </el-form-item>
    <el-form-item prop="password">
      <el-input v-model="registerForm.password" type="password" placeholder="请输入密码" show-password autocomplete="new-password">
        <template #prefix>
          <el-icon class="el-input__icon text-gray-400">
            <Lock />
          </el-icon>
        </template>
      </el-input>
    </el-form-item>
    <el-form-item prop="confirmPassword" class="mt-6 lt-md:mt-4">
      <el-input v-model="registerForm.confirmPassword" type="password" placeholder="请输入确认密码" show-password autocomplete="new-password">
        <template #prefix>
          <el-icon class="el-input__icon text-gray-400">
            <Lock />
          </el-icon>
        </template>
      </el-input>
    </el-form-item>
    <!-- <el-form-item prop="captchaValue">
            <Captcha v-model:captcha_value="registerForm.captchaValue" v-model:captcha_key="registerForm.captchaKey" />
        </el-form-item> -->
  </el-form>
  <el-button
    class="submit-btn w-full lt-md:text-sm"
    :icon="UserFilled"
    round
    size="large"
    type="primary"
    :loading="loading"
    @click="register()"
  >
    注册
  </el-button>
</template>

<script setup lang="ts">
import type { FormRules } from 'element-plus';
import { Lock, Message, User, UserFilled } from '@element-plus/icons-vue';
import { checkEmail } from '@/utils/validate';
import useLoginAndRegister from '@/views/login/hook';

const loginRules: FormRules = reactive({
  username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  email: [
    {
      required: true,
      validator: checkEmail,
      trigger: 'blur'
    }
  ],
  password: [
    {
      required: true,
      message: '请输入密码',
      trigger: 'blur'
    }
  ],
  confirmPassword: [
    {
      required: true,
      validator: (_: any, value: any, callback: any) => {
        if (value) {
          if (value !== registerForm.password) {
            callback(new Error('俩次密码不一致'));
          } else {
            callback();
          }
        } else {
          callback(new Error('请输入确认密码'));
        }
      },
      trigger: ['change', 'blur']
    }
  ]
  // captchaValue: [{ required: true, message: '请输入验证码', trigger: 'blur' }]
});
const { loading, registerForm, register, monitorEnter, formRef } = useLoginAndRegister();

onMounted(() => {
  // 监听 enter 事件（调用注册）
  monitorEnter(() => {
    register();
  });
});
</script>

<style scoped lang="scss">
@import '../styles/forms.scss';
</style>
