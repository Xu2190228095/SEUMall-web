import { createApp } from 'vue'
import App from './App.vue'
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';
import router from './router'
import '@/styles/index.scss' // global css
import SvgIcon from '@/components/SvgIcon/index.vue' // svg component
import "virtual:svg-icons-register";

const app = createApp(App);  // 创建 Vue 应用
app.component('svg-icon', SvgIcon)
app.use(ElementPlus);
app.use(router); // 使用路由实例
app.mount('#app')
