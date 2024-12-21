<template>
  <div id="search-page">
    <!-- 顶部导航栏 -->
        <el-header class="header">
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
      <el-aside width="200px" class="sidebar">
        <!-- 筛选商品来源 -->
        <el-select v-model="selectedSource" placeholder="选择商品来源">
          <el-option label="淘宝" value="taobao"></el-option>
          <el-option label="天猫" value="tmall"></el-option>
        </el-select>

        <!-- 排序 -->
        <el-select v-model="sortBy" placeholder="选择排序方式" @change="handleSort">
          <el-option label="综合" value="default"></el-option>
          <el-option label="销量" value="sales"></el-option>
          <el-option label="价格" value="price"></el-option>
        </el-select>
      </el-aside>

      <el-main>
        <div class="product-list">
          <el-row gutter="20">
            <el-col v-for="(product, index) in filteredProducts" :key="index" :span="6">
              <el-card :body-style="{ padding: '20px' }">
                <img :src="product.img" class="product-image" />
                <div class="product-info">
                  <p>{{ product.pname }}</p>
                  <p>数量: {{ product.number }}</p>
                  <p>价格: ¥{{ product.price }}</p>
                  <el-button type="primary" size="small" @click="gotoProducts(product)">查看</el-button>
                </div>
              </el-card>
            </el-col>
          </el-row>
        </div>
      </el-main>
    </el-container>
  </div>
</template>

<script>
import { ref, watchEffect } from 'vue';
import { ElSelect, ElOption, ElInput, ElButton, ElRow, ElCol, ElCard, ElMessage } from 'element-plus';
import { useRoute, useRouter } from 'vue-router';
import axios from 'axios';
import { search } from '@/api/product'
import request from '@/api/axios';
import productImage_chocolate from '@/assets/images/chocolate.jpg';
import productImage_shoe from '@/assets/images/shoe.jpg';
import productImage_sweatshirt from '@/assets/images/sweatshirt.jpg';
import productImage_esteelauder from '@/assets/images/esteelauder.jpg';
import productImage_pocket from '@/assets/images/pocket.jpg';


export default {
  components: {
    ElSelect,
    ElOption,
    ElInput,
    ElButton,
    ElRow,
    ElCol,
    ElCard,
    ElMessage
  },
  setup() {
    const route = useRoute();
    const router = useRouter();

    // 从路由参数获取搜索关键词
    const searchQuery = ref(route.query.productname || '');  // 如果没有查询参数则默认为空字符串
    const selectedSource = ref('');  // 商品来源
    const sortBy = ref('default');  // 排序方式

    // 商品列表和过滤后的商品列表
    const products = ref([]);
    const filteredProducts = ref([]);

    // 从后端获取商品数据
    const fetchProducts = async () => {
      try {
        const response = await request.get('http://localhost:8080/product/findByProductname', {
          params: { productname: searchQuery.value }  // 请求带上搜索关键字
        });
        // 如果返回的是单个商品，转为数组
        const productsData = Array.isArray(response.data) ? response.data : [response.data];

        products.value = productsData;  // 将返回的商品数据存入

        console.log('查询到的商品数据:', products.value);
            products.value.forEach(product => {
              console.log(`商品名称: ${product.pname}, 价格: ${product.price}, 数量: ${product.number}`);
            });

        filterProducts();  // 获取商品数据后进行过滤

        // 如果没有查询到商品，弹出提示信息
        if (products.value.length === 0) {
              ElMessage({
              message: '没有查询到该商品',
              type: 'warning',
              });
            }
      } catch (error) {
        console.error('获取商品数据失败:', error);
        ElMessage({
          message: '查询商品时发生错误，请稍后再试',
          type: 'error',
        });
      }
    };

    // 过滤商品，根据搜索关键词和筛选条件更新商品列表
    const filterProducts = () => {
      filteredProducts.value = products.value.filter(product => {
        const matchesKeyword = product.pname && product.pname.toLowerCase().includes(searchQuery.value.toLowerCase());
        const matchesSource = selectedSource.value ? product.pclass === selectedSource.value : true;
        return matchesKeyword && matchesSource;
      });
      handleSort();  // 执行排序
    };

    // 排序商品列表
    const handleSort = () => {
      filteredProducts.value.sort((a, b) => {
        if (sortBy.value === 'sales') {
          return b.number - a.number;  // 销量降序
        }
        if (sortBy.value === 'price') {
          return a.price - b.price;  // 价格升序
        }
        return 0;  // 默认不排序
      });
    };

    // 搜索功能：点击搜索按钮时更新路由并获取商品
    const searchProducts = () => {
      if (searchQuery.value.trim()) {
        router.push({ name: 'productSearch', query: { q: searchQuery.value } });  // 更新路由
        fetchProducts();  // 调用 fetchProducts 获取商品数据
      }
    };

    // 监听路由变化：每次路由参数变化时重新获取数据
    watchEffect(() => {
      if (route.query.q) {
        searchQuery.value = route.query.q;  // 更新搜索关键词
        fetchProducts();  // 重新获取商品
      }
    });

    const gotoProducts = (product) => {
      // 打印出 product 对象和 product.id
      console.log('Product:', product);
      console.log('Product ID:', product ? product.id : 'No ID');

      if (product && product.id) {
        // 确保 product.id 是有效的
        router.push({ path: '/productDetail', query: { productid: product.id } });
      } else {
        console.error('Invalid product ID:', product);
        ElMessage.error('商品 ID 无效');
      }
    };



    // 初始化：获取商品数据
    fetchProducts();

    return { searchQuery, selectedSource, sortBy, filteredProducts, handleSort, searchProducts, gotoProducts };
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