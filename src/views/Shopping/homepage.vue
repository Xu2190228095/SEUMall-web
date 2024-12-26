<template>
  <div id="app">
    <Header/>

    <el-container>
      <!-- 左侧，商品分类树 -->
      <el-aside width="200px" class="sidebar">
        <div>
          <el-button
            v-for="button in buttons"
            :key="button.text"
            :type="button.type"
            @click="handleClick(button.text)"
            text
            style="width: 100%; margin-bottom: 10px; margin-left: 0%;"
          >
          {{ button.text }}
          </el-button>
        </div>
      </el-aside>

      <el-main>
        <!-- 轮播图展示 -->
        <el-card>
          <el-carousel :interval="4000" arrow="always" type="card" class="carousel">
            <el-carousel-item v-for="(item, index) in carouselItems" :key="index">
              <img :src="item.link" alt="轮播图" />
            </el-carousel-item>
          </el-carousel>
        </el-card>

        <!-- 热门商品展示 -->
        <div class="hot-products">
          <h2>热门商品</h2>
            <el-row gutter="20">
            <el-col v-for="(product, index) in hotProducts" :key="index" :span="6">
              <router-link :to="{ path: '/productInterface', query: { id: product.pid } }">
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
        </div>
      </el-main>

      <!-- 右侧，用户信息与侧边栏 -->
      <el-aside width="300px" class="right-sidebar">
        <!-- 用户信息 -->
        <router-link to="/userInfo">
        <div class="user-info">
          <el-avatar size="large" src="https://randomuser.me/api/portraits/men/41.jpg"></el-avatar>
          <p class="user-name">{{customerInfo.username}}</p>
        </div>
        </router-link>
        <div v-if="!logined">
        <el-button type="primary" style="width: 100%; margin-top: 20px;" @click=handleLogin>快速登录</el-button>
        <el-button text style="margin-top: 10px;">没有账号？去注册</el-button>
        </div>

        <el-menu class="sidebar-menu" mode="vertical">
          <el-menu-item index="1"><router-link to="/userInfo">个人信息</router-link></el-menu-item>
          <el-menu-item index="2">购物车</el-menu-item>
          <el-menu-item index="3">客服</el-menu-item>
        </el-menu>
        
      </el-aside>
      <!-- <el-footer style="text-align: center; margin-top: 20px;">

      </el-footer> -->
    </el-container>
  </div>

  <el-dialog
      :title="'快速登录'"
      v-model="dialogVisible"
      align-center
      width="30%">
      <el-form :model="customer"
               ref="customerForm"
               size="small">
        <el-form-item label="帐号：">
          <el-input v-model="customer.username" ></el-input>
        </el-form-item>
        <el-form-item label="密码：">
          <el-input v-model="customer.password"  type="password"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false" size="small">取 消</el-button>
        <el-button type="primary" @click="handleDialogConfirm()" size="small">确 定</el-button>
      </span>
    </el-dialog>
</template>

<script setup lang="ts">
import productImage1 from '@/assets/images/1.png';
import productImage2 from '@/assets/images/2.png';
import productImage3 from '@/assets/images/3.png';
import productImage4 from '@/assets/images/4.png';
import { onMounted, ref } from 'vue';
import { getProductsByClass } from '../../api/product';
import { auth,login } from '@/api/customer'
import {setToken_c} from '@/utils/auth'
import Header from '@/components/Header.vue';

// 商品分类数据
const buttons = [
  { type: '', text: '全部' },
  { type: '', text: '手机' },
  { type: '', text: '电脑' },
  { type: '', text: '耳机' },
  { type: '', text: '家具' },
  { type: '', text: '床上用品' },
  { type: '', text: '男装' },
  { type: '', text: '女装' },
  { type: '', text: '鞋子' },
]
// 轮播图数据
const carouselItems = ref([
  { name: 'iPhone 13', image: productImage1, link: 'https://2d.zol-img.com.cn/product/215_800x600/931/ceEZ5pBcvRQJQ.jpg' },
  { name: 'MacBook Pro 16', image: productImage2, link: 'https://www.apple.com/v/macbook-pro-14-and-16/b/images/overview/hero/hero_intro_endframe__e6khcva4hkeq_large.jpg' },
  { name: 'AirPods Pro', image: productImage3, link: 'https://tse1-mm.cn.bing.net/th/id/OIP-C.KWivfOMFFd0xyreIWDxvlQHaEK?rs=1&pid=ImgDetMain' },
  { name: '华为MateBook X Pro', image: productImage4, link: 'https://tse1-mm.cn.bing.net/th/id/OIP-C.mSkTgn_-cZxQKg3oN27trAHaDt?rs=1&pid=ImgDetMain' }
])
// 热门商品数据
const hotProducts = ref([])
const images = ref([])
function handleClick(text) {
  const pclass = text === '全部' ? null : {productClass:text};  // 分类名称为空时，获取全部商品
  getProductsByClass(pclass).then(res => {
    console.log(res);
    hotProducts.value = res.data.products;
    images.value = res.data.pictures.map(picture => `data:image/jpg;base64,${picture}`);
  })
}
onMounted(() => {
  handleClick('全部');
  if(localStorage.getItem('username')!=null){
    logined.value = true
    customerInfo.value.username = localStorage.getItem('username')
    customerInfo.value.id = localStorage.getItem('cid')
  }
})

const token = ref(null)  // 存储用户token，初始值为null
const dialogVisible = ref(false);
function handleLogin() {
  dialogVisible.value = true;
}
const customer = ref({});
const customerInfo = ref({
  username: '用户名',
  id: '？？？',
})
const logined = ref(false)
function handleDialogConfirm() {
  console.log(customer.value);
  auth(customer.value).then(res => {
              if (res.status === 200) {
                token.value = res.data.jwt
                setToken_c(token.value)
                console.log(token.value)
              } else {
                //showError.value = true
                console.error(res)
              }
            }).catch(err => {
              console.log(err)
            })
            login(customer.value).then(res => {
              if (res.status === 200) {
                    localStorage.setItem('username', res.data.username)
                    localStorage.setItem('cid', res.data.id)
                    logined.value = true
                    customerInfo.value.username = res.data.username
                    customerInfo.value.id = res.data.id
                } else {
                  console.error(res)
                }
            }).catch(err => {
              console.log(err)
            })
  dialogVisible.value = false;
}
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
