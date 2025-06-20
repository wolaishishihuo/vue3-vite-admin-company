import { defineStore } from 'pinia';
// import { getUserInfoApi, getUserRoleApi } from '@/api/user';
// import { EXCLUDE_CACHE_KEYS } from '@/config';
// import useLocalCache from '@/hooks/useLocalCache';
import router, { resetRouter } from '@/router';
import { initDynamicRouter } from '@/router/modules/dynamicRouter';
import piniaPersistConfig from '../helper';

export const useUserStore = defineStore('user', {
  state: () => ({
    accessToken: '',
    refreshToken: '',
    userInfo: null as User.UserInfo | null,
    permissions: [] as string[]
  }),
  getters: {
    isLogin: state => !!state.accessToken,
    userRoles: state => state.userInfo?.roles,
    userPermissions: state => state.permissions
  },
  actions: {
    // 设置 Token
    setAccessToken(token: string) {
      this.accessToken = token;
    },
    setRefreshToken(token: string) {
      this.refreshToken = token;
    },

    // 获取用户信息
    async getUserInfo() {
      try {
        // const [userInfo, roles] = await Promise.all([getUserInfoApi(), getUserRoleApi()]);
        // this.userInfo = userInfo.data;
        // this.userInfo.roles = roles.data;
        // 获取用户信息后重新初始化路由
        await initDynamicRouter();
      } catch (error) {
        return Promise.reject(error);
      }
    },

    // 初始化状态
    async initState() {
      if (this.accessToken && !router.hasRoute('dashboard')) {
        try {
          await this.getUserInfo();
        } catch (error) {
          console.error('Failed to initialize user state:', error);
          this.resetUserInfo();
          router.push('/login');
        }
      }
    },

    // 登出
    async logout() {
      this.resetUserInfo();
      resetRouter();
      router.push('/login');
    },

    // 重置用户信息
    resetUserInfo() {
      this.accessToken = '';
      this.refreshToken = '';
      this.userInfo = null;
      this.permissions = [];
      // // 清除本地缓存
      // const { clearCache } = useLocalCache();
      // clearCache(EXCLUDE_CACHE_KEYS);
    }
  },
  persist: piniaPersistConfig('user-store', ['accessToken', 'refreshToken', 'userInfo'])
});
