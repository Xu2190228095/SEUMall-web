<template>
  <div class="tab-container">
    <el-tabs v-model="activeTab" :tab-position="tabPosition" class="demo-tabs">
      <el-tab-pane label="个人资料" name="personalData"></el-tab-pane>
      <el-tab-pane label="安全设置" name="securitySettings"></el-tab-pane>
      <el-tab-pane label="账号绑定信息" name="accountBindingInformation"></el-tab-pane>
      <el-tab-pane label="页面个性化" name="pagePersonalization"></el-tab-pane>
    </el-tabs>

    <div class="right-panel">
      <component :is="rightComponents[activeTab]" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, defineAsyncComponent } from 'vue'
import type { TabsInstance } from 'element-plus'

const tabPosition = ref<TabsInstance['tabPosition']>('left')
const activeTab = ref<string>('personalData')

// 使用 defineAsyncComponent 来延迟加载右侧组件
const rightComponents = {
  personalData: defineAsyncComponent(() => import('./personalData.vue')),
  securitySettings: defineAsyncComponent(() => import('./securitySettings.vue')),
  accountBindingInformation: defineAsyncComponent(() => import('./accountBindingInformation.vue')),
  pagePersonalization: defineAsyncComponent(() => import('./pagePersonalization.vue')),
}
</script>

<style>

.tab-container {
  display: flex;
  width: 100%; /* Ensure the container fills the whole viewport */
}

/* 控制Tab标签的长度 */
.demo-tabs {
  display: flex;
  flex-direction: column;
}

.el-tabs__header {
  display: flex;
  justify-content: space-between; /* 使标签水平分布 */
  flex-direction: column; /* 垂直排列Tab */
  height: 100%; /* 标签栏高度自适应 */
}

.el-tabs__item {
  width: auto; /* 标签的宽度会自动适应内容 */
  padding: 10px 40px; /* 可调整每个标签的内边距 */
  white-space: nowrap; /* 防止标签内容换行 */
}

.el-tabs__item {
  font-size: 18px; /* 修改字体大小 */
  margin-bottom: 30px;
  margin-right: 10px;
}

.right-panel {
  flex: 1; /* Right panel takes the remaining space */
  padding: 16px;
  border-left: 0px solid #ccc; /* Optional border between tabs and content */
}

</style>
