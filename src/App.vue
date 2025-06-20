<template>
  <router-view />
</template>

<script setup lang="ts">
import { setThemeTransitionClass } from './utils/theme/animation';

onBeforeMount(() => {
  setThemeTransitionClass(true);
});

onMounted(() => {
  // 提升暗黑主题下页面刷新视觉体验
  setThemeTransitionClass(false);
});
</script>
