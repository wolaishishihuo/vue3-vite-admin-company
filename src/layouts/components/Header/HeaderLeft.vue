<template>
  <div class="logo" :style="{ width: menuCollapse ? `${defaultMenuCollapseWidth}px` : `${defaultMenuWidth}px` }">
    <div class="h-50 w-full" :class="menuCollapse ? 'i-svg:app' : 'i-svg:logo'" />
  </div>
  <div class="cursor-pointer">
    <el-icon @click="visibleMenu">
      <component :is="menuCollapse ? 'Expand' : 'Fold'" />
    </el-icon>
  </div>
</template>

<script setup lang="ts">
import appConfig from '@/config';
import { useSettingStore } from '@/store/modules/setting';

const { defaultMenuCollapseWidth, defaultMenuWidth } = appConfig.systemSetting;

const settingStore = useSettingStore();
const menuCollapse = computed(() => settingStore.menuOpen);
const visibleMenu = () => {
  settingStore.setMenuOpen(!settingStore.menuOpen);
  settingStore.setMenuOpenWidth(menuCollapse.value ? defaultMenuCollapseWidth : defaultMenuWidth);
};
</script>

<style scoped lang="scss"></style>
