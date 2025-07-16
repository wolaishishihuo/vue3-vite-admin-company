<template>
  <div class="transition-all duration-300" :style="{ width: `${menuOpenWidth}px` }">
    <div class="h-50 w-full" :class="logoClass" />
  </div>
  <div
    class="transition-transform duration-300 hover:scale-110 hover:bg-gray-100 dark:hover:bg-gray-800"
    @click="visibleMenu"
  >
    <el-icon class="text-lg">
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
const menuOpenWidth = computed(() => settingStore.menuOpenWidth);

const logoClass = computed(() => {
  if (menuCollapse.value) {
    return isDark.value ? 'i-svg:logo-small-dark' : 'i-svg:logo-small-light';
  }
  return isDark.value ? 'i-svg:logo-large-dark' : 'i-svg:logo-large-light';
});

const visibleMenu = (): void => {
  settingStore.setMenuOpen(!settingStore.menuOpen);
  settingStore.setMenuOpenWidth(menuCollapse.value ? defaultMenuCollapseWidth : defaultMenuWidth);
};
</script>

<style scoped lang="scss"></style>
