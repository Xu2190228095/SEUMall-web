<template>
  <div class="account-binding">
    <h2>账号绑定信息</h2>

    <!-- 加载中和错误信息 -->
    <div v-if="loading" class="loading">加载中...</div>
    <div v-if="error" class="error">{{ error }}</div>

    <!-- 显示信息 -->
    <div v-if="!loading && !error">
      <!-- 邮箱绑定信息 -->
      <div class="info-item" v-if="accountInfo.email">
        <strong>绑定邮箱：</strong>{{ accountInfo.email }}
      </div>

      <!-- 手机绑定信息 -->
      <div class="info-item" v-if="accountInfo.phone">
        <strong>绑定手机：</strong>{{ accountInfo.phone }}
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue';
import { getCustomerByCid } from '../../api/address'; // 引入 API 接口

// 用来存储账号绑定信息
const accountInfo = ref({
  email: '',
  phone: ''
});

// 状态变量
const loading = ref(true);
const error = ref('');

// 定义获取用户信息的函数
const fetchAccountInfo = async (cid: string) => {
  try {
    const data = await getCustomerByCid(cid);
    accountInfo.value = {
      email: data.email || '', // 确保返回数据中有email
      phone: data.phone || ''   // 确保返回数据中有phone
    };
    loading.value = false;
  } catch (err) {
    error.value = err.message || '无法获取账号信息';
    loading.value = false;
  }
};

// 组件挂载时调用
onMounted(() => {
  const cid = localStorage.getItem('cid') || ''; // 获取cid（例如从localStorage）
  if (cid) {
    fetchAccountInfo(cid); // 调用fetchAccountInfo函数获取用户信息
  } else {
    error.value = '无法获取用户的cid。';
    loading.value = false;
  }
});
</script>

<style scoped>
/* 背景颜色设置为淡蓝色 */
.account-binding {
  padding: 30px;
  background-color: #f0f8ff; /* 淡蓝色背景 */
  font-family: 'Arial', sans-serif;
}

/* 标题字体颜色和大小 */
h2 {
  font-size: 28px;
  color: #1e90ff; /* 深蓝色 */
  text-align: center;
  margin-bottom: 20px;
}

/* 信息项的间距和字体设置 */
.info-item {
  margin-bottom: 20px;
  font-size: 18px; /* 增大字体 */
}

/* 显示加载中 */
.loading {
  font-size: 18px;
  color: #1e90ff;
  text-align: center;
  margin-top: 20px;
}

/* 错误信息样式 */
.error {
  font-size: 18px;
  color: red;
  text-align: center;
  margin-top: 20px;
}

/* 强调的文字样式 */
strong {
  font-weight: bold;
  color: #1e90ff; /* 深蓝色 */
}
</style>
