export function useWorkTabMenu(
  list: Ref<any[]>,
  activeTab: Ref<string>
) {
  const menuRef = ref();
  const clickedPath = ref('');

  // 右键菜单选项
  const menuItems = computed(() => {
    const clickedIndex = list.value.findIndex(tab => tab.path === clickedPath.value);
    const isLastTab = clickedIndex === list.value.length - 1;
    const isOneTab = list.value.length === 1;
    const isCurrentTab = clickedPath.value === activeTab.value;
    const currentTab = list.value[clickedIndex];

    // 检查左侧标签页是否全部为固定标签页
    const leftTabs = list.value.slice(0, clickedIndex);
    const areAllLeftTabsFixed = leftTabs.length > 0 && leftTabs.every(tab => tab.meta.isAffix);

    // 检查右侧标签页是否全部为固定标签页
    const rightTabs = list.value.slice(clickedIndex + 1);
    const areAllRightTabsFixed = rightTabs.length > 0 && rightTabs.every(tab => tab.meta.isAffix);

    // 检查其他标签页是否全部为固定标签页
    const otherTabs = list.value.filter((_, index) => index !== clickedIndex);
    const areAllOtherTabsFixed = otherTabs.length > 0 && otherTabs.every(tab => tab.meta.isAffix);

    // 检查所有标签页是否全部为固定标签页
    const areAllTabsFixed = list.value.every(tab => tab.meta.isAffix);

    return [
      {
        key: 'refresh',
        label: '刷新',
        icon: 'refresh',
        disabled: !isCurrentTab
      },
      {
        key: 'fixed',
        label: currentTab?.meta.isAffix ? '取消固定' : '固定',
        icon: 'Lock',
        disabled: false,
        showLine: true
      },
      {
        key: 'left',
        label: '关闭左侧',
        icon: 'back',
        disabled: clickedIndex === 0 || areAllLeftTabsFixed
      },
      {
        key: 'right',
        label: '关闭右侧',
        icon: 'Right',
        disabled: isLastTab || areAllRightTabsFixed
      },
      {
        key: 'other',
        label: '关闭其他',
        icon: 'close',
        disabled: isOneTab || areAllOtherTabsFixed
      },
      {
        key: 'all',
        label: '关闭所有',
        icon: 'CircleClose',
        disabled: isOneTab || areAllTabsFixed
      }
    ];
  });

  // 右键菜单相关方法
  const showMenu = (e: MouseEvent, path?: string) => {
    clickedPath.value = path || '';
    menuRef.value?.show(e);
    e.preventDefault();
    e.stopPropagation();
  };

  return {
    menuRef,
    clickedPath,
    menuItems,
    showMenu
  };
}
