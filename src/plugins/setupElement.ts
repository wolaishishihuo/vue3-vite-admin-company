import type { App } from 'vue';
import * as ElementPlusIconsVue from '@element-plus/icons-vue';

// 注册element-plus图标
export const setupElement = (app: App) => {
  Object.keys(ElementPlusIconsVue).forEach((key) => {
    app.component(key, ElementPlusIconsVue[key]);
  });
};
