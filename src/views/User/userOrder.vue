<template>
    <div class="app-container">
      <!-- 筛选搜索区域 -->
      <el-card class="filter-container" shadow="never">
        <div>
          <i class="el-icon-search"></i>
          <span>筛选搜索</span>
          <el-button
            style="float:right"
            type="primary"
            @click="handleSearchList()"
            size="small">
            查询搜索
          </el-button>
          <el-button
            style="float:right;margin-right: 15px"
            @click="handleResetSearch()"
            size="small">
            重置
          </el-button>
        </div>
  
        <div style="margin-top: 15px">
          <el-form :inline="true" :model="listQuery" label-width="140px">
            <el-form-item label="输入搜索：">
              <el-input v-model="listQuery.order_id" class="input-width" placeholder="订单编号"></el-input>
            </el-form-item>
            <el-form-item label="提交时间：">
              <el-date-picker
                class="input-width"
                v-model="listQuery.create_time"
                value-format="YYYY-MM-DD"
                type="date"
                placeholder="请选择时间">
              </el-date-picker>
            </el-form-item>
            <el-form-item label="订单状态：">
              <el-select v-model="listQuery.state" class="input-width" placeholder="全部" clearable>
                <el-option v-for="item in statusOptions"
                           :key="item.value"
                           :label="item.label"
                           :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-form>
        </div>
  
      </el-card>
  
      <!-- 数据列表 -->
      <el-card class="operate-container" shadow="never">
        <i class="el-icon-tickets"></i>
        <span style="font-size: 20px;font-weight: 600;margin-left: 10px">数据列表</span>
      </el-card>
  
      <!-- 表格显示区域 -->
      <div class="table-container">
        <el-table ref="orderTable"
                  :data="orders"
                  style="width: 100%;"
                  @selection-change="handleSelectionChange"
                  v-loading="listLoading" border>
          <el-table-column type="selection" width="60" align="center"></el-table-column>
          <el-table-column label="编号" width="80" align="center">
            <template #default="scope">{{scope.row.id}}</template>
          </el-table-column>
          <el-table-column label="订单编号" width="180" align="center">
            <template #default="scope">{{scope.row.order_id}}</template>
          </el-table-column>
          <el-table-column label="提交时间" width="180" align="center">
            <template #default="scope">{{scope.row.create_time}}</template>
          </el-table-column>
          <el-table-column label="订单金额" width="150" align="center">
            <template #default="scope">￥{{scope.row.price}}</template>
          </el-table-column>
          <el-table-column label="订单状态" width="150" align="center">
            <template #default="scope">{{scope.row.state}}</template>
          </el-table-column>
          <el-table-column label="操作" width="300" align="center">
            <template #default="scope">
              <el-button
                size="mini"
                @click="handleViewOrder(scope.$index, scope.row)"
              >查看订单</el-button>
              <el-button
                size="mini"
                @click="handleDeliveryOrder(scope.$index, scope.row)"
                v-show="scope.row.state === '待发货'">订单发货</el-button>
              <el-button
                size="mini"
                @click="handleViewLogistics(scope.$index, scope.row)"
                v-show="scope.row.state === '已发货' || scope.row.state === '已收货'">订单跟踪</el-button>
              <el-button
                size="mini"
                type="danger"
                @click="handleDeleteOrder(scope.$index, scope.row)"
                v-show="scope.row.state === '已完成'">删除订单</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
  
      <!-- 分页 -->
      <div class="pagination-container" style="margin-top: 30px;">
        <el-pagination
          background
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          layout="total, sizes, prev, pager, next, jumper"
          :current-page.sync="listQuery.pageNum"
          :page-size="listQuery.pageSize"
          :page-sizes="[5, 10, 15]"
          :total="total">
        </el-pagination>
      </div>
  
      <!-- 订单跟踪对话框 -->
      <el-dialog title="订单跟踪"
                 v-model="logisticsDialogVisible"
                 :before-close="handleLogisticsDialogClose"
                 align-center
                 width="40%">
        <el-steps direction="vertical"
                  :active="6"
                  finish-status="success"
                  space="50px">
          <el-step v-for="item in defaultLogisticsList"
                   :key="item.name"
                   :title="item.name"
                   :description="item.time"></el-step>
        </el-steps>
      </el-dialog>
    </div>
  </template>
  
  <script>
  import { reactive, ref, onMounted } from 'vue';
  import { getOrdersByUserId, deleteOrder, updateOrderStatus } from '../../api/order';
  import router from '../../router';
  
  export default {

    setup() {
      // 初始化状态选项
      const statusOptions = ref([
        { label: '全部', value: null },
        { label: '待发货', value: '待发货' },
        { label: '已发货', value: '已发货' },
        { label: '已收货', value: '已收货' },
        { label: '已完成', value: '已完成' }
      ]);
  
      // 初始化订单数据
      const orders = ref([]);
      const listLoading = ref(true);
      const logisticsDialogVisible = ref(false);
      const defaultLogisticsList = [
        { name: '订单已提交，等待付款', time: '2017-04-01 12:00:00 ' },
        { name: '订单付款成功', time: '2017-04-01 12:00:00 ' },
        { name: '在北京市进行下级地点扫描，等待付款', time: '2017-04-01 12:00:00 ' },
        { name: '在分拨中心广东深圳公司进行卸车扫描，等待付款', time: '2017-04-01 12:00:00 ' },
        { name: '在广东深圳公司进行发出扫描', time: '2017-04-01 12:00:00 ' },
        { name: '到达目的地网点广东深圳公司，快件将很快进行派送', time: '2017-04-01 12:00:00 ' },
        { name: '订单已签收，期待再次为您服务', time: '2017-04-01 12:00:00 ' }
      ];
  
      // 查询参数，cid固定为1，后期可以动态更新
      const listQuery = ref({
        pageNum: 1,
        pageSize: 10,
        order_id: null,
        state: null,
        create_time: null,
        price: null,
        cid: localStorage.getItem('cid'),
      });
  
      // 订单数据总数
      const total = ref(0);
  
      // 选择的批量操作类型
      const operateType = ref(null);
  
      // 搜索和分页方法
      function handleSearchList() {
        listQuery.value.pageNum = 1;
        getList();
      }
  
      function handleResetSearch() {
        listQuery.value.pageNum = 1;
        listQuery.value.order_id = null;
        listQuery.value.state = null;
        listQuery.value.create_time = null;
        listQuery.value.price = null;
        getList();
      }
  
      function handleSizeChange(val) {
        listQuery.value.pageNum = 1;
        listQuery.value.pageSize = val;
        getList();
      }
  
      function handleCurrentChange(val) {
        listQuery.value.pageNum = val;
        getList();
      }
  
      // 获取订单数据并更新,订单价格在另外的表上，不太会更新
      function getList() {
        getOrdersByUserId(listQuery.value)
          .then(response => {
            orders.value = response.data;
            total.value = orders.value.length;
            console.log(total.value);
            console.log(listQuery.cid);
          })
          .catch(error => {
            console.error(error);
          })
          .finally(() => {
            listLoading.value = false;
          });
      }

    //   function fetchOrders() {
    //     const params = { cid: 1 };

    //     getOrdersByUserId(params)
    //         .then(response => {
    //         console.log(response);  // 输出响应内容查看结构

    //         // 确保从返回的数据中提取正确的部分，赋值给 orders
    //         this.orders = response.data || [];  // 直接取 response.data
    //         })
    //         .catch(error => {
    //         console.error("获取订单失败:", error);
    //         });
    //     }
  
      // 处理选择改变
      function handleSelectionChange(val) {}
  
      // 查看订单
      function handleViewOrder(index, row) {
        router.push('/admin/order_detail');
      }
  
      // 发货订单
      function handleDeliveryOrder(index, row) {
        updateOrderStatus({ order_id: row.order_id, state: '已发货' }).then(() => {
          row.state = '已发货';
        });
      }
  
      // 删除订单
      function handleDeleteOrder(index, row) {
        deleteOrder(row.order_id).then(() => {
          orders.value.splice(index, 1);
        });
      }
  
      // 关闭订单跟踪对话框
      function handleLogisticsDialogClose() {
        logisticsDialogVisible.value = false;
      }
  
      // 初始化页面
      onMounted(() => {
        getList();
      });
  
      return {
        statusOptions,
        orders,
        listQuery,
        total,
        listLoading,
        logisticsDialogVisible,
        defaultLogisticsList,
        handleSearchList,
        handleResetSearch,
        handleSizeChange,
        handleCurrentChange,
        handleSelectionChange,
        handleViewOrder,
        handleDeliveryOrder,
        handleDeleteOrder,
        handleLogisticsDialogClose
      };
    }
  };
  </script>


<style scoped>
.app-container {
  padding: 10px;
  background-color: #f5f7fa;
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

.table-container {
  margin-top: 20px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  padding: 20px;
}

.el-table th {
  background-color: #f5f7fa;
  color: #333;
  font-weight: 600;
}

.el-table-column {
  text-align: center;
}

.batch-operate-container {
  margin-top: 20px;
  padding: 20px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.search-button {
  margin-left: 20px;
}

.pagination-container {
  margin-top: 20px;
  text-align: center;
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

/* 添加表格的行高和字体大小调整 */
.el-table th,
.el-table td {
  padding: 10px;
  font-size: 14px;
}

.el-table td {
  color: #333;
}

/* 响应式调整 */
@media (max-width: 768px) {
  .input-width {
    width: 100%;
  }

  .el-table-column {
    font-size: 12px;
  }

  .el-dialog {
    width: 90%;
  }
}
</style>
