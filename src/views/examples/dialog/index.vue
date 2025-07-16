<!-- Dialog组件使用示例 -->
<template>
  <div class="art-full-height">
    <h2 class="mb-6 font-bold">
      对话框组件示例
    </h2>

    <!-- 动态创建示例 -->
    <div class="example-section mb-8">
      <el-card>
        <div class="flex flex-wrap gap-4">
          <el-button type="primary" @click="createSimpleDialog">
            简单对话框
          </el-button>
          <el-button type="success" @click="createComplexDialog">
            复杂对话框
          </el-button>
          <el-button type="warning" @click="createAsyncDialog">
            异步确认对话框
          </el-button>
          <el-button type="danger" @click="createComponentDialog">
            组件内容对话框
          </el-button>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script setup lang="tsx">
import { ElLoading, ElMessage } from 'element-plus';
import { dialog } from '@/components/core/Dialog';

// 动态创建简单对话框
const createSimpleDialog = () => {
  dialog.open({
    title: '简单对话框',
    content: '这是一个通过 Dialog.open 方法创建的简单对话框'
  });
};

// 动态创建复杂对话框
const createComplexDialog = () => {
  // 创建对话框实例
  const dialogInstance = dialog.open({
    title: '复杂对话框',
    width: '500px',
    content: () => (
      <div class="p-4">
        <p class="mb-4">这是一个通过TSX创建的复杂内容</p>
        <el-alert
          title="注意事项"
          type="warning"
          closable={false}
          class="mb-4"
        />
        <el-progress percentage={75} />
      </div>
    ),
    footer: () => (
      <div class="flex justify-between">
        <div>
          <el-button size="small">上一步</el-button>
        </div>
        <div>
          <el-button onClick={() => dialogInstance.close()}>取消</el-button>
          <el-button type="primary">下一步</el-button>
        </div>
      </div>
    )
  });
};

// 异步确认对话框
const createAsyncDialog = () => {
  dialog.open({
    title: '异步确认对话框',
    content: '点击确认按钮后会有3秒延迟',
    onBeforeOk: async () => {
      const loading = ElLoading.service({
        lock: true,
        text: '处理中...',
        background: 'rgba(0, 0, 0, 0.7)'
      });

      return new Promise<boolean>((resolve) => {
        setTimeout(() => {
          loading.close();
          ElMessage.success('处理完成');
          resolve(true);
        }, 3000);
      });
    }
  });
};

// 组件内容对话框
const createComponentDialog = () => {
  dialog.open({
    title: '组件内容对话框',
    width: '600px',
    content: () => (
      <div class="p-4">
        <el-form labelWidth="80px">
          <el-form-item label="标题">
            <el-input placeholder="请输入标题" />
          </el-form-item>
          <el-form-item label="描述">
            <el-input type="textarea" rows={3} placeholder="请输入描述" />
          </el-form-item>
          <el-form-item label="类型">
            <el-radio-group modelValue="A">
              <el-radio label="A">类型A</el-radio>
              <el-radio label="B">类型B</el-radio>
              <el-radio label="C">类型C</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-form>
      </div>
    )
  });
};
</script>

<style scoped>
.dialog-examples {
  max-width: 1200px;
  margin: 0 auto;
}

.example-section {
  border-radius: 4px;
}
</style>
