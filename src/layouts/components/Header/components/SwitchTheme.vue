<template>
  <div class="theme">
    <div :class="`i-svg:${isDark ? 'sun' : 'moon'}`" style="width: 25px; height: 25px" @click="themeAnimation" />
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { useSettingStore } from '@/store/modules/setting';
import { themeAnimation } from '@/utils/theme/animation';

const settingStore = useSettingStore();
const { isDark } = storeToRefs(settingStore);
</script>

<style scoped lang="scss"></style>
