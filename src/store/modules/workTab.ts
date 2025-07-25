import type { LocationQueryRaw, Router } from 'vue-router';
import { defineStore } from 'pinia';
import { computed, ref } from 'vue';
import { HOME_URL } from '@/config/index';
import router from '@/router';

/**
 * 工作台标签页管理 Store
 */
export const useWorktabStore = defineStore(
  'worktabStore',
  () => {
    // 状态定义
    const current = ref<Partial<Menu.MenuOptions>>({});
    const opened = ref<Menu.MenuOptions[]>([]);
    const keepAliveExclude = ref<string[]>([]);

    // 计算属性
    const hasOpenedTabs = computed(() => opened.value.length > 0);
    const hasMultipleTabs = computed(() => opened.value.length > 1);
    const currentTabIndex = computed(() =>
      current.value.path ? opened.value.findIndex(tab => tab.path === current.value.path) : -1
    );

    /**
     * 查询对象比较
     */
    const areQueriesEqual = (
      query1: LocationQueryRaw | undefined,
      query2: LocationQueryRaw | undefined
    ): boolean => {
      if (!query1 && !query2) return true;
      if (!query1 || !query2) return false;
      return JSON.stringify(query1) === JSON.stringify(query2);
    };

    /**
     * 查找标签页索引
     */
    const findTabIndex = (path: string): number => {
      return opened.value.findIndex(tab => tab.path === path);
    };

    /**
     * 获取标签页
     */
    const getTab = (path: string): Menu.MenuOptions | undefined => {
      return opened.value.find(tab => tab.path === path);
    };

    /**
     * 检查标签页是否可关闭
     */
    const isTabClosable = (tab: Menu.MenuOptions): boolean => {
      return !tab.meta.isAffix;
    };

    /**
     * 安全的路由跳转
     */
    const safeRouterPush = (tab: Partial<Menu.MenuOptions>): void => {
      if (!tab.path) {
        console.warn('尝试跳转到无效路径的标签页');
        return;
      }

      try {
        router.push({
          path: tab.path,
          query: tab.query as LocationQueryRaw
        });
      } catch (error) {
        console.error('路由跳转失败:', error);
      }
    };

    /**
     * 打开或激活一个选项卡
     */
    const openTab = (tab: Menu.MenuOptions): void => {
      if (!tab.path) {
        console.warn('尝试打开无效的标签页');
        return;
      }

      // 从 keepAlive 排除列表中移除
      if (tab.name) {
        removeKeepAliveExclude(tab.name);
      }

      const existingIndex = findTabIndex(tab.path);
      if (existingIndex === -1) {
        // 新增标签页
        const insertIndex = tab.meta.isAffix ? findFixedTabInsertIndex() : opened.value.length;
        const newTab = { ...tab };

        if (tab.meta.isAffix) {
          opened.value.splice(insertIndex, 0, newTab);
        } else {
          opened.value.push(newTab);
        }

        current.value = newTab;
      } else {
        // 更新现有标签页
        const existingTab = opened.value[existingIndex];

        if (!areQueriesEqual(existingTab.query, tab.query)) {
          opened.value[existingIndex] = {
            ...existingTab,
            query: tab.query,
            meta: {
              ...existingTab.meta,
              title: tab.meta.title || existingTab.meta.title
            }
          };
        }

        current.value = opened.value[existingIndex];
      }
    };

    /**
     * 查找固定标签页的插入位置
     */
    const findFixedTabInsertIndex = (): number => {
      let insertIndex = 0;
      for (let i = 0; i < opened.value.length; i++) {
        if (opened.value[i].meta.isAffix) {
          insertIndex = i + 1;
        } else {
          break;
        }
      }
      return insertIndex;
    };

    /**
     * 关闭指定的选项卡
     */
    const removeTab = (path: string): void => {
      const targetTab = getTab(path);
      const targetIndex = findTabIndex(path);

      if (targetIndex === -1) {
        console.warn(`尝试关闭不存在的标签页: ${path}`);
        return;
      }

      if (targetTab && !isTabClosable(targetTab)) {
        console.warn(`尝试关闭固定标签页: ${path}`);
        return;
      }

      // 从标签页列表中移除
      opened.value.splice(targetIndex, 1);

      // 处理缓存排除
      if (targetTab?.name) {
        addKeepAliveExclude(targetTab);
      }

      // 如果关闭后无标签页，跳转首页
      if (!hasOpenedTabs.value) {
        if (path !== HOME_URL) {
          current.value = {};
          safeRouterPush({ path: HOME_URL });
        }
        return;
      }

      // 如果关闭的是当前激活标签，需要激活其他标签
      if (current.value.path === path) {
        const newIndex = targetIndex >= opened.value.length ? opened.value.length - 1 : targetIndex;
        current.value = opened.value[newIndex];
        safeRouterPush(current.value);
      }
    };

    /**
     * 关闭左侧选项卡
     */
    const removeLeft = (path: string): void => {
      const targetIndex = findTabIndex(path);

      if (targetIndex === -1) {
        console.warn(`尝试关闭左侧标签页，但目标标签页不存在: ${path}`);
        return;
      }

      // 获取左侧可关闭的标签页
      const leftTabs = opened.value.slice(0, targetIndex);
      const closableLeftTabs = leftTabs.filter(isTabClosable);

      if (closableLeftTabs.length === 0) {
        console.warn('左侧没有可关闭的标签页');
        return;
      }

      // 标记为缓存排除
      markTabsToRemove(closableLeftTabs);

      // 移除左侧可关闭的标签页
      opened.value = opened.value.filter(
        (tab, index) => index >= targetIndex || !isTabClosable(tab)
      );

      // 确保当前标签是激活状态
      const targetTab = getTab(path);
      if (targetTab) {
        current.value = targetTab;
      }
    };

    /**
     * 关闭右侧选项卡
     */
    const removeRight = (path: string): void => {
      const targetIndex = findTabIndex(path);

      if (targetIndex === -1) {
        console.warn(`尝试关闭右侧标签页，但目标标签页不存在: ${path}`);
        return;
      }

      // 获取右侧可关闭的标签页
      const rightTabs = opened.value.slice(targetIndex + 1);
      const closableRightTabs = rightTabs.filter(isTabClosable);

      if (closableRightTabs.length === 0) {
        console.warn('右侧没有可关闭的标签页');
        return;
      }

      // 标记为缓存排除
      markTabsToRemove(closableRightTabs);

      // 移除右侧可关闭的标签页
      opened.value = opened.value.filter(
        (tab, index) => index <= targetIndex || !isTabClosable(tab)
      );

      // 确保当前标签是激活状态
      const targetTab = getTab(path);
      if (targetTab) {
        current.value = targetTab;
      }
    };

    /**
     * 关闭其他选项卡
     */
    const removeOthers = (path: string): void => {
      const targetTab = getTab(path);

      if (!targetTab) {
        console.warn(`尝试关闭其他标签页，但目标标签页不存在: ${path}`);
        return;
      }

      // 获取其他可关闭的标签页
      const otherTabs = opened.value.filter(tab => tab.path !== path);
      const closableTabs = otherTabs.filter(isTabClosable);

      if (closableTabs.length === 0) {
        console.warn('没有其他可关闭的标签页');
        return;
      }

      // 标记为缓存排除
      markTabsToRemove(closableTabs);

      // 只保留当前标签和固定标签
      opened.value = opened.value.filter(tab => tab.path === path || !isTabClosable(tab));

      // 确保当前标签是激活状态
      current.value = targetTab;
    };

    /**
     * 关闭所有可关闭的标签页
     */
    const removeAll = (): void => {
      const hasFixedTabs = opened.value.some(tab => tab.meta.isAffix);

      // 获取可关闭的标签页
      const closableTabs = opened.value.filter((tab) => {
        if (!isTabClosable(tab)) return false;
        // 如果有固定标签，则所有可关闭的都可以关闭；否则保留首页
        return hasFixedTabs || tab.path !== HOME_URL;
      });

      if (closableTabs.length === 0) {
        console.warn('没有可关闭的标签页');
        return;
      }

      // 标记为缓存排除
      markTabsToRemove(closableTabs);

      // 保留不可关闭的标签页和首页（当没有固定标签时）
      opened.value = opened.value.filter((tab) => {
        return !isTabClosable(tab) || (!hasFixedTabs && tab.path === HOME_URL);
      });

      // 处理激活状态
      if (!hasOpenedTabs.value) {
        current.value = {};
        safeRouterPush({ path: HOME_URL });
        return;
      }

      // 选择激活的标签页：优先首页，其次第一个可用标签
      const homeTab = opened.value.find(tab => tab.path === HOME_URL);
      const targetTab = homeTab || opened.value[0];

      current.value = targetTab;
      safeRouterPush(targetTab);
    };

    /**
     * 将指定选项卡添加到 keepAlive 排除列表中
     */
    const addKeepAliveExclude = (tab: Menu.MenuOptions): void => {
      if (!tab.meta.isKeepAlive || !tab.name) return;

      if (!keepAliveExclude.value.includes(tab.name)) {
        keepAliveExclude.value.push(tab.name);
      }
    };

    /**
     * 从 keepAlive 排除列表中移除指定组件名称
     */
    const removeKeepAliveExclude = (name: string): void => {
      if (!name) return;

      keepAliveExclude.value = keepAliveExclude.value.filter(item => item !== name);
    };

    /**
     * 将传入的一组选项卡的组件名称标记为排除缓存
     */
    const markTabsToRemove = (tabs: Menu.MenuOptions[]): void => {
      tabs.forEach((tab) => {
        if (tab.name) {
          addKeepAliveExclude(tab);
        }
      });
    };

    /**
     * 切换指定标签页的固定状态
     */
    const toggleFixedTab = (path: string): void => {
      const targetIndex = findTabIndex(path);

      if (targetIndex === -1) {
        console.warn(`尝试切换不存在标签页的固定状态: ${path}`);
        return;
      }

      const tab = { ...opened.value[targetIndex] };
      tab.meta.isAffix = !tab.meta.isAffix;

      // 移除原位置
      opened.value.splice(targetIndex, 1);

      if (tab.meta.isAffix) {
        // 固定标签插入到所有固定标签的末尾
        const firstNonFixedIndex = opened.value.findIndex(t => !t.meta.isAffix);
        const insertIndex = firstNonFixedIndex === -1 ? opened.value.length : firstNonFixedIndex;
        opened.value.splice(insertIndex, 0, tab);
      } else {
        // 非固定标签插入到所有固定标签后
        const fixedCount = opened.value.filter(t => t.meta.isAffix).length;
        opened.value.splice(fixedCount, 0, tab);
      }

      // 更新当前标签引用
      if (current.value.path === path) {
        current.value = tab;
      }
    };

    /**
     * 验证工作台标签页的路由有效性
     */
    const validateWorktabs = (routerInstance: Router): void => {
      try {
        const validPaths = new Set(routerInstance.getRoutes().map(route => route.path));

        // 过滤出有效的标签页
        const validTabs = opened.value.filter(tab => validPaths.has(tab.path));

        if (validTabs.length !== opened.value.length) {
          console.warn('发现无效的标签页路由，已自动清理');
          opened.value = validTabs;
        }

        // 验证当前激活标签的有效性
        const isCurrentValid
          = current.value.path && validTabs.some(tab => tab.path === current.value.path);

        if (!isCurrentValid && validTabs.length > 0) {
          console.warn('当前激活标签无效，已自动切换');
          current.value = validTabs[0];
        } else if (!isCurrentValid) {
          current.value = {};
        }
      } catch (error) {
        console.error('验证工作台标签页失败:', error);
      }
    };

    /**
     * 清空所有状态（用于登出等场景）
     */
    const clearAll = (): void => {
      current.value = {};
      opened.value = [];
      keepAliveExclude.value = [];
    };

    /**
     * 获取状态快照（用于持久化存储）
     */
    const getStateSnapshot = (): {
      current: Partial<Menu.MenuOptions>;
      opened: Menu.MenuOptions[];
      keepAliveExclude: string[];
    } => {
      return {
        current: { ...current.value },
        opened: [...opened.value],
        keepAliveExclude: [...keepAliveExclude.value]
      };
    };

    return {
      // 状态
      current,
      opened,
      keepAliveExclude,

      // 计算属性
      hasOpenedTabs,
      hasMultipleTabs,
      currentTabIndex,

      // 方法
      openTab,
      removeTab,
      removeLeft,
      removeRight,
      removeOthers,
      removeAll,
      toggleFixedTab,
      validateWorktabs,
      clearAll,
      getStateSnapshot,

      // 工具方法
      findTabIndex,
      getTab,
      isTabClosable,
      addKeepAliveExclude,
      removeKeepAliveExclude,
      markTabsToRemove
    };
  },
  {
    persist: {
      key: 'worktab',
      storage: localStorage
    }
  }
);
