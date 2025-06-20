<template>
  <div class="externalLinkIcon" :style="externalIconStyle">
    <span class="svgContainer" @click="goToLink(iconlink)">
      <div :class="`i-svg:${iconName}`" :style="iconStyle" />
    </span>
    <span class="svgBG" />
  </div>
</template>

<script setup lang="ts">
defineProps({
  iconStyle: {
    type: Object,
    default: () => {
      return {
        width: '25px',
        height: '25px'
      };
    }
  },
  iconName: {
    type: String,
    default: () => {
      return '';
    }
  },
  iconlink: {
    type: String,
    default: () => {
      return '';
    }
  },
  externalIconStyle: {
    type: Object,
    default: () => {
      return {
        width: '45px',
        height: '45px'
      };
    }
  }
});
const goToLink = (link: string) => {
  window.open(link);
};
</script>

<style scoped lang="scss">
@use './index';
</style>
