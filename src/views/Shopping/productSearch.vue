<template>
  <div id="search-page">
    <!-- 顶部导航栏 -->
        <el-header class="header">
          <el-button type="primary" 
          class="menu-btn" 
          style="margin-left: 10px;"
          @click="$router.push('/homePage')">首页</el-button>
          <div class="logo">东南易购</div>
          <el-input
            v-model="searchQuery"
            class="search-bar"
            placeholder="搜索商品"
            prefix-icon="el-icon-search"
            style="width: 300px; height: 40px;"
            @keyup.enter="search"
          >
            <template #append>
              <el-button
                type="primary"
                @click="searchProducts"
                style="height: 100%; padding: 0 10px;">
                搜索
              </el-button>
            </template>
          </el-input>
        </el-header>

    <el-container>


      <el-main>
        <el-row gutter="20" style="margin-left: 80px; margin-right: 80px;">
            <el-col v-for="(product, index) in Products" :key="index" :span="4">
              <router-link :to="`/login`">
                <img :src="images[index]" class="product-image" style="border-radius: 10px;"/>
                <div class="product-info">
                  <p style="overflow: hidden; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical;">
                    <span style="font-size: 18px; color:brown;">{{ product.pname }}</span>
                    {{ product.desc }}
                  </p>
                  <p style="color: crimson;">¥{{ product.price }}</p>
                </div>
              </router-link>
            </el-col>
        </el-row>
      </el-main>
    </el-container>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { ElSelect, ElOption, ElInput, ElButton, ElRow, ElCol, ElCard, ElMessage } from 'element-plus';
import { useRoute, useRouter } from 'vue-router';
import axios from 'axios';
import { search } from '@/api/product'
import { getProductsByClass } from '../../api/product';

const Products = ref([])
const images = ref([])
function handleClick(text) {
  const pclass = text === '全部' ? null : {productClass:text};  // 分类名称为空时，获取全部商品
  getProductsByClass(pclass).then(res => {
    console.log(res);
    Products.value = res.data.products;
    images.value = res.data.pictures.map(picture => `data:image/jpg;base64,${picture}`);
  })
}
onMounted(() => {
  handleClick('全部');
})
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