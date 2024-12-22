<template>
  <div class="product-detail-container">
    <h1>商品详情</h1>

    <div v-if="product" class="product-detail">
      <img :src="product.img" alt="商品图片" class="product-image" />
      <div class="product-info">
        <h2>{{ product.pname }}</h2>
        <p><strong>价格:</strong> ¥{{ product.price }}</p>
        <p><strong>数量:</strong> {{ product.number }}</p>
        <p><strong>类别:</strong> {{ product.pclass }}</p>
        <p><strong>描述:</strong> {{ product.desc }}</p>
        <el-button type="primary" size="small">加入购物车</el-button>
      </div>
    </div>

    <!-- 错误信息 -->
    <div v-if="error" class="error-message">
      <el-message type="error">{{ error }}</el-message>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import request from '@/api/axios';

export default {
  setup() {
    const route = useRoute();  // 获取当前路由对象
    const productId = ref(route.query.productid);  // 获取查询参数中的 productid
    console.log('Product ID from query:', productId.value);

    const product = ref(null);  // 商品数据
    const error = ref(null);  // 错误信息

    // 获取商品详细数据的函数
    const fetchProductDetails = async () => {
      try {
        const response = await request.get(`http://localhost:8080/product/findByProductid?productid=${productid.value}`);
        product.value = response.data;  // 将返回的数据存储到 product 中
      } catch (err) {
        console.error('获取商品详情失败:', err);
        error.value = '获取商品详情失败，请稍后再试！';
      }
    };

    // 在组件挂载时调用 fetchProductDetails 获取商品数据
    onMounted(() => {
      console.log('Product ID:', productId.value);  // 打印出传递的 productid
      fetchProductDetails();  // 调用函数获取商品详情
    });

    return { product, error };
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
