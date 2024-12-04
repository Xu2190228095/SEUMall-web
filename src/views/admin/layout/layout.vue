<template>
  <div class="layout">
    <sidebar class="sidebar-container"></sidebar>
    <div class="main-container">
      <app-main></app-main>
    </div>
  </div>
</template>

<script>
import Sidebar from '@/views/admin/product/test_side_bar.vue';
import { AppMain } from './components'

export default {
  name: 'Layout',
  components: {
    Sidebar,
    AppMain
  },
};
</script>

<style scoped>
/* 布局样式 */
.layout {
  display: grid;
  grid-template-columns: 1fr auto; /* 创建一个自动宽度的列用于靠右对齐 */
}

.sidebar-container {
  grid-column: 1; /* 将这个项目放置在第二列（即自动宽度的列） */
}

.main-container {
  grid-column: 2; /* 将这个项目放置在第二列（即自动宽度的列） */
}
</style>