import { defineStore } from 'pinia';
import { computed, ref } from 'vue';
import { LOGIN_URL } from '@/config';
import router, { resetRouter } from '@/router';
import { useWorktabStore } from './workTab';

/**
 * 用户状态管理
 * 管理用户登录状态、个人信息、语言设置、搜索历史、锁屏状态等
 */
export const useUserStore = defineStore(
  'userStore',
  () => {
    // 登录状态
    const isLogin = ref(false);
    // 用户信息
    const userInfo = ref<Partial<User.UserInfo>>({});

    // 访问令牌
    const accessToken = ref('');
    // 刷新令牌
    const refreshToken = ref('');

    // 计算属性：获取用户信息
    const getUserInfo = computed(() => userInfo.value);

    /**
     * 设置用户信息
     * @param newInfo 新的用户信息
     */
    const setUserInfo = (newInfo: User.UserInfo) => {
      userInfo.value = newInfo;
    };

    /**
     * 设置登录状态
     * @param status 登录状态
     */
    const setLoginStatus = (status: boolean) => {
      isLogin.value = status;
    };

    /**
     * 设置令牌
     * @param newAccessToken 访问令牌
     * @param newRefreshToken 刷新令牌（可选）
     */
    const setToken = (newAccessToken: string, newRefreshToken?: string) => {
      accessToken.value = newAccessToken;
      if (newRefreshToken) {
        refreshToken.value = newRefreshToken;
      }
    };

    const resetUserInfo = () => {
      // 清空用户信息
      userInfo.value = {};
      // 重置登录状态
      isLogin.value = false;
      // 清空访问令牌
      accessToken.value = '';
      // 清空刷新令牌
      refreshToken.value = '';
    };

    /**
     * 退出登录
     * 清空所有用户相关状态并跳转到登录页
     */
    const logOut = () => {
      resetUserInfo();
      // 清空工作台已打开页面
      useWorktabStore().opened = [];
      // 移除iframe路由缓存
      sessionStorage.removeItem('iframeRoutes');
      // 重置路由状态
      resetRouter();
      // 跳转到登录页
      router.push(LOGIN_URL);
    };

    return {
      isLogin,
      userInfo,
      accessToken,
      refreshToken,
      getUserInfo,
      setUserInfo,
      setLoginStatus,
      setToken,
      resetUserInfo,
      logOut
    };
  },
  {
    persist: {
      key: 'user',
      storage: localStorage
    }
  }
);
