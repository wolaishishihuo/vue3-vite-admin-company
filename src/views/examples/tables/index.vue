<!-- 表格示例页面 -->
<template>
  <div class="tables-container">
    <RouterView />
  </div>
</template>

<script setup lang="ts">
defineOptions({ name: 'TablesExamples' });
</script>

<style scoped>
.tables-container {
  height: 100%;
}
</style>
