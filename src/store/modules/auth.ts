import { defineStore } from 'pinia';
import { getFlatList } from '@/utils/tools/array';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    // 当前路由name
    routeName: '',
    buttonPermissions: {} as { [key: string]: string[] },
    authMenuList: [] as Menu.MenuOptions[],
    permissionCache: new Map<string, boolean>()
  }),
  getters: {
    // 菜单权限列表 ==> 扁平化之后的一维数组菜单，主要用来添加动态路由
    flatMenuListGet: state => getFlatList<Menu.MenuOptions>(state.authMenuList),
    // 菜单权限列表 ==> 这里的菜单没有经过任何处理
    authMenuListGet: state => state.authMenuList,
    authButtonListGet: state => state.buttonPermissions,
    // 当前路由按钮权限
    currentRouteButtonPermissions(): string[] {
      return this.buttonPermissions[this.routeName] || [];
    }
  },
  actions: {
    // 获取按钮权限列表
    async getAuthButtonList() {
      const { data } = await import('@/assets/json/authButtonList.json');
      this.buttonPermissions = data;
      return data;
    },

    // 获取菜单权限列表
    async getAuthMenuList() {
      try {
        // 确保菜单数据加载完成
        const { data } = await import('@/assets/json/authMenuList.json');
        this.authMenuList = data;
        return Promise.resolve(data);
      } catch (error) {
        return Promise.reject(error);
      }
    },
    setRouteName(routeName: string) {
      this.routeName = routeName;
    },
    // 重置权限信息
    resetAuthInfo() {
      this.buttonPermissions = {};
      this.authMenuList = [];
      this.permissionCache.clear();
    },

    // 检查按钮权限
    hasButtonPermission(permission: string): boolean {
      const cacheKey = `${this.routeName}:${permission}`;

      if (this.permissionCache.has(cacheKey)) {
        return this.permissionCache.get(cacheKey)!;
      }
      const result = this.currentRouteButtonPermissions.includes(permission);
      this.permissionCache.set(cacheKey, result);
      return result;
    }
  }
});
