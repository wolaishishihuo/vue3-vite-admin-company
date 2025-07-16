<!-- 基础表格 -->
<template>
  <div class="user-page art-full-height">
    <ElCard class="art-table-card" shadow="never" style="margin-top: 0">
      <!-- 搜索栏 -->
      <div class="search-bar mb-4">
        <ElForm :model="searchForm" inline>
          <ElFormItem label="用户名">
            <ElInput v-model="searchForm.name" placeholder="请输入" clearable />
          </ElFormItem>
          <ElFormItem label="手机号">
            <ElInput v-model="searchForm.phone" placeholder="请输入" clearable />
          </ElFormItem>
          <ElFormItem>
            <ElButton type="primary" @click="handleSearch">
              查询
            </ElButton>
            <ElButton @click="handleReset">
              重置
            </ElButton>
          </ElFormItem>
        </ElForm>
      </div>

      <!-- 表格头部 -->
      <ArtTableHeader v-model:columns="columnChecks" @refresh="refresh">
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
        </template>
      </ArtTableHeader>

      <!-- 表格 -->
      <ArtTable
        :loading="loading"
        :data="tableData"
        :columns="columns"
        :pagination="pagination"
        :table-config="{ rowKey: 'id' }"
        :layout="{ marginTop: 10 }"
        @pagination:size-change="handleSizeChange"
        @pagination:current-change="handleCurrentChange"
      >
        <!-- 操作列 -->
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
import { onMounted, reactive, ref } from 'vue';
import { useTableColumns } from '@/hooks/useTableColumns';

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

// 搜索表单
const searchForm = reactive({
  name: '',
  phone: ''
});

// 表格列定义
const { columns, columnChecks } = useTableColumns(() => [
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
]);

// 表格数据和分页
const tableData = ref<User[]>([]);
const loading = ref(false);
const pagination = reactive({
  current: 1,
  size: 10,
  total: 0
});

// 获取表格数据
const fetchTableData = async () => {
  loading.value = true;
  try {
    const params = {
      current: pagination.current,
      size: pagination.size,
      ...searchForm
    };

    const res = await UserService.getUserList(params);
    if (res.code === 200) {
      tableData.value = res.data.list;
      pagination.total = res.data.total;
    } else {
      ElMessage.error(res.message || '获取数据失败');
    }
  } catch (error) {
    console.error('获取表格数据失败', error);
    ElMessage.error('获取数据失败');
  } finally {
    loading.value = false;
  }
};

// 刷新数据
const refresh = () => {
  fetchTableData();
};

// 搜索
const handleSearch = () => {
  pagination.current = 1;
  fetchTableData();
};

// 重置
const handleReset = () => {
  Object.keys(searchForm).forEach((key) => {
    searchForm[key as keyof typeof searchForm] = '';
  });
  pagination.current = 1;
  fetchTableData();
};

// 分页事件
const handleSizeChange = (size: number) => {
  pagination.size = size;
  fetchTableData();
};

const handleCurrentChange = (current: number) => {
  pagination.current = current;
  fetchTableData();
};

// 操作方法
const handleEdit = (row: User) => {
  ElMessage.success(`编辑用户: ${row.name}`);
};

const handleDelete = (row: User) => {
  ElMessageBox.confirm(`确定要删除用户 ${row.name} 吗？`, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    ElMessage.success(`删除成功: ${row.name}`);
  }).catch(() => {
    // 取消操作
  });
};

// 首次加载数据
onMounted(() => {
  fetchTableData();
});
</script>

<style lang="scss" scoped>
.user-page {
  padding: 16px;
}

:deep(.el-card__body) {
  padding: 16px;
}

.search-bar {
  margin-bottom: 16px;
}
</style>
