<template>
    <div class="delivery-address-management">
      <h2>收货地址管理</h2>
  
      <!-- 显示加载中 -->
      <el-spin v-if="loading" size="large" />
  
      <!-- 显示错误信息 -->
      <el-alert v-if="error" type="error" :title="error" />
  
      <!-- 显示地址信息 -->
      <div v-if="!loading && !error && addressInfo">
        <el-row class="address-item">
          <el-col :span="6"><strong>收货人：</strong></el-col>
          <el-col :span="18">{{ addressInfo.recipient }}</el-col>
        </el-row>
  
        <el-row class="address-item">
          <el-col :span="6"><strong>联系电话：</strong></el-col>
          <el-col :span="18">{{ addressInfo.phone }}</el-col>
        </el-row>
  
        <el-row class="address-item">
          <el-col :span="6"><strong>收货地址：</strong></el-col>
          <el-col :span="18">{{ addressInfo.address }}</el-col>
        </el-row>
  
        <el-row class="address-item">
          <el-col :span="6"><strong>邮政编码：</strong></el-col>
          <el-col :span="18">{{ addressInfo.zipCode }}</el-col>
        </el-row>
  
        <el-button type="primary" @click="editAddress" style="margin-top: 20px;">修改收货地址</el-button>
      </div>
    </div>
  </template>
  
  <script lang="ts" setup>
  import { ref, onMounted } from 'vue'
  import axios from 'axios'
  // import { ElSpin, ElAlert, ElButton } from 'element-plus'
  
  // 用来存储地址信息
  const addressInfo = ref({
    recipient: '',
    phone: '',
    address: '',
    zipCode: ''
  })
  
  // 状态变量
  const loading = ref(true)
  const error = ref('')
  
  // 获取收货地址的 API 地址
  const apiUrl = 'https://api.example.com/user/address'
  
  // 获取数据
  const fetchAddressInfo = async () => {
    try {
      const response = await axios.get(apiUrl)
      addressInfo.value = response.data || {} // 将 API 返回的数据赋值给 addressInfo
    } catch (err) {
      error.value = '无法获取收货地址信息，请稍后重试。' // 错误提示
    } finally {
      loading.value = false // 数据加载完毕，停止加载状态
    }
  }
  
  // 编辑收货地址
  const editAddress = () => {
    // 假设跳转到地址编辑页面（此处只做演示）
    alert('跳转到修改地址页面')
  }
  
  // 组件挂载时调用
  onMounted(() => {
    fetchAddressInfo()
  })
  </script>
  
  <style scoped>
  .delivery-address-management {
    padding: 20px;
  }
  
  .address-item {
    margin-bottom: 15px;
  }
  
  .el-row {
    margin-bottom: 10px;
  }
  
  strong {
    font-weight: bold;
  }
  
  .el-button {
    width: 100%;
  }
  </style>
  