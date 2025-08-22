/**
 * @description 使用递归扁平化包含嵌套子元素的数组
 * @template T - 代表数组项的数据类型，应包含一个可选属性 `children`，其类型为 `T[]`
 * @param menuList - 待扁平化的数组
 * @returns 扁平化后的数组
 */
export function getFlatList<T extends { children?: T[] }>(menuList: T[]): T[] {
  return menuList.flatMap((item: T) => [item, ...getFlatList(item.children || [])]);
}
