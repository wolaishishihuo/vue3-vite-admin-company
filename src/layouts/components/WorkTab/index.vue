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
          {{ item.meta.title || '123' }}
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
    <div class="right">
      <el-icon
        class="btn"
        @click="(e: MouseEvent) => showMenu(e, activeTab)"
      >
        <ArrowDown />
      </el-icon>
    </div>
    <RightMenu
      ref="menuRef"
      :menu-items="menuItems"
      :menu-width="140"
      :border-radius="10"
      @select="handleSelect"
    />
  </div>
</template>

<script setup lang="ts">
import { useWorkTabMenu } from '@/layouts/hooks/useWorkTabMenu';
import { useWorkTabOperations } from '@/layouts/hooks/useWorkTabOperations';
import { useWorkTabScroll } from '@/layouts/hooks/useWorkTabScroll';
import { useWorktabStore } from '@/store/modules/workTab';

// 初始化必要的引用和状态
const scrollRef = ref<HTMLElement | null>(null); // 滚动容器引用
const tabsRef = ref<HTMLElement | null>(null); // 标签列表容器引用
const worktabStore = useWorktabStore();

const list = computed(() => worktabStore.opened);

const {
  translateX,
  transition,
  activeTab,
  worktabClosePosition
} = useWorkTabScroll(list, scrollRef, tabsRef);

const { menuRef, clickedPath, menuItems, showMenu } = useWorkTabMenu(list, activeTab);

const { clickTab, closeWorktab, handleSelect } = useWorkTabOperations(
  list,
  activeTab,
  clickedPath,
  worktabClosePosition
);
</script>

<style scoped lang="scss">
@use './index';
</style>
