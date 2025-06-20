import type { LocationQueryRaw } from 'vue-router';
import type { MenuItemType } from '@/components/RightMenu/index.vue';
import { useCommon } from '@/hooks/useCommon';
import { useWorktabStore } from '@/store/modules/workTab';

export function useWorkTabOperations(
  list: Ref<any[]>,
  activeTab: Ref<string>,
  clickedPath: Ref<string>,
  worktabClosePosition: () => void
) {
  const router = useRouter();
  const worktabStore = useWorktabStore();

  // 标签页操作方法
  const clickTab = (item: any) => {
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

  // 处理右键菜单选择
  const handleSelect = (item: MenuItemType) => {
    const { key } = item;

    // 刷新页面操作
    if (key === 'refresh') {
      useCommon().refresh();
      return;
    }

    // 固定
    if (key === 'fixed') {
      useWorktabStore().toggleFixedTab(clickedPath.value);
      return;
    }

    const activeIndex = list.value.findIndex(tab => tab.path === activeTab.value);
    const clickedIndex = list.value.findIndex(tab => tab.path === clickedPath.value);

    // 定义需要导航的操作类型
    const navigationRules = {
      left: activeIndex < clickedIndex,
      right: activeIndex > clickedIndex,
      other: true
    } as const;

    // 处理标签跳转逻辑
    const shouldNavigate = navigationRules[key as keyof typeof navigationRules];

    if (shouldNavigate) {
      router.push(clickedPath.value);
    }

    // 关闭标签页
    closeWorktab(key, clickedPath.value);
  };

  return {
    clickTab,
    closeWorktab,
    handleSelect
  };
}
