<template>
  <div class="work-tab">
    <div ref="scrollRef" class="scroll-view">
      <ul
        ref="tabsRef"
        class="tabs"
        :style="{ transform: `translateX(${translateX}px)`, transition: `${transition}` }"
      >
        <li
          v-for="(item, index) in list"
          :id="`scroll-li-${index}`"
          :key="item.path"
          :ref="item.path"
          class="art-custom-card"
          :class="{ 'activ-tab': item.path === activeTab }"
          :style="{ padding: item.meta.isAffix ? '0 10px' : '0 8px 0 12px' }"
          @click="clickTab(item)"
          @contextmenu.prevent="(e: MouseEvent) => showMenu(e, item.path)"
        >
          {{ item.meta.title }}
          <el-icon
            v-if="list.length > 1 && !item.meta.isAffix"
            @click.stop="closeWorktab('current', item.path)"
          >
            <Close />
          </el-icon>
          <div class="line" />
        </li>
      </ul>
    </div>
    <div class="work-tab-right" />
  </div>
</template>

<script setup lang="ts">
import type { LocationQueryRaw } from 'vue-router';
import { useWorktabStore } from '@/store/modules/workTab';

const worktabStore = useWorktabStore();

const scrollRef = ref<HTMLElement | null>(null); // 滚动容器引用
const tabsRef = ref<HTMLElement | null>(null); // 标签列表容器引用
const router = useRouter();

const translateX = ref(0); // 标签列表水平偏移量
const transition = ref(''); // 过渡动画样式
const clickedPath = ref(''); // 当前点击的标签路径

// 打开的标签页列表
const list = computed(() => worktabStore.opened);
// 当前激活的标签页
const activeTab = computed(() => router.currentRoute.value.path);
// 获取当前激活 tab 的 index
const activeTabIndex = computed(() => list.value.findIndex(tab => tab.path === activeTab.value));

// 标签页操作方法
const clickTab = (item: Menu.MenuOptions) => {
  router.push({
    path: item.path,
    query: item.query as LocationQueryRaw
  });
};

// 关闭标签页的不同方式
const closeWorktab = (type: string, tabPath: string) => {
  const path = typeof tabPath === 'string' ? tabPath : router.currentRoute.value.path;

  switch (type) {
    case 'current':
      worktabStore.removeTab(path);
      break;
    case 'left':
      worktabStore.removeLeft(path);
      break;
    case 'right':
      worktabStore.removeRight(path);
      break;
    case 'other':
      worktabStore.removeOthers(path);
      break;
    case 'all':
      worktabStore.removeAll();
      break;
  }

  setTimeout(() => {
    worktabClosePosition();
  }, 100);
};

// 获取当前标签页索引和元素
const getCurTabEl = () =>
  document.getElementById(`scroll-li-${activeTabIndex.value}`) as HTMLElement;

// 关闭标签页后的位置调整
const worktabClosePosition = () => {
  if (!scrollRef.value || !tabsRef.value) return;

  const curTabEl = getCurTabEl();
  if (!curTabEl) return;

  const { offsetLeft, clientWidth } = curTabEl;
  const scrollWidth = scrollRef.value.offsetWidth;
  const ulWidth = tabsRef.value.offsetWidth;
  const curTabLeft = offsetLeft + clientWidth;

  requestAnimationFrame(() => {
    translateX.value = curTabLeft > scrollWidth ? scrollWidth - ulWidth : 0;
  });
};

// 右键菜单相关方法
const showMenu = (e: MouseEvent, path?: string) => {
  clickedPath.value = path || '';
  // menuRef.value?.show(e);
  e.preventDefault();
  e.stopPropagation();
};
</script>

<style scoped lang="scss"></style>
