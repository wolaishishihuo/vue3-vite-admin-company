<template>
    <el-container class="layout">
        <el-header>
            <div class="header-lf mask-image">
                <HeaderLeft />
            </div>
            <div class="header-ri">
                <HeaderRight />
            </div>
        </el-header>
        <el-container class="classic-content">
            <el-aside>
                <div class="aside-box" :style="{ width: '210px' }">
                    <el-scrollbar>
                        <el-menu :router="false" :default-active="activeMenu" :unique-opened="true" :collapse-transition="false">
                            <SubMenu :menu-list="menuList" />
                        </el-menu>
                    </el-scrollbar>
                </div>
            </el-aside>
            <el-container class="classic-main">
                <Main />
            </el-container>
        </el-container>
    </el-container>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import { useAuthStore } from '@/stores/modules/auth';
import HeaderRight from './components/Header/HeaderRight.vue';
import HeaderLeft from './components/Header/HeaderLeft.vue';
import SubMenu from '@/layouts/components/SubMenu/index.vue';
import Main from '@/layouts/components/Main/index.vue';
import { filterHiddenMenus, processMenuItems } from '@/utils/menu';

const route = useRoute();
const authStore = useAuthStore();

const menuList = computed(() => {
    const rawMenuList = authStore.authMenuListGet;
    const processedMenuList = processMenuItems(rawMenuList);
    return filterHiddenMenus(processedMenuList);
});

const activeMenu = computed(() => (route.meta.activeMenu ? route.meta.activeMenu : route.path) as string);
</script>
<style scoped lang="scss">
@import './index';
</style>
