import { createApp } from 'vue'
import App from './App.vue'
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';
import router from './router'
import '@/styles/index.scss' // global css
import SvgIcon from '@/components/SvgIcon/index.vue' // svg component
import "virtual:svg-icons-register";
import axios from './api/axios'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'

const app = createApp(App);  // 创建 Vue 应用
app.config.globalProperties.$axios = axios;
app.component('svg-icon', SvgIcon)
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
  }
app.use(ElementPlus);
app.use(router); // 使用路由实例
app.mount('#app')
