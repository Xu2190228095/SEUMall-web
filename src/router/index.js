import { createRouter, createWebHistory } from 'vue-router'

import Test1 from '../views/home/test1.vue'

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),//路由模式，默认
    routes: [//路由配置 通过路由进行整体配置
//数组，
        {
            path:'/Test1',
            component:Test1,

        },
    ]
})

export default router//暴漏router对象，以便在Vue应用的入口文件中导入并使用它。

