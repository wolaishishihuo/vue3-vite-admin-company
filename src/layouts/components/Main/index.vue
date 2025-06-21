<template>
  <el-main>
    <div class="layout-content" :style="containerStyle">
      <router-view
        v-if="isRefresh"
        v-slot="{ Component, route }"
        :style="{ minHeight: containerMinHeight }"
      >
        <transition appear :name="pageTransition" mode="out-in">
          <keep-alive :max="10" :exclude="keepAliveExclude">
            <component :is="createComponentWrapper(Component, route)" :key="route.fullPath" />
          </keep-alive>
        </transition>
      </router-view>
    </div>
  </el-main>
</template>

<script setup lang="ts">
import { useCommon } from '@/hooks/useCommon';
import { useSettingStore } from '@/store/modules/setting';
import { useWorktabStore } from '@/store/modules/workTab';

const { pageTransition, containerWidth, refresh } = storeToRefs(useSettingStore());
const { keepAliveExclude } = storeToRefs(useWorktabStore());

const { containerMinHeight } = useCommon();

const containerStyle = computed(() => {
  return {
    maxWidth: containerWidth.value
  };
});

const isRefresh = ref(true);
const reload = () => {
  console.log('reload');
  isRefresh.value = false;
  nextTick(() => {
    isRefresh.value = true;
  });
};

watch(refresh, reload);
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

</style>
