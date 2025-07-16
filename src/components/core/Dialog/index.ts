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
  let currentInstance: DialogInstance | null = null;

  const dialog = {
    create(options: DialogProps): DialogInstance | null {
      try {
        // 创建前关闭已存在的弹窗
        if (currentInstance) {
          currentInstance.close();
          currentInstance = null;
        }

        const mergedOptions = { ...options };

        const context = getCurrentInstance()?.appContext;

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
        const popupApp = createApp({
          setup() {
            // 关闭处理
            const handleClose = () => {
              visible.value = false;
              setTimeout(() => {
                try {
                  popupApp.unmount();
                  container.remove();
                  currentInstance = null;
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
        if (context) {
          popupApp._context = Object.assign({}, context);
        }

        // 挂载
        try {
          popupApp.mount(container);
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
                popupApp.unmount();
                container.remove();
                currentInstance = null;
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

        currentInstance = instance;
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
