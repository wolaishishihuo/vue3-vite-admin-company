import { type App } from 'vue';
import { createPinia } from 'pinia';
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate';

// 注册
const pinia = createPinia();
pinia.use(piniaPluginPersistedstate);
export const setupStore = (app: App) => {
    app.use(pinia);
};
