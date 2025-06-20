/**
 * 处理菜单项，添加父级路径
 */
export function processMenuItems(menuList: Menu.MenuOptions[], parentPath: string = ''): Menu.MenuOptions[] {
  return menuList.map((menu) => {
    const processedMenu: Menu.MenuOptions = {
      ...menu,
      parentPath,
      path: menu.path
    };
    if (menu.children?.length) {
      processedMenu.children = processMenuItems(menu.children, menu.path);
    }
    return processedMenu;
  });
}

/**
 * 过滤隐藏的菜单
 */
export function filterHiddenMenus(menuList: Menu.MenuOptions[]): Menu.MenuOptions[] {
  return menuList
    .filter(menu => !menu.meta.isHide)
    .map(menu => ({
      ...menu,
      children: menu.children?.length ? filterHiddenMenus(menu.children) : []
    }));
}

/**
 * 获取第一个可用的菜单项
 */
export function getFirstAvailableMenu(menuList: Menu.MenuOptions[]): Menu.MenuOptions | null {
  for (const menu of menuList) {
    if (!menu.meta.isHide) {
      if (!menu.children?.length) {
        return menu;
      }
      const subMenu = getFirstAvailableMenu(menu.children);
      if (subMenu) {
        return subMenu;
      }
    }
  }
  return null;
}

/**
 * 获取 iframe 路由
 * @returns iframe 路由列表
 */
export const getIframeRoutes = (): Menu.MenuOptions[] => {
  try {
    return JSON.parse(sessionStorage.getItem('iframeRoutes') || '[]');
  } catch (error) {
    console.error('解析 iframe 路由失败:', error);
    return [];
  }
};
