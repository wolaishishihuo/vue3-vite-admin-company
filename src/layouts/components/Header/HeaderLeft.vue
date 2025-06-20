<template>
  <div class="logo" :style="{ width: menuCollapse ? `${defaultMenuCollapseWidth}px` : `${defaultMenuWidth}px` }">
    <div class="h-50 w-full" :class="menuCollapse ? isDark ? 'i-svg:logo-small-dark' : 'i-svg:logo-small-light' : isDark ? 'i-svg:logo-large-dark' : 'i-svg:logo-large-light'" />
  </div>
  <div class="cursor-pointer">
    <el-icon @click="visibleMenu">
      <component :is="menuCollapse ? 'Expand' : 'Fold'" />
    </el-icon>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';
import appConfig from '@/config';
import { useSettingStore } from '@/store/modules/setting';

const { defaultMenuCollapseWidth, defaultMenuWidth } = appConfig.systemSetting;

const settingStore = useSettingStore();
const { isDark } = storeToRefs(settingStore);

const menuCollapse = computed(() => settingStore.menuOpen);
const visibleMenu = () => {
  settingStore.setMenuOpen(!settingStore.menuOpen);
  settingStore.setMenuOpenWidth(menuCollapse.value ? defaultMenuCollapseWidth : defaultMenuWidth);
};
</script>

<style scoped lang="scss"></style>
