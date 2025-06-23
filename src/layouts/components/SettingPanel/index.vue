<template>
  <div class="setting-panel">
    <el-drawer
      v-model="drawer"
      size="300px"
      :with-header="false"
      :lock-scroll="false"
      :destroy-on-close="false"
      modal-class="setting-modal"
      :before-close="handleBeforeClose"
      @open="handleOpen"
      @close="handleDrawerClose"
    >
      <div class="setting-panel-content">
        <SettingHeader @close="handleDrawerClose" />
        <ColorSetting />
      </div>
    </el-drawer>
  </div>
</template>

<script setup lang="ts">
import { mittBus } from '@/utils/sys';
import ColorSetting from './components/ColorSetting.vue';
import SettingHeader from './components/SettingHeader.vue';

const drawer = ref(false);

mittBus.on('openSettingPanel', () => {
  handleOpen();
});

const handleOpen = () => {
  drawer.value = true;
};

const handleDrawerClose = () => {
  drawer.value = false;
};

const handleBeforeClose = () => {
  drawer.value = false;
};
</script>

<style scoped lang="scss"></style>
