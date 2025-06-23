<template>
  <div class="setting-header">
    <div class="close-wrap">
      <el-icon class="iconfont-sys" @click="$emit('close')">
        <Close />
      </el-icon>
    </div>
  </div>
</template>

<script setup lang="ts">
defineEmits<{
  close: [];
}>();
</script>

<style lang="scss" scoped>
  .setting-header {
  .close-wrap {
    display: flex;
    justify-content: flex-end;

    i {
      display: block;
      // padding: 8px;
      font-size: 15px;
      font-weight: bold;
      color: var(--art-gray-600);
      cursor: pointer;
      border-radius: 5px;

      &:hover {
        color: var(--art-gray-700);
        background-color: rgb(var(--art-gray-300-rgb), 0.5);
      }
    }
  }
}
</style>
