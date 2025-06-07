<template>
  <div class="logo">
    <!-- <SvgIcon @click="goHome" name="logo" :icon-style="{ width: '100px', height: '50px' }" /> -->
  </div>
</template>

<script setup lang="ts">
// import SvgIcon from '@/components/SvgIcon/index.vue';

const title = import.meta.env.VITE_GLOB_APP_TITLE;

const router = useRouter();
const goHome = () => {
  router.replace('/');
};
</script>

<style scoped lang="scss"></style>
