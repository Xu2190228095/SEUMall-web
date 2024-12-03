<template>
    <div class="account-binding">
      <h2>账号绑定信息</h2>
  
      <!-- 显示加载中 -->
      <el-spin v-if="loading" size="large" />
  
      <!-- 显示错误信息 -->
      <el-alert v-if="error" type="error" :title="error" />
  
      <!-- 显示信息 -->
      <div v-if="!loading && !error">
        <!-- 邮箱绑定信息 -->
        <div class="info-item" v-if="accountInfo.email">
          <el-row>
            <el-col :span="6"><strong>绑定邮箱：</strong></el-col>
            <el-col :span="18">{{ accountInfo.email }}</el-col>
          </el-row>
        </div>
  
        <!-- 手机绑定信息 -->
        <div class="info-item" v-if="accountInfo.phone">
          <el-row>
            <el-col :span="6"><strong>绑定手机：</strong></el-col>
            <el-col :span="18">{{ accountInfo.phone }}</el-col>
          </el-row>
        </div>
  
        <!-- 微信绑定信息 -->
        <div class="info-item" v-if="accountInfo.wechat">
          <el-row>
            <el-col :span="6"><strong>绑定微信：</strong></el-col>
            <el-col :span="18">{{ accountInfo.wechat }}</el-col>
          </el-row>
        </div>
  
        <!-- 支付宝绑定信息 -->
        <div class="info-item" v-if="accountInfo.alipay">
          <el-row>
            <el-col :span="6"><strong>绑定支付宝：</strong></el-col>
            <el-col :span="18">{{ accountInfo.alipay }}</el-col>
          </el-row>
        </div>
      </div>
    </div>
  </template>
  
  <script lang="ts" setup>
  import { ref, onMounted } from 'vue'
  import axios from 'axios'
  import { ElSpin, ElAlert } from 'element-plus'
  import 'element-plus/dist/index.css'

  
  // 用来存储账号绑定信息
  const accountInfo = ref({
    email: '',
    phone: '',
    wechat: '',
    alipay: ''
  })

//   const accountInfo = ref({
//     email: "user@example.com",
//     phone: "+86 138 0000 0000",
//     wechat: "userWechatID",
//     alipay: "userAlipayID"
//   })

  
  // 状态变量
  const loading = ref(true)
  const error = ref('')
  
  // 获取账号绑定信息的 API 地址
  //const apiUrl = 'https://api.example.com/user/account-info'
  
  // 获取数据
//   const fetchAccountInfo = async () => {
//     try {
//       const response = await axios.get(apiUrl)
//       accountInfo.value = response.data || {} // 将 API 返回的数据赋值给 accountInfo
//     } catch (err) {
//       error.value = '无法获取账号绑定信息，请稍后重试。' // 错误提示
//     } finally {
//       loading.value = false // 数据加载完毕，停止加载状态
//     }
//   }
  
  // 组件挂载时调用
  onMounted(() => {
    //fetchAccountInfo();
    console.log('组件已挂载，开始模拟数据加载...');
    setTimeout(() => {
        accountInfo.value = {
            email: 'user@example.com',
            phone: '+86 138 0000 0000',
            wechat: 'userWechatID',
            alipay: 'userAlipayID'
        }
        loading.value = false // 模拟 API 请求延迟
    }, 2000) // 2秒后停止加载
  })
  </script>
  
  <style scoped>
  .account-binding {
    padding: 20px;
  }
  
  .info-item {
    margin-bottom: 15px;
  }
  
  .el-row {
    margin-bottom: 10px;
  }
  
  strong {
    font-weight: bold;
  }
  
  /* 为了提示加载和错误，调整样式 */
  .el-alert {
    margin-top: 20px;
  }
  </style>
  