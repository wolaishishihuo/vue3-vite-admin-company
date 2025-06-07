<template>
    <div class="theme">
        <SvgIcon :name="isDark ? 'sun' : 'moon'" @click="toggleTheme" :icon-style="{ width: '25px', height: '25px' }" />
    </div>
</template>

<script setup lang="ts">
import SvgIcon from '@/components/SvgIcon/index.vue';
import { ref } from 'vue';

const isDark = ref(false);
const toggleTheme = (event: MouseEvent) => {
    const x = event.clientX;
    const y = event.clientY;
    const endRadius = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));
    let isDark: boolean;
    const transition = (document as any).startViewTransition(() => {
        const root = document.documentElement;
        isDark = root.classList.contains('dark');
        root.classList.remove(isDark ? 'dark' : 'light');
        root.classList.add(isDark ? 'light' : 'dark');
    });
    transition.ready.then(() => {
        const clipPath = [`circle(0px at ${x}px ${y}px)`, `circle(${endRadius}px at ${x}px ${y}px)`];
        document.documentElement.animate(
            {
                clipPath: isDark ? [...clipPath].reverse() : clipPath
            },
            {
                duration: 500,
                easing: 'ease-in',
                pseudoElement: isDark ? '::view-transition-old(root)' : '::view-transition-new(root)'
            }
        );
    });
};
</script>
<style scoped lang="scss"></style>
