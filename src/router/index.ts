import type { App } from 'vue';
import type { Router, RouteRecordRaw } from 'vue-router';
import { createRouter, createWebHistory } from 'vue-router';
import { LOGIN_URL, ROUTER_WHITE_LIST } from '@/config';
import NProgress from '@/config/nprogress';
import { useAuthStore } from '@/store/modules/auth';
import { useUserStore } from '@/store/modules/user';
import { setWorktab } from '@/utils/navigation/worktab';
import { initDynamicRouter } from './modules/dynamicRouter';
import { errorRouter, staticRouter } from './modules/staticRouter';

// 路由实例
const router: Router = createRouter({
  history: createWebHistory('/v3/web/'),
  routes: [...staticRouter, ...errorRouter] as RouteRecordRaw[],
  strict: false,
  scrollBehavior: () => ({ left: 0, top: 0 })
});

/**
 * @description 路由跳转开始
 */
router.beforeEach(async (to, from, next) => {
  try {
    const userStore = useUserStore();
    const authStore = useAuthStore();
    NProgress.start();

    // 1. 动态设置标题
    const title = import.meta.env.VITE_GLOB_APP_TITLE;
    const pageTitle = to.matched
      .slice()
      .reverse()
      .find(item => item.meta?.title)
      ?.meta
      ?.title;
    document.title = pageTitle ? `${pageTitle} - ${title}` : title;

    // 2. 处理登录页面
    if (to.path === LOGIN_URL) {
      if (userStore.isLogin) return next(from.fullPath);
      resetRouter();
      return next();
    }
    // 3. 白名单放行
    if (ROUTER_WHITE_LIST.includes(to.path)) return next();

    // 4. 判断是否登录
    if (!userStore.isLogin) {
      return next({
        path: LOGIN_URL,
        query: { redirect: to.fullPath },
        replace: true
      });
    }

    // 5. 获取权限列表
    if (!authStore.authMenuListGet.length) {
      try {
        await initDynamicRouter();

        return next({ ...to, replace: true });
      } catch (error) {
        console.error('动态路由加载失败:', error);
        userStore.resetUserInfo();
        return next({
          path: LOGIN_URL,
          query: { redirect: to.fullPath },
          replace: true
        });
      }
    }
    setWorktab(to);
    authStore.setRouteName(to.name as string);
    next();
  } catch (error) {
    console.error('路由守卫错误:', error);
    next({ path: '/500' });
  } finally {
    NProgress.done();
  }
});

/**
 * @description 重置路由
 */
export const resetRouter = () => {
  const authStore = useAuthStore();
  authStore.flatMenuListGet.forEach((route) => {
    const { name } = route;
    if (name && router.hasRoute(name)) router.removeRoute(name);
  });
};

/**
 * @description 路由跳转错误
 */
router.onError((error) => {
  NProgress.done();
  console.warn('路由错误', error.message);
});

/**
 * @description 路由跳转结束
 */
router.afterEach(() => {
  NProgress.done();
});

export async function setupRouter(app: App) {
  app.use(router);
  // 路由准备就绪后挂载APP实例
  await router.isReady();
}
export default router;
