// 动态列配置

import type { ColumnOption } from '@/components/core/tables/types';

// 工具函数：根据列配置生成列选择状态
const getColumnChecks = <T>(columns: ColumnOption<T>[]): ColumnOption<T>[] => {
  const checks: ColumnOption<T>[] = [];

  columns.forEach((column) => {
    if (column.type === 'selection') {
      checks.push({
        ...column,
        prop: '__selection__',
        label: '勾选',
        checked: true
      });
    } else if (column.type === 'expand') {
      checks.push({
        ...column,
        prop: '__expand__',
        label: '展开',
        checked: true
      });
    } else if (column.type === 'index') {
      checks.push({
        ...column,
        prop: '__index__',
        label: '序号',
        checked: true
      });
    } else {
      checks.push({
        ...column,
        checked: true
      });
    }
  });

  return checks;
};

// 动态列配置
export function useTableColumns<T = any>(columnsFactory: () => ColumnOption<T>[]) {
  // 获取所有列定义
  const allColumns = columnsFactory();

  // 列选中状态，初始包含所有普通列和特殊类型列
  const columnChecks = ref<ColumnOption<T>[]>(getColumnChecks(allColumns));

  // 当前显示的列
  const columns = computed(() => {
    const cols = allColumns;
    const columnMap = new Map<string, ColumnOption<T>>();

    cols.forEach((column) => {
      if (column.type === 'selection') {
        columnMap.set('__selection__', column);
      } else if (column.type === 'expand') {
        columnMap.set('__expand__', column);
      } else if (column.type === 'index') {
        columnMap.set('__index__', column);
      } else {
        columnMap.set(column.prop as string, column);
      }
    });

    return columnChecks.value
      .filter(item => item.checked)
      .map(check => columnMap.get(check.prop as string) as ColumnOption<T>);
  });

  return {
    columns,
    columnChecks
  };
}
