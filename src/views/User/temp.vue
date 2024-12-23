<!-- 测试文档，测试后端接口用 -->

<template>
    <div id="product-details">
      <!-- 判断是否加载完数据 -->
      <div v-if="loading">加载中...</div>
      <div v-else>
        <h2>{{ product.pname }}</h2>
        <p><strong>价格：</strong>{{ product.price }}元</p>
        <p><strong>数量：</strong>{{ product.number }}</p>
        <p><strong>类别：</strong>{{ product.pclass }}</p>
        <p><strong>描述：</strong>{{ product.desc }}</p>
        <img :src="product.img" alt="商品图片" />
      </div>
      <div v-if="error" class="error">
        <p>无法加载商品信息！</p>
      </div>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  import { fetchProduct} from '../../api/product'; // 引入封装的接口
  
  export default {
    data() {
      return {
        product: {},    // 存储商品信息
        loading: false, // 加载状态
        error: false,   // 错误状态
      };
    },
    methods: {
      // 获取商品信息的方法
      fetchProduct(productid) {
        this.loading = true; // 设置加载状态
        axios
          .get(`http://localhost:8080/product/fetchProduct`, {
            params: { productid },
          })
          .then((response) => {
            this.product = response.data; // 将返回的商品信息赋值给product
            this.loading = false; // 结束加载状态
          })
          .catch((error) => {
            console.error('获取商品信息失败:', error);
            this.error = true; // 设置错误状态
            this.loading = false; // 结束加载状态
          });
      },
    },
    mounted() {
      const productid = 1; // 假设你要显示的商品ID
      this.fetchProduct(productid); // 组件加载时调用fetchProduct方法
    },
  };
  </script>
  
  <style scoped>
  /* 样式可以根据需求自定义 */
  #error {
    color: red;
  }
  </style>
  