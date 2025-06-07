declare namespace Menu {
  interface MenuOptions {
    path: string;
    parentPath?: string;
    name: string;
    component?: string | (() => Promise<unknown>);
    redirect?: string;
    meta: MetaProps;
    children?: MenuOptions[];
  }
  interface MetaProps {
    title: string;
    icon?: string;
    auth?: boolean;
    roles?: string[]; // 角色列表
    isLink?: string;
    isHide?: boolean;
    isFull?: boolean;
    isAffix?: boolean;
    isKeepAlive?: boolean;
  }
}
