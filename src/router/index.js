import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router';
import Sidebar from '@/views/admin/product/test_side_bar.vue'
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
        component: () => import('@/views/home/index.vue')  //懒加载
    },
    {
        path: '/login',
        name: 'Login',
        component: () => import('@/views/User/login.vue')
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
          component: () => import('@/views/admin/index.vue')
      },
      {
          path: '/test',
          name: 'Test',
          component: Layout,
          meta: {title: '商品', icon: 'product'},
          children: [{
              path: 'product',
              name: 'product',
              component: () => import('@/views/admin/product/index.vue'),
          }
          ]
      },
    {
        path: '/productInterface',
        name: 'productInterface',
        component: () => import('@/views/User/productInterface.vue')//商品界面
    },
    {
      path: '/userInfo',
      name: 'userInfo',
      component: () => import('@/views/User/userInfo.vue')//个人信息界面
    },
  ]
})   //创建Router实例

export const asyncRouterMap = [
    {
        path: '/pms',
        component: Layout,
        children: [{
            path: '/product',
            name: 'product',
            component: () => import('@/views/admin/product/index.vue'),
        }
        ]
    },
]

export default router   //导出Router实例

