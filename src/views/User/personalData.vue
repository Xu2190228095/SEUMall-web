<template>
    <div class="personal-data">
      <h2 style="font-size: 30px;">个人资料</h2>
      
      <div class="info-item">
        <label for="username">账号名:</label>
        <span id="username">JohnDoe123</span>
      </div>
      
      <div class="info-item">
        <label for="email">登录邮箱:</label>
        <span id="email">johndoe@example.com</span>
      </div>
      
      <div class="info-item">
        <label for="phone">绑定手机:</label>
        <span id="phone">+86 138 0000 0000</span>
      </div>
      
      <div class="info-item">
        <label for="dob">出生日期:</label>
        <span id="dob">1990-05-01</span>
      </div>
      
      <div class="info-item">
        <label for="gender">性别:</label>
        <span id="gender">男</span>
      </div>
      
      <div class="info-item">
        <label for="address">地址:</label>
        <span id="address">北京市朝阳区XX路XX号</span>
      </div>
  
      <!-- 可选操作按钮 -->
      <div class="actions">
        <el-button type="primary" @click="editProfile">编辑资料</el-button>
      </div>
    </div>
  </template>
  
  <script lang="ts" setup>
  import { defineProps, ref } from 'vue'
  
  const editProfile = () => {
    console.log("编辑资料按钮点击")
    // 这里可以处理跳转或弹出编辑框的操作
  }
  </script>
  
  <style scoped>
  .personal-data {
    font-family: Arial, sans-serif;
    padding: 20px;
    background-color: #fff;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }
  
  h2 {
    margin-bottom: 30px;
    margin-left: 10px;
  }
  
  .info-item {
    display: flex;
    margin-bottom: 20px;
    font-size: 20px;
    margin-left: 10px;
  }
  
  .info-item label {
    width: 100px;
    font-weight: bold;
  }
  
  .info-item span {
    flex: 1;
    color: #555;
  }
  
  .actions {
    margin-top: 20px;
    text-align: right;
  }
  
  .el-button {
    background-color: #409EFF;
    color: white;
    border: none;
  }
  </style>
  