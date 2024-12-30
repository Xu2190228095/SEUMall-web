<template>
  <div class="app-container">
    <!-- 标签筛选区域 -->
    <el-card class="filter-container" shadow="never" type="card">
      <div>
        <el-button
          v-for="status in statusOptions"
          :key="status.value"
          :type="listQuery.state === status.value ? 'primary' : 'default'"
          @click="handleFilterStatus(status.value)"
          size="small"
        >
          {{ status.label }}
        </el-button>
      </div>
    </el-card>

    <!-- 用户订单区域 -->
    <div class="order-container">
      <div v-for="(order, index) in orders" :key="order.order_id" class="order-item">
        <div class="order-details">
          <!-- <img :src="images[index]" class="product-image" style="border-radius: 10px;"/> -->
          <div class="order-info">
            <span class="order-label">订单编号:</span> <span>{{ order.order_id }}</span>
          </div>
          <div class="order-info">
            <span class="order-label">提交时间:</span> <span>{{ order.create_time }}</span>
          </div>
          <div class="order-info">
            <span class="order-label">订单金额:</span> <span>￥{{ order.price }}</span>
          </div>
          <div class="order-info">
            <span class="order-label">订单状态:</span> <span>{{ order.state }}</span>
          </div>        
        </div>

        <!-- 商品图片部分
        <img :src="images[index]" class="product-image" /> -->

        <div class="order-actions">
          <el-button
            v-show="order.state === '已发货'"
            size="small"
            @click="handleConfirmReceipt(order)"
          >
            确认收货
          </el-button>
          <el-button
            v-show="order.state === '已收货'"
            size="small"
            @click="handleOpenReview(order)"
          >
            评价
          </el-button>
        </div>
      </div>
    </div>

    <!-- 评价对话框 -->
    <el-dialog
      title="订单评价"
      v-model="reviewDialogVisible"
      width="40%"
      @close="handleReviewDialogClose"
    >
      <div>
        <el-rate v-model="reviewScore" allow-half></el-rate>
        <el-input
          v-model="reviewText"
          type="textarea"
          placeholder="请输入评价内容"
          rows="4"
          style="margin-top: 10px; margin-bottom:20px"
        ></el-input>
      </div>
      <span slot="footer" class="dialog-footer" style="margin-top: 20px;">
        <el-button @click="handleReviewDialogClose">取消</el-button>
        <el-button type="primary" @click="handleSubmitReview">确认</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { reactive, ref, onMounted } from 'vue';
import { getOrdersByUserId, submitReview, confirmReceipt } from '../../api/order';

export default {
  setup() {
    // 订单状态选项
    const statusOptions = ref([
      { label: '全部', value: null },
      { label: '待发货', value: '待发货' },
      { label: '已发货', value: '已发货' },
      { label: '已收货', value: '已收货' },
      { label: '已完成', value: '已完成' },
    ]);

    // 订单数据
    const orders = ref([]);
    //const images = ref([]); // 商品图片
    const listQuery = ref({
      pageNum: 1,
      pageSize: 10,
      state: null,
      cid: localStorage.getItem('cid'),
    });

    // 评价弹窗
    const reviewDialogVisible = ref(false);
    const reviewScore = ref(0);
    const reviewText = ref('');
    const currentOrder = ref(null); // 当前正在评论的订单

    // 获取订单数据
    function getList() {
      getOrdersByUserId(listQuery.value)
        .then((response) => {
          console.log(response);
          orders.value = response.data.orders;
          console.log(orders.value);
          //images.value = response.data.pictures.map(picture => `data:image/jpg;base64,${picture}`);
          //console.log(images.value);
        })
        .catch((error) => {
          console.error(error);
        });
    }

    // 处理订单状态筛选
    function handleFilterStatus(status) {
      listQuery.value.state = status;
      getList();
    }

    // // 确认收货
    // function handleConfirmReceipt(order) {
    //   updateOrderStatus({ order_id: order.order_id, state: '已完成' }).then(() => {
    //     order.state = '已完成';
    //   });
    // }

    // 确认收货
    function handleConfirmReceipt(order) {
      confirmReceipt(order.order_id)  // 调用确认收货接口
        .then((response) => {
          console.log(response);  // 打印成功响应

          // 如果确认收货成功，更新订单状态
          order.state = '已收货';  // 更新本地订单状态
          alert("收货确认成功！订单状态已更新为已收货！");

          // 刷新订单列表
          getList();
        })
        .catch((error) => {
          console.error('确认收货失败:', error);
          alert("确认收货失败，请稍后再试！");
        });
    }


    // 打开评价弹窗
    function handleOpenReview(order) {
      currentOrder.value = order;  // 将当前订单保存到 `currentOrder`
      reviewDialogVisible.value = true;
    }

    // 关闭评价弹窗
    function handleReviewDialogClose() {
      reviewDialogVisible.value = false;
      reviewScore.value = 0;
      reviewText.value = '';
    }

    // 提交评价
    function handleSubmitReview() {
      const orderId = currentOrder.value.order_id;  // 获取当前订单的 order_id

      const reviewData = {
        order_id: orderId,
        score: reviewScore.value,
        comment: reviewText.value,
      };

      console.log('Review data to send:', reviewData);  // 打印提交的数据

      submitReview(reviewData)  // 调用封装好的 API
        .then(() => {
          console.log('评价已提交', reviewData);
          handleReviewDialogClose(); // 关闭评价弹窗
          currentOrder.value.state = '已完成'; // 更新当前订单状态

          // 刷新订单列表
          getList();
        })
        .catch((error) => {
          console.error('提交评价失败:', error);
        });
    }

    // 初始化页面数据
    onMounted(() => {
      getList();
    });

    return {
      statusOptions,
      orders,
      //images,
      listQuery,
      reviewDialogVisible,
      reviewScore,
      reviewText,
      currentOrder,
      handleFilterStatus,
      handleConfirmReceipt,
      handleOpenReview,
      handleReviewDialogClose,
      handleSubmitReview,
    };
  },
};
</script>

