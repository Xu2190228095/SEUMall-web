<template>
    <div class="security-settings">
      <h2 style="font-size: 30px;">安全设置</h2>
  
      <!-- 修改密码 -->
      <div class="setting-item">
        <h3>修改密码</h3>
        <el-form :model="form" ref="formRef" label-width="120px">
          <el-form-item label="当前密码" prop="currentPassword" :rules="passwordRules">
            <el-input type="password" v-model="form.currentPassword" placeholder="请输入当前密码" />
          </el-form-item>
          <el-form-item label="新密码" prop="newPassword" :rules="passwordRules">
            <el-input type="password" v-model="form.newPassword" placeholder="请输入新密码" />
          </el-form-item>
          <el-form-item label="确认密码" prop="confirmPassword" :rules="passwordRules">
            <el-input type="password" v-model="form.confirmPassword" placeholder="确认新密码" />
          </el-form-item>
          <el-button type="primary" @click="handlePasswordChange">修改密码</el-button>
        </el-form>
      </div>
  
      <!-- 两步验证 -->
      <div class="setting-item">
        <h3>两步验证</h3>
        <el-switch v-model="twoFactorEnabled" active-text="开启" inactive-text="关闭" />
        <p>启用两步验证后，每次登录都会要求您输入手机短信验证码或使用认证应用。</p>
      </div>
  
      <!-- 设备管理 -->
      <div class="setting-item">
        <h3>已登录设备</h3>
        <el-table :data="devices" style="width: 100%">
          <el-table-column prop="device" label="设备" />
          <el-table-column prop="lastLogin" label="最后登录时间" />
          <el-table-column
            label="操作"
            width="180"
            :render-header="renderHeader"
          >
            <template #default="scope">
              <el-button size="mini" @click="logoutDevice(scope.row.device)">退出</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
  
      <!-- 登录历史 -->
      <div class="setting-item">
        <h3>账户登录历史</h3>
        <el-table :data="loginHistory" style="width: 100%">
          <el-table-column prop="location" label="登录地点" />
          <el-table-column prop="date" label="登录时间" />
        </el-table>
      </div>
  
      <!-- 退出所有设备 -->
      <div class="setting-item">
        <h3>退出所有设备</h3>
        <el-button type="danger" @click="logoutAllDevices">退出所有设备</el-button>
        <p>在所有设备上退出登录，确保账号安全。</p>
      </div>
    </div>
  </template>
  
  <script lang="ts" setup>
  import { ref } from 'vue'
  
  // 密码修改表单
  const form = ref({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })
  const passwordRules = [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, message: '密码长度不能小于 6 位', trigger: 'blur' }
  ]
  
  // 两步验证
  const twoFactorEnabled = ref(false)
  
  // 设备管理
  const devices = ref([
    { device: 'iPhone 13', lastLogin: '2024-12-01 08:30' },
    { device: 'MacBook Pro', lastLogin: '2024-12-01 10:45' },
    { device: 'Windows PC', lastLogin: '2024-12-01 12:00' }
  ])
  
  // 登录历史
  const loginHistory = ref([
    { location: '上海', date: '2024-12-01 08:00' },
    { location: '北京', date: '2024-12-01 09:30' },
    { location: '广州', date: '2024-12-01 10:15' }
  ])
  
  // 修改密码
  const handlePasswordChange = () => {
    console.log('密码修改:', form.value)
    // 在这里执行密码修改的逻辑
  }
  
  // 退出设备
  const logoutDevice = (device: string) => {
    console.log(`退出设备: ${device}`)
    // 在这里执行退出设备的逻辑
  }
  
  // 退出所有设备
  const logoutAllDevices = () => {
    console.log('退出所有设备')
    // 在这里执行退出所有设备的逻辑
  }
  </script>
  
  <style scoped>
  .security-settings {
    padding: 20px;
  }
  
  .setting-item {
    margin-bottom: 20px;
  }
  
  h3 {
    margin-bottom: 10px;
  }
  
  .el-table {
    margin-top: 10px;
  }
  
  .el-button {
    margin-top: 10px;
  }

  .el-form-item {
    text-align: left; /* 标签左对齐 */
    }

    .el-input {
    width: 80%; /* 输入框填满父容器 */
    }
    </style>
  