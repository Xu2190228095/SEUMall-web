<template>
  <div class="layout">
    <Sidebar />
    <div class="main-container">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
import Sidebar from '@/views/admin/product/test_side_bar.vue';

export default {
  name: 'Layout',
  components: {
    Sidebar,
  },
};
</script>

<style scoped>
/* 布局样式 */
.layout {
  display: flex;
}

.sidebar {
  /* 侧边栏样式 */
  width: 250px;
}

.content {
  /* 内容区域样式 */
  flex-grow: 1;
  padding-left: 20px; /* 根据需要调整 */
}
</style>