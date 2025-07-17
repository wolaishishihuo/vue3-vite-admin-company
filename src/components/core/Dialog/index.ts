import type { DialogProps } from './type';
import Dialog from './index.vue';

// 错误处理函数
const handleError = (error: Error, context: string) => {
  // 这里可以添加用户友好的错误提示
  // 这里可以添加错误上报逻辑
  console.error(`Dialog Error in ${context}:`, error);
};

export interface DialogInstance {
  close: () => void;
  update: (newProps?: Partial<DialogProps>) => void;
  id: string;
}

const createDialog = () => {
  let instances: DialogInstance[] = [];

  const dialog = {
    _context: {},
    create(options: DialogProps): DialogInstance | null {
      try {
        // 不再关闭已存在的弹窗，支持嵌套
        const mergedOptions = {
          ...options
        };

        // 创建容器
        const container = document.createElement('div');
        try {
          document.body.appendChild(container);
        } catch (error) {
          handleError(error as Error, 'DOM操作');
          return null;
        }

        // 状态管理
        const visible = ref(true);
        const dialogOptions = ref(mergedOptions || {});

        // 创建弹窗应用
        const dialogApp = createApp({
          setup() {
            // 关闭处理
            const handleClose = () => {
              visible.value = false;
              setTimeout(() => {
                try {
                  dialogApp.unmount();
                  container.remove();
                  // 从实例数组中移除关闭的实例
                  instances = instances.filter(item => item.id !== instance.id);
                } catch (error) {
                  handleError(error as Error, '弹窗关闭');
                }
              }, 300);
            };

            return () =>
              h(Dialog, {
                ...dialogOptions.value,
                'modelValue': visible.value,
                'onUpdate:modelValue': (val: boolean) => (visible.value = val),
                'onClose': () => handleClose()
              });
          }
        });

        // 继承上下文
        Object.assign(dialogApp._context, dialog._context);

        // 挂载
        try {
          dialogApp.mount(container);
        } catch (error) {
          handleError(error as Error, 'Vue实例挂载');
          container.remove();
          return null;
        }

        const instance: DialogInstance = {
          id: `dialog-${Date.now()}`,
          close: () => {
            visible.value = false;
            setTimeout(() => {
              try {
                dialogApp.unmount();
                container.remove();
                // 从实例数组中移除关闭的实例
                instances = instances.filter(item => item.id !== instance.id);
              } catch (error) {
                handleError(error as Error, '实例关闭');
              }
            }, 300);
          },
          update: (newProps?: Partial<DialogProps>) => {
            if (newProps) {
              dialogOptions.value = { ...dialogOptions.value, ...newProps };
            }
          }
        };

        instances.push(instance);
        return instance;
      } catch (error) {
        handleError(error as Error, '弹窗创建');
        return null;
      }
    },

    open(options: DialogProps) {
      return this.create(options);
    },
    closeAll() {
      instances.forEach(instance => instance.close());
      instances = [];
    }
  };
  return dialog;
};

// 默认导出实例
export const dialog = createDialog();
