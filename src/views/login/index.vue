<template>
  <div class="login-container">
    <div class="login-box flex lt-md:flex-col">
      <div class="login-left lt-md:hidden" :class="{ 'is-register': isRegister }">
        <transition name="image-fade" mode="out-in">
          <div :key="isRegister ? 'register' : 'login'" class="left-content">
            <div class="animated-text">
              {{ isRegister ? 'Join\nUs' : 'Welcome\nBack' }}
            </div>
            <div class="animated-circles">
              <div class="circle" />
              <div class="circle" />
              <div class="circle" />
            </div>
          </div>
        </transition>
      </div>
      <div class="login-content lt-md:mx-auto lt-md:max-w-[460px] lt-md:w-full">
        <transition name="fade" mode="out-in">
          <h2 :key="isRegister ? 'register' : 'login'" class="welcome-title text-3xl lt-md:text-2xl">
            {{ isRegister ? 'Create Account' : 'Welcome Back!' }}
          </h2>
        </transition>
        <transition name="fade" mode="out-in">
          <p :key="isRegister ? 'register' : 'login'" class="welcome-desc text-base lt-md:text-sm">
            {{ isRegister ? 'Please fill in the form to create your account' : 'Please sign in to continue' }}
          </p>
        </transition>

        <div class="form-container">
          <transition name="form-fade" mode="out-in">
            <div :key="isRegister ? 'register' : 'login'" class="form-wrapper">
              <LoginForm v-if="!isRegister" />
              <RegisterForm v-if="isRegister" />
            </div>
          </transition>
        </div>

        <div class="switch-form">
          <span class="text-gray-600">
            {{ !isRegister ? "Don't have an account?" : "Already have an account?" }}
          </span>
          <el-link
            type="primary"
            :underline="false"
            class="font-medium ml-1"
            @click="!isRegister ? goRegister() : back()"
          >
            {{ !isRegister ? "Sign up now" : "Sign in" }}
          </el-link>
        </div>

        <div class="flex gap-15 justify-center">
          <ExternalLinkIcons v-for="icon in externalLinkIcons" :key="icon.name" :icon-name="icon.name" :iconlink="icon.link" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts" name="login">
import { externalLinkIcons } from '@/config/constant';
import LoginForm from './components/LoginForm.vue';
import RegisterForm from './components/RegisterForm.vue';
import useLoginAndRegister from './hook';

const { isRegister, back, goRegister } = useLoginAndRegister();
</script>

<style scoped lang="scss">
@use './index';
</style>
