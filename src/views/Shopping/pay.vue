<template>
    
  <simple-header />
    <div class="payment-page">
      <el-card>
        <!-- 订单信息 -->
        <div class="order-summary">
          <h2>订单信息</h2>
          <!-- <el-row>
            <el-col :span="12"><strong>订单编号：</strong>{{ orderInfo.orderId }}</el-col>
            <el-col :span="24" class="text-right"><strong>支付总额：</strong>{{ orderInfo.totalAmount }} 元</el-col>
          </el-row> -->
          
          <div v-for="(item, index) in orderItems" :key="item.id" class="order-item">
            <el-row>
              <el-col :span="12">{{ item.name }} ({{ item.quantity }} x {{ item.price }} 元)</el-col>
              <el-col :span="12" class="text-right">{{ item.totalPrice }} 元</el-col>
            </el-row>
            <el-row>
              <img :src="image" alt="" style="height:100px;">
            </el-row>
          </div>
          
          <!-- 优惠信息 -->
          <!-- <el-row>
            <el-col :span="12">优惠：</el-col>
            <el-col :span="12" class="text-right">{{ orderInfo.discount }} 元</el-col>
          </el-row> -->
          
          <el-row>
            <el-col :span="12"><strong>应付金额：</strong></el-col>
            <el-col :span="12" class="text-right"><strong>{{ orderInfo.totalAmount }} 元</strong></el-col>
          </el-row>
        </div>
    
        <!-- 配送地址 -->
        <h3>配送地址</h3>
        <div v-for="(item, index) in addressItems" :key="item.id" class="address-info">
          <el-radio-group v-model="address">
            <el-row>
              <el-col :span="24">
                <el-radio :value="item.id" size="large" style="width: 100%; display: flex; justify-content: space-between;">
                    <span>{{ item.address }}</span> <!-- 第一个span，默认左对齐 -->
                    <span style="position: absolute; left: 150%;">{{ item.receiver }}</span>
                    <span style="position: absolute; left: 160%;">{{ item.mobile }}</span>
                </el-radio>
              </el-col>
            </el-row>
          </el-radio-group>
        </div>
    
        <!-- 支付方式选择 -->
        <div class="payment-method">
          <h3>选择支付方式</h3>
          <el-radio-group v-model="selectedPaymentMethod">
            <el-radio label="alipay">余额</el-radio>
          </el-radio-group>
        </div>
    
        <!-- 备注 -->
        <div class="order-remark">
          <h3>订单备注</h3>
          <el-input
            v-model="remark"
            type="textarea"
            placeholder="如有备注，请填写"
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
      </el-card>
    </div>
  </template>
  
  <script lang="ts" setup>
  import { onMounted, ref } from 'vue'
  import { ElRow, ElCol, ElRadioGroup, ElRadio, ElButton, ElAlert, ElInput } from 'element-plus'
  import SimpleHeader from '@/components/SimpleHeader.vue';
  import { useRouter } from 'vue-router';
  import { fetchProduct} from '../../api/product'; // 引入封装的接口

  const router = useRouter();

  const orderInfo = ref({})

  const image = ref()

  onMounted(() => {
    //console.log(JSON.parse(router.currentRoute.value.query.products))
    orderInfo.value.pid = router.currentRoute.value.query.goodsId
    orderInfo.value.number = router.currentRoute.value.query.quantity
    fetchProduct(orderInfo.value.pid).then(res => {
      orderInfo.value.totalAmount = res.data.product.price*orderInfo.value.number
      image.value = `data:image/jpg;base64,${res.data.picture}`
    });
    
  })
  
  const orderItems = ref([
    { id: 1, name: '哇哈哈矿泉水', price: 2, quantity: 2, totalPrice: 4 },
  ])
  

  const addressItems = ref([
    { id: 1, address: '北京市海淀区西二旗北路10号院1号楼1单元101室' , receiver: '张三', mobile: '13800138000' },
    { id: 2, address: '北京市海淀区西二旗北路10号院1号楼1单元102室' , receiver: '李四', mobile: '13800138001' }
  ])

  const address = ref(1)
  
  // 支付方式选择
  const selectedPaymentMethod = ref('alipay')
  
  // 订单备注
  const remark = ref('')
  
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
  