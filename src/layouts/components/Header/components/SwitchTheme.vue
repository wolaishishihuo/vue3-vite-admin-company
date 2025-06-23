<template>
  <div class="theme">
    <el-icon @click="themeAnimation">
      <component :is="isDark ? 'Sunny' : 'Moon'" />
    </el-icon>
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
