<template>
  <div id="app">
    <!-- 顶部导航栏 -->
    <el-header class="header">
      <div class="logo">购物网站</div>
      <el-input
        class="search-bar"
        placeholder="搜索商品"
        prefix-icon="el-icon-search"
        style="width: 300px; height: 40px;"
      >
        <template #append>
          <el-button type="primary" :icon="Search" style="height: 100%; padding: 0 10px;">
            搜索
          </el-button>
        </template>
      </el-input>
    </el-header>

    <el-container>
      <!-- 左侧商品分类树 -->
      <el-aside width="200px" class="sidebar">
        <el-tree
          :data="categories"
          :props="treeProps"
          accordion
          default-expand-all
        />
      </el-aside>

      <el-main>
        <!-- 轮播图展示 -->
        <el-carousel :interval="4000" arrow="always" type="card" class="carousel">
          <el-carousel-item v-for="(item, index) in carouselItems" :key="index">
            <img :src="item.image" alt="Carousel Image" />
          </el-carousel-item>
        </el-carousel>

        <!-- 热门商品展示 -->
        <div class="hot-products">
          <h2>热门商品</h2>
          <el-row gutter="20">
            <el-col v-for="(product, index) in hotProducts" :key="index" :span="6">
              <el-card :body-style="{ padding: '20px' }">
                <img :src="product.image" class="product-image" />
                <div class="product-info">
                  <p>{{ product.name }}</p>
                  <el-button type="primary" size="small" :href="product.link">查看</el-button>
                </div>
              </el-card>
            </el-col>
          </el-row>
        </div>
      </el-main>

      <!-- 右侧用户信息和侧边栏 -->
      <el-aside width="300px" class="right-sidebar">
        <!-- 用户信息 -->
        <div class="user-info">
          <el-avatar size="large" src="https://randomuser.me/api/portraits/men/41.jpg"></el-avatar>
          <p class="user-name">用户名</p>
          <el-button type="text">收藏夹</el-button>
          <el-button type="text">购物车</el-button>
        </div>

        <!-- 侧边栏 -->
        <el-menu class="sidebar-menu" mode="vertical">
          <el-menu-item index="1">消息</el-menu-item>
          <el-menu-item index="2">购物车</el-menu-item>
          <el-menu-item index="3">客服</el-menu-item>
        </el-menu>
      </el-aside>
    </el-container>
  </div>
</template>

<script>
import { ElContainer, ElHeader, ElInput, ElAside, ElMain, ElCarousel, ElCarouselItem, ElTree, ElRow, ElCol, ElCard, ElButton, ElAvatar, ElMenu, ElMenuItem } from 'element-plus';
import { Search } from '@element-plus/icons-vue';
import productImage1 from '@/assets/images/1.png';
import productImage2 from '@/assets/images/2.png';
import productImage3 from '@/assets/images/3.png';
import productImage4 from '@/assets/images/4.png';

export default {
  components: {
    ElContainer,
    ElHeader,
    ElInput,
    ElAside,
    ElMain,
    ElCarousel,
    ElCarouselItem,
    ElTree,
    ElRow,
    ElCol,
    ElCard,
    ElButton,
    ElAvatar,
    ElMenu,
    ElMenuItem,
    Search
  },
  data() {
    return {
      // 商品分类数据
      categories: [
        { label: '电子产品', children: [{ label: '手机' }, { label: '电脑' }, { label: '耳机' }] },
        { label: '家居生活', children: [{ label: '家具' }, { label: '厨房用品' }, { label: '床上用品' }] },
        { label: '服饰鞋包', children: [{ label: '男装' }, { label: '女装' }, { label: '鞋子' }] },
      ],
      // 轮播图数据
      carouselItems: [
        { name: 'iPhone 13', image: productImage1, link: 'https://www.apple.com/cn/iphone-13/' },
        { name: 'MacBook Pro 16', image: productImage2, link: 'https://www.apple.com/cn/macbook-pro-16/' },
        { name: 'AirPods Pro', image: productImage3, link: 'https://www.apple.com/cn/airpods-pro/' },
        { name: '华为MateBook X Pro', image: productImage4, link: 'https://www.huawei.com/cn/laptops/matebook-x-pro' }
      ],
      // 热门商品数据
      hotProducts: [
        { name: 'iPhone 13', image: productImage1, link: 'https://www.apple.com/cn/iphone-13/' },
        { name: 'MacBook Pro 16', image: productImage2, link: 'https://www.apple.com/cn/macbook-pro-16/' },
        { name: 'AirPods Pro', image: productImage3, link: 'https://www.apple.com/cn/airpods-pro/' },
        { name: '华为MateBook X Pro', image: productImage4, link: 'https://www.huawei.com/cn/laptops/matebook-x-pro' }
      ],
      // 商品分类树结构
      treeProps: {
        children: 'children',
        label: 'label'
      }
    };
  }
};
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
