import type { RouteLocationNormalized } from 'vue-router';
import { HOME_URL } from '@/config';
import { useSettingStore } from '@/store/modules/setting';
import { useWorktabStore } from '@/store/modules/workTab';
import { getIframeRoutes } from '../menu';
import { isIframe } from './route';

/**
 * 根据当前路由信息设置工作标签页（worktab）
 * @param to 当前路由对象
 */
export const setWorktab = (to: RouteLocationNormalized): void => {
  const worktabStore = useWorktabStore();
  const { meta, path, name, params, query } = to;

  if (!meta.isHide) {
    // 如果是 iframe 页面，则特殊处理工作标签页
    if (isIframe(path)) {
      const iframeRoute = getIframeRoutes().find((route: Menu.MenuOptions) => route.path === to.path);

      if (iframeRoute?.meta) {
        worktabStore.openTab({
          path,
          name: name as string,
          params,
          query,
          meta: {
            title: iframeRoute.meta.title,
            isKeepAlive: meta.isKeepAlive as boolean
          }
        });
      }
    } else if (useSettingStore().showWorkTab || path === HOME_URL) {
      worktabStore.openTab({
        path,
        name: name as string,
        params,
        query,
        meta: {
          title: meta.title as string,
          isKeepAlive: meta.isKeepAlive as boolean,
          isAffix: meta.isAffix as boolean
        }
      });
    }
  }
};
