<template>
  <div class="setting" @click="handleSetting">
    <el-icon><Setting /></el-icon>
  </div>
</template>

<script setup lang="ts">
import { mittBus } from '@/utils/sys';

const handleSetting = () => {
  mittBus.emit('openSettingPanel');
};
</script>

<style scoped lang="scss"></style>
