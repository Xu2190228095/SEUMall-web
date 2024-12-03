import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router';
import HelloWorld from '@/components/HelloWorld.vue'  //引入根目录下的Hello.vue组件

const router = new createRouter({
  history: createWebHistory(),  
  routes: [
    {
      path: '/',     //根路径
      name: 'Hello',  //路由名称
      component: HelloWorld  //路由组件
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
          path: '/admin',
          name: 'Admin',
          component: () => import('@/views/admin/index.vue')
      },
    {
        path: '/productInterface',
        name: 'productInterface',
        component: () => import('@/views/User/productInterface.vue')//商品界面
    },
  ]
})   //创建Router实例                                     

export default router   //导出Router实例

