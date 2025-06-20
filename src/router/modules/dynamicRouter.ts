import type { RouteRecordRaw } from 'vue-router';
import { ElNotification } from 'element-plus';
import { LOGIN_URL } from '@/config';
import router from '@/router';
import { useAuthStore } from '@/store/modules/auth';
import { useUserStore } from '@/store/modules/user';
// 引入 views 文件夹下所有 vue 文件
const modules = import.meta.glob('@/views/**/*.vue');

export const initDynamicRouter = async () => {
  const userStore = useUserStore();
  const authStore = useAuthStore();
  try {
    console.log('initDynamicRouter');
    // 获取菜单列表 && 按钮权限列表
    await authStore.getAuthMenuList();
    await authStore.getAuthButtonList();

    // 判断当前用户有没有菜单权限
    if (!authStore.authMenuListGet.length) {
      ElNotification({
        title: '无权限访问',
        message: '当前账号无任何菜单权限，请联系系统管理员！',
        type: 'warning',
        duration: 3000
      });
      userStore.resetUserInfo();
      router.replace(LOGIN_URL);
      return Promise.reject(new Error('No permission'));
    }

    // 动态添加路由
    authStore.flatMenuListGet.forEach((menu) => {
      if (menu.component && typeof menu.component === 'string') {
        menu.component = modules[`/src/views${menu.component}.vue`];
      }
      console.log(menu);
      if (menu.meta?.isFull) {
        router.addRoute(menu as unknown as RouteRecordRaw);
      } else {
        router.addRoute('layout', menu as unknown as RouteRecordRaw);
      }
    });
  } catch (error) {
    // 当按钮 || 菜单请求出错时，重定向到登陆页
    userStore.resetUserInfo();
    router.replace(LOGIN_URL);
    return Promise.reject(error);
  }
};
