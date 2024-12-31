import { createRouter, createWebHistory } from 'vue-router';
import Layout from '@/views/admin/layout/layout.vue'
import HelloWorld from '@/components/HelloWorld.vue'  //引入根目录下的Hello.vue组件

const router = new createRouter({
  history: createWebHistory(),  
  routes: [
    {
      path: '/',     //根路径
      name: 'Hello',  //路由名称
      component: HelloWorld,  //路由组件
    },
    {
        path: '/home',
        name: 'Home',
        component: () => import('@/views/admin/layout/layout2.vue')  //懒加载
    },
    {
        path: '/login',
        name: 'Login',
        component: () => import('@/views/User/login.vue')
    },
    {
        path: '/register',
        name: 'Register',
        component: () => import('@/views/User/register.vue')
    },
      {
          path: '/try_test', //佟若祎专门用来测试的页面
          name: 'try_test',
          component: () => import('@/views/admin/product/test_1231_download.vue')
      },
      {
          path: '/product',
          name: 'Product',
          component: () => import('@/views/admin/product/index.vue'),
          meta: { layout: Layout },
      },
      {
          path: '/admin',
          name: 'Admin',
          component: Layout,
          children: [{
              path: 'product_info',
              name: 'product_info',
              component: () => import('@/views/admin/product/ProductInfo.vue'),
            },
            {
                path: 'product_add',
                name: 'product_add',
                component: () => import('@/views/admin/product/AddProduct.vue'),
            },
            {
                path: 'refund_deal',
                name: 'refund_deal',
                component: () => import('@/views/admin/product/RefundDeal.vue'),
            },
            {
              path: 'order_info',
              name: 'order_info',
              component: () => import('@/views/admin/order/orderInfo.vue'),
            },
            {
              path: 'order_detail',
              name: 'order_detail',
              component: () => import('@/views/admin/order/orderDetail.vue'),
          },
          ]
      },
      {
          path: '/adminUser',
          name: 'adminUser',
          component: () => import('@/views/admin/layout/layout2.vue'),
          children: [{
            path: 'user_info',
            name: 'user_info',
            component: () => import('@/views/admin/user/userManage.vue'),
            },
          ]
      },
      {
          path: '/sellerInfo',
          name: 'sellerInfo',
          component: () => import('@/views/admin/user/SellerInfo.vue'),
      },
    {
        path: '/productInterface',
        name: 'productInterface',
        component: () => import('@/views/User/goodsDetail.vue')//商品界面
    },
    {
        path: '/temp',
        name: 'temp',
        component: () => import('@/views/User/temp.vue')//商品界面
    },
    {
      path: '/userInfo',
      name: 'userInfo',
      component: () => import('@/views/User/userInfo.vue')//个人信息界面
    },
    {
      path: '/pay',
      name: 'pay',
      component: () => import('@/views/Shopping/pay.vue')//个人信息界面
    },
    {
       path: '/homePage',     //根路径
       name: 'homePage',  //路由名称
       component: () => import('@/views/Shopping/homepage.vue') //路由组件
    },
    {
        path: '/productSearch',  // 搜索商品页面路径
        name: 'productSearch',
        component: () => import('@/views/Shopping/productSearch.vue'),  // 新增的商品搜索结果页面
        props: route => ({ query: route.query.q })  // 获取查询参数
    },
    {
         path: '/productDetail',
         name: 'productDetail',
         component: () => import('@/views/Shopping/productDetail.vue'),  // 新增的商品搜索结果页面
         props: route => ({ productid: route.query.productid })  // 使用查询参数传递
    },
  ]
})   //创建Router实例


export default router   //导出Router实例

