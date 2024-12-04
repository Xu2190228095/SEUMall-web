<template>
    <div class="payment-page">
      <!-- 订单信息 -->
      <div class="order-summary">
        <h3>订单信息</h3>
        <el-row>
          <el-col :span="12"><strong>订单编号：</strong>{{ orderInfo.orderId }}</el-col>
          <el-col :span="12" class="text-right"><strong>支付总额：</strong>{{ orderInfo.totalAmount }} 元</el-col>
        </el-row>
        
        <div v-for="item in orderItems" :key="item.id" class="order-item">
          <el-row>
            <el-col :span="12">{{ item.name }} ({{ item.quantity }} x {{ item.price }} 元)</el-col>
            <el-col :span="12" class="text-right">{{ item.totalPrice }} 元</el-col>
          </el-row>
        </div>
        
        <!-- 优惠信息 -->
        <el-row>
          <el-col :span="12">优惠：</el-col>
          <el-col :span="12" class="text-right">{{ orderInfo.discount }} 元</el-col>
        </el-row>
        
        <el-row>
          <el-col :span="12"><strong>应付金额：</strong></el-col>
          <el-col :span="12" class="text-right"><strong>{{ orderInfo.totalAmount }} 元</strong></el-col>
        </el-row>
      </div>
  
      <!-- 配送地址 -->
      <div class="address-info">
        <h3>配送地址</h3>
        <el-row>
          <el-col :span="24">{{ userInfo.address }}</el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-button type="text" @click="editAddress">修改地址</el-button>
          </el-col>
        </el-row>
      </div>
  
      <!-- 支付方式选择 -->
      <div class="payment-method">
        <h3>选择支付方式</h3>
        <el-radio-group v-model="selectedPaymentMethod">
          <el-radio label="alipay">支付宝</el-radio>
          <el-radio label="wechat">微信支付</el-radio>
          <el-radio label="bankCard">银行卡</el-radio>
        </el-radio-group>
      </div>
  
      <!-- 备注 -->
      <div class="order-remark">
        <h3>订单备注</h3>
        <el-input
          v-model="remark"
          type="textarea"
          placeholder="如有备注，请填写"
          rows="4"
        />
      </div>
  
      <!-- 支付按钮 -->
      <div class="payment-confirmation">
        <el-button type="primary" @click="handlePayment">确认支付</el-button>
      </div>
  
      <!-- 安全提示 -->
      <div class="security-tips">
        <el-alert title="请确认支付金额，支付后无法退款" type="warning" />
      </div>
    </div>
  </template>
  
  <script lang="ts" setup>
  import { ref } from 'vue'
  import { ElRow, ElCol, ElRadioGroup, ElRadio, ElButton, ElAlert, ElInput } from 'element-plus'
  
  // 订单信息数据
  const orderInfo = ref({
    orderId: '20240012345',
    totalAmount: 259.99,
    discount: 10.00
  })
  
  const orderItems = ref([
    { id: 1, name: '商品A', price: 99.99, quantity: 2, totalPrice: 199.98 },
    { id: 2, name: '商品B', price: 60.01, quantity: 1, totalPrice: 60.01 }
  ])
  
  // 用户信息（地址等）
  const userInfo = ref({
    address: '北京市朝阳区建国门外大街12号'
  })
  
  // 支付方式选择
  const selectedPaymentMethod = ref('alipay')
  
  // 订单备注
  const remark = ref('')
  
  const editAddress = () => {
    alert('修改地址功能暂未实现')
  }
  
  // 处理支付的函数
  const handlePayment = () => {
    console.log(`支付方式: ${selectedPaymentMethod.value}`)
    console.log(`支付金额: ${orderInfo.value.totalAmount}`)
    alert('支付成功！')
  }
  </script>
  
  <style scoped>
  .payment-page {
    padding: 20px;
    background-color: #fff;
    border-radius: 10px;
    max-width: 800px;
    margin: 0 auto;
  }
  
  h3 {
    font-size: 18px;
    margin-bottom: 15px;
    font-weight: bold;
  }
  
  .order-summary {
    margin-bottom: 30px;
  }
  
  .order-item {
    padding: 10px 0;
  }
  
  .order-summary el-row {
    margin-bottom: 10px;
  }
  
  .text-right {
    text-align: right;
  }
  
  .payment-method {
    margin-bottom: 30px;
  }
  
  .order-remark {
    margin-bottom: 30px;
  }
  
  .payment-confirmation {
    text-align: center;
    margin-bottom: 20px;
  }
  
  .security-tips {
    margin-top: 20px;
  }
  
  .el-radio-group {
    display: flex;
    flex-direction: column; /* 按列布局，使选项垂直排列 */
    align-items: flex-start; /* 确保左对齐 */
    }
  
  .el-radio {
    font-size: 14px;
  }
  </style>
  