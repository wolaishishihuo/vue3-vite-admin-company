// 首页地址（默认）
export const HOME_URL: string = '/dashboard';

// 登录页地址（默认）
export const LOGIN_URL: string = '/login';

// 路由白名单地址
export const ROUTER_WHITE_LIST: string[] = ['/500', '/403', '/404'];

// 公共错误代码
export const COMMON_ERROR_CODE = '10001';
// 无权限
export const COMMON_ACCESS_FORBIDDEN = '10003';

// github 用户名
export const GITHUB_OWNER = 'wolaishishihuo';
// github 仓库名
export const GITHUB_REPO = 'my-vue3-app';
// github 域名
export const GITHUB_API_BASE = 'https://api.github.com';

// 高德地图
export const AMAP_CONFIG = {
  key: '5101582d67647dd57024b7c1fcdd0d6f',
  securityJsCode: '59733ab1249dcdb45819a835f6769ea9'
};

// 本地缓存
export const LOCAL_CACHE_KEY = 'my-vue3-app-cache';
export const LOCAL_CACHE_EXPIRY_TIME = 1000 * 60 * 60 * 24; // 24小时

// 缓存keys
export const CACHE_KEYS = {
  todoKey: 'todos'
};

// 需要排除的缓存key
export const EXCLUDE_CACHE_KEYS: string[] = [CACHE_KEYS.todoKey];
