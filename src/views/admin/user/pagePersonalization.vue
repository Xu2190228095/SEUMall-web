<template>
    <div class="page-personalization">
      <h2 style="font-size: 30px;">页面个性化设置</h2>
  
      <!-- 主题切换 -->
      <el-form :model="form" label-width="160px">
        <el-form-item label="主题选择">
          <el-radio-group v-model="form.theme" @change="changeTheme">
            <el-radio label="light">浅色模式</el-radio>
            <el-radio label="dark">深色模式</el-radio>
          </el-radio-group>
        </el-form-item>
  
        <!-- 字体大小调整 -->
        <el-form-item label="字体大小">
          <el-slider v-model="form.fontSize" :min="12" :max="30" step="1" @change="changeFontSize" />
          <span>{{ form.fontSize }} px</span>
        </el-form-item>
  
        <!-- 显示/隐藏侧边栏 -->
        <el-form-item label="显示侧边栏">
          <el-switch v-model="form.sidebarVisible" @change="toggleSidebar" />
        </el-form-item>
      </el-form>
  
      <!-- 显示设置的效果 -->
      <div class="preview">
        <p>这是一个预览文本，用于展示当前主题和字体大小的设置。</p>
        <el-button @click="resetSettings">重置设置</el-button>
      </div>
    </div>
  </template>
  
  <script lang="ts" setup>
  import { ref } from 'vue'
  import { ElButton, ElRadioGroup, ElRadio, ElSlider, ElSwitch, ElForm, ElFormItem } from 'element-plus'
  
  // 用于保存用户的个性化设置
  const form = ref({
    theme: 'light', // 默认浅色主题
    fontSize: 16,   // 默认字体大小为16px
    sidebarVisible: true, // 默认显示侧边栏
  })
  
  // 切换主题
  const changeTheme = (value: string) => {
    if (value === 'dark') {
      document.body.classList.add('dark-theme')
      document.body.classList.remove('light-theme')
    } else {
      document.body.classList.add('light-theme')
      document.body.classList.remove('dark-theme')
    }
  }
  
  // 更改字体大小
  const changeFontSize = (value: number) => {
    document.body.style.fontSize = `${value}px`
  }
  
  // 切换侧边栏显示状态
  const toggleSidebar = (value: boolean) => {
    if (value) {
      document.body.classList.remove('hide-sidebar')
    } else {
      document.body.classList.add('hide-sidebar')
    }
  }
  
  // 重置设置
  const resetSettings = () => {
    form.value = {
      theme: 'light',
      fontSize: 16,
      sidebarVisible: true,
    }
    changeTheme('light')
    changeFontSize(16)
    toggleSidebar(true)
  }
  </script>
  
  <style scoped>
  .page-personalization {
    padding: 20px;
  }
  
  .preview {
    margin-top: 20px;
    padding: 10px;
    border: 1px solid #ddd;
    background-color: #f9f9f9;
    margin-top: 30px;
  }
  
  .dark-theme {
    background-color: #2c3e50;
    color: #ecf0f1;
  }
  
  .light-theme {
    background-color: #f5f5f5;
    color: #333;
  }
  
  .hide-sidebar .sidebar {
    display: none;
  }

  </style>
  