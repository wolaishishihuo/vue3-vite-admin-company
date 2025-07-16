// 表格列配置接口
export interface ColumnOption<T = any> {
  // 列类型
  type?: 'selection' | 'expand' | 'index' | 'globalIndex';
  // 列属性名
  prop?: string;
  // 列标题
  label?: string;
  // 列宽度
  width?: string | number;
  // 最小列宽度
  minWidth?: string | number;
  // 固定列
  fixed?: boolean | 'left' | 'right';
  // 是否可排序
  sortable?: boolean;
  // 过滤器选项
  filters?: any[];
  // 过滤方法
  filterMethod?: (value: any, row: any) => boolean;
  // 过滤器位置
  filterPlacement?: string;
  // 是否禁用
  disabled?: boolean;
  // 是否选中显示
  checked?: boolean;
  // 自定义渲染函数
  formatter?: (row: T) => any;
  // 🆕 插槽相关配置
  // 是否使用插槽渲染内容
  useSlot?: boolean;
  // 插槽名称（默认为 prop 值）
  slotName?: string;
  // 是否使用表头插槽
  useHeaderSlot?: boolean;
  // 表头插槽名称（默认为 `${prop}-header`）
  headerSlotName?: string;
  // 其他属性
  [key: string]: any;
}

// 表格列配置
export interface TableColumn {
  // 列标题
  label: string;
  // 列属性名
  prop: string;
  // 列宽度
  width?: number | string;
  // 最小宽度
  minWidth?: number | string;
  // 是否可排序
  sortable?: boolean;
  // 是否固定列
  fixed?: boolean | 'left' | 'right';
  // 列对齐方式
  align?: 'left' | 'center' | 'right';
  // 自定义渲染
  formatter?: (row: any, column: any, cellValue: any, index: number) => string;
  // 是否显示
  show?: boolean;
  // 列类型
  type?: 'selection' | 'index' | 'expand';
}

// 分页配置
export interface PaginationConfig {
  // 当前页
  currentPage: number;
  // 每页条数
  pageSize: number;
  // 总条数
  total: number;
  // 每页显示个数选择器的选项
  pageSizes?: number[];
  // 组件布局
  layout?: string;
  // 是否为小型分页
  small?: boolean;
}

// 排序方向
export type SortOrder = 'ascending' | 'descending';
