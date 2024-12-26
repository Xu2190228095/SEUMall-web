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
          <span class="order-label">订单编号:</span> {{ order.order_id }}
          <span class="order-label">提交时间:</span> {{ order.create_time }}
          <span class="order-label">订单金额:</span> ￥{{ order.price }}
          <span class="order-label">订单状态:</span> {{ order.state }}
        </div>
        <div class="order-actions">
          <el-button
            v-show="order.state === '已发货' || order.state === '已收货'"
            size="small"
            @click="handleConfirmReceipt(order)"
          >
            确认收货
          </el-button>
          <el-button
            v-show="order.state === '已完成'"
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
import { getOrdersByUserId, updateOrderStatus } from '../../api/order';

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

    // 获取订单数据
    function getList() {
      getOrdersByUserId(listQuery.value)
        .then((response) => {
          orders.value = response.data;
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

    // 确认收货
    function handleConfirmReceipt(order) {
      updateOrderStatus({ order_id: order.order_id, state: '已完成' }).then(() => {
        order.state = '已完成';
      });
    }

    // 打开评价弹窗
    function handleOpenReview(order) {
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
      // 这里可以提交评价的逻辑，但目前先写死
      console.log('评价提交：', reviewScore.value, reviewText.value);
      handleReviewDialogClose();
    }

    // 初始化页面数据
    onMounted(() => {
      getList();
    });

    return {
      statusOptions,
      orders,
      listQuery,
      reviewDialogVisible,
      reviewScore,
      reviewText,
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

.input-width {
  width: 250px;
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
  justify-content: space-between;
  align-items: center;
  padding: 15px 20px;
  margin-bottom: 20px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.order-item .order-info {
  display: flex;
  flex-direction: column;
}

.order-item .order-info span {
  margin-bottom: 30px; /* 增加信息之间的间距 */
  margin-right: 10px;
  font-size: 20px; /* 字体变大 */
}

.order-item .action-buttons {
  display: flex;
  gap: 20px; /* 按钮之间增加间距 */
  justify-content: flex-end;
}

.order-item .action-buttons .el-button {
  font-size: 20px; /* 按钮字体变大 */
  padding: 40px; /* 增加按钮的大小 */
}

.order-item .action-buttons .el-button--primary {
  background-color: #409EFF;
  color: white;
}

.order-item .action-buttons .el-button--danger {
  background-color: #f56c6c;
  color: white;
}

/* 修改评价框 */
.el-rate {
  font-size: 25px; /* 星星的大小 */
}

.el-dialog {
  border-radius: 8px;
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

/* 响应式调整 */
@media (max-width: 768px) {
  .input-width {
    width: 100%;
  }

  .el-table-column {
    font-size: 20px;
  }

  .el-dialog {
    width: 90%;
  }
}
</style>
