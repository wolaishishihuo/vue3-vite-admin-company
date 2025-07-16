<!-- 基础表格 -->
<template>
  <div class="art-full-height">
    <ElCard class="art-table-card" shadow="never" style="margin-top: 0">
      <!-- 表格头部 -->
      <ArtTableHeader v-model:columns="columnChecks" full-class="art-table-card" @refresh="refreshAll">
        <template #left>
          <ElButton v-ripple type="primary">
            新增用户
          </ElButton>
          <ElButton v-ripple>
            批量导入
          </ElButton>
          <ElButton v-ripple>
            导出Excel
          </ElButton>
          <el-button type="primary" size="default" />
        </template>
      </ArtTableHeader>

      <!-- 表格 -->
      <ArtTable
        :loading="isLoading"
        :data="tableData"
        :columns="columns"
        :pagination="paginationState"
        :table-config="{ rowKey: 'id' }"
        :layout="{ marginTop: 10 }"
        @pagination:size-change="onPageSizeChange"
        @pagination:current-change="onCurrentPageChange"
      >
        <template #operation="{ row }">
          <ElButton type="primary" link @click="handleEdit(row)">
            编辑
          </ElButton>
          <ElButton type="danger" link @click="handleDelete(row)">
            删除
          </ElButton>
        </template>
      </ArtTable>
    </ElCard>
  </div>
</template>

<script setup lang="ts">
import { ElMessage, ElMessageBox } from 'element-plus';
import { useTable } from '@/hooks/useTable';

defineOptions({ name: 'BasicTableExample' });

// 模拟用户数据
interface User {
  id: number;
  name: string;
  age: number;
  gender: '男' | '女';
  phone: string;
  email: string;
  address: string;
  status: 0 | 1 | 2; // 0-待审核 1-已审核 2-已拒绝
  createTime: string;
}

// 模拟API服务
const UserService = {
  getUserList(params: any) {
    return new Promise<{
      code: number;
      data: {
        list: User[];
        total: number;
        current: number;
        size: number;
      };
      message: string;
    }>((resolve) => {
      const { current = 1, size = 10, name, phone } = params;
      const total = 100; // 总条数

      // 模拟搜索过滤
      let filteredTotal = total;
      if (name) {
        filteredTotal = Math.floor(total / 2);
      }
      if (phone) {
        filteredTotal = Math.floor(filteredTotal / 2);
      }

      // 生成列表数据
      const list: User[] = [];
      const startIndex = (current - 1) * size;
      const endIndex = Math.min(startIndex + size, filteredTotal);

      for (let i = startIndex; i < endIndex; i++) {
        const genderValue = i % 2 === 0 ? '男' : '女';
        const statusValue = (i % 3) as 0 | 1 | 2;

        list.push({
          id: i + 1,
          name: `用户${i + 1}`,
          age: 20 + (i % 30),
          gender: genderValue,
          email: `user${i + 1}@example.com`,
          address: `中国北京市朝阳区${i + 1}号`,
          phone: `1${Math.floor(Math.random() * 9) + 3}${Math.random().toString().slice(2, 11)}`,
          status: statusValue,
          createTime: new Date(Date.now() - i * 86400000).toISOString().split('T')[0]
        });
      }

      setTimeout(() => {
        resolve({
          code: 200,
          data: {
            list,
            total: filteredTotal,
            current,
            size
          },
          message: '获取成功'
        });
      }, 300);
    });
  }
};

// 使用useTable钩子管理表格数据
const {
  // 表格数据和加载状态
  tableData,
  isLoading,

  // 分页相关
  paginationState,
  onPageSizeChange,
  onCurrentPageChange,

  // 刷新方法
  refreshAll,

  // 列配置
  columns,
  columnChecks
} = useTable<User>({
  core: {
    apiFn: UserService.getUserList,
    apiParams: {
      name: '',
      phone: ''
    },
    immediate: true,
    columnsFactory: () => [
      { type: 'selection' },
      { type: 'index' },
      { prop: 'name', label: '用户名', width: 120 },
      { prop: 'age', label: '年龄', width: 80 },
      { prop: 'gender', label: '性别', width: 80 },
      { prop: 'phone', label: '手机号', width: 120 },
      { prop: 'email', label: '邮箱', width: 180 },
      { prop: 'address', label: '地址', minWidth: 200 },
      {
        prop: 'status',
        label: '状态',
        width: 100,
        useSlot: true,
        slotName: 'status'
      },
      { prop: 'createTime', label: '创建时间', width: 120 },
      {
        prop: 'operation',
        label: '操作',
        width: 150,
        useSlot: true,
        slotName: 'operation'
      }
    ]
  },
  transform: {
    responseAdapter: (response: any) => {
      return {
        records: response.data.list,
        total: response.data.total,
        current: response.data.current,
        size: response.data.size
      };
    }
  },
  performance: {
    enableCache: true,
    debounceTime: 300
  },
  hooks: {
    onError: (error) => {
      ElMessage.error(error.message || '获取数据失败');
    }
  }
});

// 操作方法
const handleEdit = (row: User) => {
  ElMessage.success(`编辑用户: ${row.name}`);
  // 实际编辑操作后，使用refreshAfterUpdate刷新数据
  // refreshAfterUpdate();
};

const handleDelete = (row: User) => {
  ElMessageBox.confirm(`确定要删除用户 ${row.name} 吗？`, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    ElMessage.success(`删除成功: ${row.name}`);
    // 实际删除操作后，可以使用refreshAfterRemove刷新数据
    refreshAll();
  }).catch(() => {
    // 取消操作
  });
};
</script>

<style lang="scss" scoped>
:deep(.el-card__body) {
  padding: 16px;
}

.search-bar {
  margin-bottom: 16px;
}
</style>
