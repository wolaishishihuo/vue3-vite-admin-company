import { storeToRefs } from 'pinia';
import { useSettingStore } from '@/store/modules/setting';
import { getTabConfig } from '@/utils/ui';

// 通用函数
export function useCommon() {
  const settingStore = useSettingStore();
  const { showWorkTab, tabStyle } = storeToRefs(settingStore);

  // 是否是前端控制模式
  const isFrontendMode = computed(() => {
    return import.meta.env.VITE_ACCESS_MODE === 'frontend';
  });

  // 刷新页面
  const refresh = () => {
    settingStore.reload();
  };

  // 回到顶部
  const scrollToTop = () => {
    window.scrollTo({ top: 0 });
  };

  // 页面最小高度
  const containerMinHeight = computed(() => {
    const { openHeight, closeHeight } = getTabConfig(tabStyle.value);
    return `calc(100vh - ${showWorkTab.value ? openHeight : closeHeight}px)`;
  });

  // 设置容器高度CSS变量
  const setContainerHeightCssVar = () => {
    const height = containerMinHeight.value;
    document.documentElement.style.setProperty('--art-full-height', height);
  };

  // 监听容器高度变化并更新CSS变量
  watchEffect(() => {
    setContainerHeightCssVar();
  });

  return {
    isFrontendMode,
    refresh,
    scrollToTop,
    containerMinHeight
  };
}
