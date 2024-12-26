<template>
    <el-header class="header">
      <router-link class="logo" to="/homePage">东南易购</router-link>
    </el-header>
</template>

<script lang="ts">
  export default {
    name: 'SimpleHeader',
  };
</script>

<script setup lang="ts">
</script>

<style scoped>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  text-align: center;
}

.header {
  background-color: #409EFF;
  padding: 10px 0;
  color: white;
  display: flex;
  justify-content: center;  /* 让内容水平居中 */
  align-items: center;      /* 让内容垂直居中 */
}

.logo {
  font-size: 24px;
  font-weight: bold;
  margin-left: 20px;
  margin-right: 20px;  /* 增加与搜索框的距离 */
}

.search-bar {
  width: 300px;
  height: 40px;
}

.search-bar .el-input__prefix {
  color: white; /* 将搜索框图标颜色改为白色 */
}

.sidebar {
  background-color: #f4f4f4;
  padding: 20px;
}

.el-carousel__item h3 {
  color: #475669;
  opacity: 0.75;
  line-height: 300px;
  margin: 0;
  text-align: center;
}

.el-carousel__item:nth-child(2n) {
  background-color: #99a9bf;
}

.el-carousel__item:nth-child(2n + 1) {
  background-color: #d3dce6;
}

.product-image {
  width: 100%;          /* 让图片宽度占满容器宽度 */
  height: 200px;        /* 设置固定高度 */
  object-fit: cover;    /* 保持图片比例并裁剪 */
}

.hot-products {
  margin-top: 30px;
}

.carousel img {
  width: 100%;          /* 宽度为100%，保证图片占满整个容器 */
  height: 300px;        /* 高度固定，可以根据需要调整 */
  object-fit: cover;    /* 保持图片比例，裁剪多余部分，避免变形 */
}

.product-info {
  text-align: center;
  margin-top: 10px;
}

.right-sidebar {
  background-color: #f9f9f9;
  padding: 20px;
}

.user-info {
  text-align: center;
  margin-bottom: 20px;
}

.user-name {
  margin-top: 10px;
  font-weight: bold;
}

.sidebar-menu {
  margin-top: 20px;
}

.sidebar-menu .el-menu-item {
  padding: 10px 0;
}
</style>