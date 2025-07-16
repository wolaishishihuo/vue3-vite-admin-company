import type { ButtonProps, DialogProps as ElDialogProps } from 'element-plus';
import type { VNode } from 'vue';
import type Dialog from './index.vue';

export type DialogInstance = InstanceType<typeof Dialog>;
export interface DialogProps extends Partial<ElDialogProps> {
  content?: string | (() => VNode);
  footer?: boolean | (() => VNode);
  okText?: string;
  cancelText?: string;
  okButtonProps?: Partial<ButtonProps>;
  cancelButtonProps?: Partial<ButtonProps>;
  onOk?: () => void;
  onBeforeOk?: () => Promise<boolean>;
  onCancel?: () => void;
}
