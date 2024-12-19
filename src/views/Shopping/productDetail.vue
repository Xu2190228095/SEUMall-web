<template>
  <div class="product-detail-container">
    <h1>商品详情</h1>

    <!-- 显示商品的详细信息 -->
    <div v-if="product" class="product-detail">
      <img :src="product.img" alt="商品图片" class="product-image" />
      <div class="product-info">
        <h2>{{ product.pname }}</h2>
        <p><strong>价格:</strong> ¥{{ product.price }}</p>
        <p><strong>数量:</strong> {{ product.number }}</p>
        <p><strong>类别:</strong> {{ product.pclass }}</p>
        <p><strong>描述:</strong> {{ product.desc }}</p>
        <el-button type="primary" size="small" :href="`/productDetail/${product.id}`">加入购物车</el-button>
      </div>
    </div>

    <!-- 加载中状态 -->
    <div v-else class="loading">
      <el-spinner></el-spinner>
      <p>加载商品详情中...</p>
    </div>

    <!-- 错误信息 -->
    <div v-if="error" class="error-message">
      <el-message type="error">{{ error }}</el-message>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import axios from 'axios';
import request_id from '@/api/axios';

// 获取路由中的 id 参数
const route = useRoute();
const productId = route.params.id;  // 通过路由获取商品的 id

// 定义商品详情的响应数据
const product = ref(null);
const error = ref(null);

// 获取商品详细数据的函数
const fetchProductDetails = async () => {
  try {
    const response = await request.get('http://localhost:8080/product/findByProductid');
    console.log('查询到的商品数据:', products.value);
                products.value.forEach(product => {
                  console.log(`商品名称: ${product.pname}, 价格: ${product.price}, 数量: ${product.number}`);
                });
    product.value = response.data;  // 将返回的数据存储到 product 中
  } catch (err) {
    console.error('获取商品详情失败:', err);
    error.value = '获取商品详情失败，请稍后再试！';
  }
};

// 在组件挂载时调用 fetchProductDetails 获取商品数据
onMounted(() => {
  fetchProductDetails();
});
</script>

<style scoped>
.product-detail-container {
  width: 80%;
  margin: 0 auto;
  padding: 20px;
}

.product-detail {
  display: flex;
  flex-direction: row;
  gap: 20px;
}

.product-image {
  width: 300px;
  height: 300px;
  object-fit: cover;
  border-radius: 8px;
}

.product-info {
  flex: 1;
}

.product-info h2 {
  font-size: 2em;
  margin-bottom: 20px;
}

.product-info p {
  font-size: 1.2em;
  margin: 5px 0;
}

.loading {
  text-align: center;
  font-size: 1.5em;
}

.error-message {
  color: red;
  font-size: 1.2em;
  text-align: center;
  margin-top: 20px;
}
</style>
