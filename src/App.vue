<template>
  <ElConfigProvider size="default" :locale="zh" :z-index="3000">
    <RouterView />
  </ElConfigProvider>
</template>

<script setup lang="ts">
import zh from 'element-plus/es/locale/lang/zh-cn';
import { setThemeTransitionClass } from './utils/theme/animation';

onBeforeMount(() => {
  setThemeTransitionClass(true);
});

onMounted(() => {
  // 提升暗黑主题下页面刷新视觉体验
  setThemeTransitionClass(false);
});
</script>
