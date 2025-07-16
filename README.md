# Vue3 Vite Admin 企业级项目模板

基于 Vue 3 生态系统的管理后台应用模板，采用现代化的开发工具链和企业级最佳实践。

## 技术栈

- 🚀 [Vue 3](https://v3.vuejs.org/) - 渐进式 JavaScript 框架
- 🏗️ [Vite](https://vitejs.dev/) - 下一代前端构建工具
- 🎨 [Element Plus](https://element-plus.org/) - Vue 3 的组件库
- 📦 [Pinia](https://pinia.vuejs.org/) - 状态管理
- 🛠️ [TypeScript](https://www.typescriptlang.org/) - JavaScript 的超集
- 🎯 [Vue Router](https://router.vuejs.org/) - 官方路由管理器
- 🔧 [VueUse](https://vueuse.org/) - 实用的 Composition API 工具集
- 🎭 [UnoCSS](https://github.com/unocss/unocss) - 即时原子 CSS 引擎

## 项目结构

```
├── src                     # 源代码
│   ├── assets              # 静态资源
│   │   ├── css             # 全局 CSS
│   │   ├── images          # 图片资源
│   │   ├── json            # JSON 数据文件
│   │   └── svgs            # SVG 图标
│   ├── components          # 公共组件
│   ├── config              # 配置文件
│   ├── enums               # 枚举定义
│   ├── hooks               # 自定义组合式函数
│   ├── layouts             # 布局组件
│   ├── plugins             # 插件配置
│   ├── router              # 路由配置
│   ├── store               # Pinia 状态管理
│   ├── styles              # 全局样式
│   ├── types               # TypeScript 类型定义
│   ├── utils               # 工具函数
│   ├── views               # 页面组件
│   ├── App.vue             # 入口页面
│   └── main.ts             # 入口文件
├── scripts                 # 脚本文件
├── index.html              # HTML 模板
├── package.json            # 项目依赖
├── tsconfig.json           # TypeScript 配置
├── uno.config.ts           # UnoCSS 配置
└── vite.config.ts          # Vite 配置
```

## 开发规范

### 代码风格

- 使用 ESLint + TypeScript 进行代码检查
- 遵循 Vue 3 组合式 API 风格指南
- 使用 TypeScript 编写代码，确保类型安全

### 组件开发规范

1. 组件命名采用大驼峰命名法 (如: UserProfile.vue)
2. 使用 Composition API 编写组件逻辑
3. Props 必须使用 defineProps 并指定类型
4. 事件必须使用 defineEmits 明确定义

### Vue组件结构

<script lang="ts" setup>
// imports
// 类型定义
// props/emits定义
// 响应式数据
// 计算属性
// 生命周期钩子
// 方法定义
// 监听器
</script>

<style lang="scss" scoped>
/* 样式内容 */
</style>

````

### Git 提交规范

提交信息格式：`类型: 描述`（描述使用中文）

类型包括：

- feat: 新功能
- fix: 修复bug
- docs: 文档更新
- style: 代码格式（不影响代码运行的变动）
- refactor: 代码重构
- perf: 性能优化
- test: 测试
- build: 构建相关
- ci: CI配置
- chore: 其他更改
- revert: 回退
- wip: 开发中
- workflow: 工作流
- types: 类型定义
- release: 发布

## 开发环境设置

```bash
# 安装依赖
pnpm install

# 启动开发服务器
pnpm dev

# 构建生产环境
pnpm build

# 代码检查
pnpm lint

# 类型检查
pnpm typecheck
````

## 项目特性

- 基于 Vue 3、Vite、Element Plus 的现代化管理后台
- 完全使用 TypeScript 开发，提供完善的类型支持
- 使用 Pinia 进行状态管理，支持数据持久化
- 动态路由和权限控制
- 多主题配置，支持深色模式
- UnoCSS 提供高效的原子化 CSS 开发体验
- 工作区标签页管理
- 响应式布局，适配不同屏幕尺寸
