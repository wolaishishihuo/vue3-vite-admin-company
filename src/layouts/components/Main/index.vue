<template>
    <el-main>
        <router-view v-slot="{ Component, route }">
            <transition appear name="fade-transform" mode="out-in">
                <keep-alive :include="['dashboard']">
                    <component class="container" :is="createComponentWrapper(Component, route)" v-if="isRouterShow" :key="route.fullPath" />
                </keep-alive>
            </transition>
        </router-view>
    </el-main>
</template>

<script setup lang="ts">
import { ref, provide, h } from 'vue';

// 注入刷新页面方法
const isRouterShow = ref(true);
const refreshCurrentPage = (val: boolean) => (isRouterShow.value = val);
provide('refresh', refreshCurrentPage);

/**
 * 创建组件包装器以解决 keep-alive 和动态组件的问题
 * 1. 为每个路由组件创建唯一的包装组件，使其具有唯一的组件名(路由路径)
 * 2. 包装组件通过 render 函数渲染原始组件
 * 3. 缓存包装组件避免重复创建
 */
const wrapperMap = new Map();
function createComponentWrapper(component, route) {
    if (!component) return;

    // 使用路由完整路径作为包装器名称
    const wrapperName = route.fullPath;
    let wrapper = wrapperMap.get(wrapperName);
    // 如果包装器不存在则创建新的包装器
    if (!wrapper) {
        wrapper = {
            name: wrapperName,
            render: () => h(component)
        };
        wrapperMap.set(wrapperName, wrapper);
    }
    return h(wrapper);
}
</script>

<style scoped lang="scss">
.el-main {
    box-sizing: border-box;
    height: 100%;
    padding: map-get($spacings, '5');
    overflow: hidden;
    background-color: var(--el-bg-color-page);
}
</style>
