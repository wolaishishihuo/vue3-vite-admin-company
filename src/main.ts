import type { App } from 'vue';
import { createApp } from 'vue';
import { setupAssets, setupElement } from '@/plugins/index';
import { setupRouter } from '@/router';
import { setupStore } from '@/store';
import APP from './App.vue';
// import errorHandler from '@/utils/errorHandler';

const app: App = createApp(APP); // 创建vue实例
// 注册插件
function setupPlugins() {
  // 设置全局代码错误捕捉
  // app.config.errorHandler = errorHandler;
  // 设置资源
  setupAssets();
  // 设置element
  setupElement(app);
  // 注册指令
  // setupDirective(app);
}
// 初始化应用
async function setupApp() {
  // 挂载pinia状态管理
  setupStore(app);
  // 挂载路由
  await setupRouter(app);
  app.mount('#app');
}
setupPlugins();
setupApp();