<style scoped>
.app-container {
  padding: 20px;
  background-color: #f5f7fa;
  font-size: 16px; /* 整体字体调大 */
}

.filter-container,
.operate-container {
  margin-bottom: 20px;
  padding: 20px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.filter-container .el-icon-search {
  color: #409EFF;
  margin-right: 10px;
}

.filter-container span {
  font-size: 20px;
  font-weight: 600;
  color: #333;
}

.filter-container .el-button {
  margin-left: 10px;
  font-size: 18px;
  padding: 15px;
}

/* 标签部分 */
.el-tabs {
  margin-bottom: 20px;
}

.el-tabs__header {
  font-size: 18px; /* 标签字体加大 */
}

.el-tab {
  font-size: 18px;
  color: #409EFF; /* 蓝色字体 */
}

.el-tabs__item.is-active {
  background-color: #e6f7ff; /* 浅蓝色背景 */
  color: #409EFF;
}

/* 订单列表部分 */
.order-item {
  display: flex;
  flex-direction: column;
  padding: 20px 30px;
  margin-bottom: 20px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  height: auto; /* 使订单项高度适应内容 */
}


.order-item .order-details {
  display: flex;
  flex-direction: column;  /* 垂直排列订单信息 */
  margin-right: 20px;  /* 订单信息与图片之间留出一定的间距 */
  flex: 1;  /* 保证订单信息部分占据剩余空间 */
}

.order-item .product-image {
  max-height: 40px;  /* 设置最大高度，确保图片大小与文本高度一致 */
  width: auto;  /* 保持宽高比 */
  border-radius: 10px;
  object-fit: contain;  /* 图片不失真且保持宽高比 */
  margin-left: auto;  /* 将图片推到最右侧 */
}

.order-item .order-info {
  display: flex;
  margin-bottom: 10px; /* 间距 */
  font-size: 18px; /* 字体大小 */
  flex: 1 1 45%; /* 限制每个项的宽度 */
}

.order-item .order-info .order-label {
  font-weight: 600;
  margin-right: 8px; /* 标签和内容之间的间距 */
}

.order-item .order-actions {
  display: flex;
  gap: 25px; /* 按钮之间增加间距 */
  justify-content: flex-end;
}

.order-item .order-actions .el-button {
  font-size: 18px; /* 按钮字体变大 */
  padding: 20px; /* 增加按钮的大小 */
}

.order-item .order-actions .el-button--primary {
  background-color: #409EFF;
  color: white;
}

.order-item .order-actions .el-button--danger {
  background-color: #f56c6c;
  color: white;
}

/* 修改评价框 */
.el-rate {
  font-size: 18px; /* 星星的大小 */
}

.el-dialog {
  border-radius: 8px;
}

.el-dialog .el-dialog__body {
  padding-bottom: 30px; /* 给评价框下面增加空间 */
}

.el-dialog .el-button {
  font-size: 18px; /* 按钮字体变大 */
  padding: 20px; /* 按钮大小调整 */
  margin-top: 15px; /* 按钮与评价框之间增加间距 */
}

.el-steps {
  padding: 20px;
}

.el-steps .el-step {
  font-size: 16px;
}

.el-steps .el-step .el-step__title {
  color: #409EFF;
}

.el-steps .el-step.is-finish .el-step__title {
  color: #67c23a;
}

.el-steps .el-step.is-active .el-step__title {
  color: #f56c6c;
}
</style>
