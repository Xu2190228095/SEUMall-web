<template>
  <div class="app-container">
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
            <el-input v-model="listQuery.id" class="input-width" placeholder="商品编号"></el-input>
          </el-form-item>
          <el-form-item label="商品：">
            <el-input v-model="listQuery.pname" class="input-width" placeholder="商品名称"></el-input>
          </el-form-item>
          <el-form-item label="商品分类：">
            <el-select v-model="listQuery.pclass" class="input-width" placeholder="全部" clearable>
              <el-option v-for="item in classOptions"
                         :key="item.value"
                         :label="item.label"
                         :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </div>

    </el-card>
    <el-card class="operate-container" shadow="never">
      <i class="el-icon-tickets"></i>
      <span>数据列表</span>
    </el-card>

    <div class="table-container">
      <el-table ref="productTable"
                :data="list"
                style="width: 100%;"
                @selection-change="handleSelectionChange"
                v-loading="listLoading" border>
        <el-table-column type="selection" width="60" align="center"></el-table-column>
        <!--        <el-table-column label="编号" width="80" align="center">-->
        <!--          <template #default="scope">{{scope.row.id}}</template>-->
        <!--        </el-table-column>-->
        <el-table-column label="商品编号" width="80" align="center">
          <template #default="scope">{{scope.row.id}}</template>
        </el-table-column>
        <el-table-column label="商品名称" width="180" align="center">
          <template #default="scope">{{scope.row.pname}}</template>
        </el-table-column>
        <el-table-column label="商品描述" width="180" align="center">
          <template #default="scope">{{scope.row.desc}}</template>
        </el-table-column>
        <el-table-column label="商品图片" align="center">
          <template #default="scope">{{scope.row.img}}</template>
        </el-table-column>
        <el-table-column label="商品金额" width="120" align="center">
          <template #default="scope">￥{{scope.row.price}}</template>
        </el-table-column>
        <el-table-column label="商品数量" width="120" align="center">
          <template #default="scope">{{scope.row.number}}</template>
        </el-table-column>
        <el-table-column label="商品分类" width="120" align="center">
          <template #default="scope">{{scope.row.pclass}}</template>
        </el-table-column>
        <el-table-column label="操作" width="300" align="center">
          <template #default="scope">
            <el-button
                size="mini"
                @click="handleViewOrder(scope.$index, scope.row)"
            >编辑商品</el-button>
            <el-button
                size="mini"
                @click="handleDeleteProduct(scope.$index, scope.row)"
                >删除商品</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <div class="batch-operate-container">
      <el-select
          style="width: 100px"
          v-model="operateType" placeholder="批量操作">
        <el-option
            v-for="item in operateOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value">
        </el-option>
      </el-select>
      <el-button
          style="margin-left: 20px"
          class="search-button"
          @click="handleBatchOperate()"
          type="primary">
        确定
      </el-button>
    </div>

    <div class="pagination-container">
      <el-pagination
          background
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          layout="total, sizes,prev, pager, next,jumper"
          :current-page.sync="listQuery.pageNum"
          :page-size="listQuery.pageSize"
          :page-sizes="[5,10,15]"
          :total="total">
      </el-pagination>
    </div>

    <el-dialog title="订单跟踪"
               v-model="logisticsDialogVisible"
               :before-close="handleLogisticsDialogClose"
               align-center
               width="40%">
      <el-steps direction="vertical"
                :active="6"
                finish-status="success"
                space="50px">
        <el-step  v-for="item in defaultLogisticsList"
                  :key="item.name"
                  :title="item.name"
                  :description="item.time"></el-step>
      </el-steps>
    </el-dialog>

  </div>
</template>
<script>
import { reactive, ref, onMounted, getCurrentInstance } from 'vue'
import router from '../../../router';
import { fetchList,deleteProduct } from '@/api/product'

export default {
  setup() {
    const classOptions = ref([
      {
        label: '全部',
        value: null
      },
      {
        label: '食品',
        value: '食品'
      },
      {
        label: '电子产品',
        value: '电子产品'
      },
      {
        label: '家电',
        value: '家电'
      }
    ])
    const list = ref([
      {
        "id": 1,
        "pname": "娃哈哈矿泉水",
        "desc": "我们不生产水，我们这是大自然的搬运工",
        "price": 2,
        "number": 1000,
        "img": "...",
        "pclass": "食品",
      },
      // {
      //   "pid": 2,
      //   "pname": "可口可乐",
      //   "desc": "清爽解渴，经典之选",
      //   "price": 3,
      //   "number": 1500,
      //   "img": "...",
      //   "pclass": "饮料",
      //   "id": 2
      // },
      // {
      //   "pid": 3,
      //   "pname": "康师傅红烧牛肉面",
      //   "desc": "经典味道，速食必备",
      //   "price": 5,
      //   "number": 800,
      //   "img": "...",
      //   "pclass": "食品",
      //   "id": 3
      // },
      // {
      //   "pid": 4,
      //   "pname": "蒙牛纯牛奶",
      //   "desc": "富含营养，健康之选",
      //   "price": 10,
      //   "number": 600,
      //   "img": "...",
      //   "pclass": "食品",
      //   "id": 4
      // },
      // {
      //   "pid": 5,
      //   "pname": "苹果iPhone 13",
      //   "desc": "最新款智能手机，高性能体验",
      //   "price": 6999,
      //   "number": 200,
      //   "img": "...",
      //   "pclass": "电子产品",
      //   "id": 5
      // },
      // {
      //   "pid": 6,
      //   "pname": "联想小新Pro14",
      //   "desc": "轻薄便携，高效办公",
      //   "price": 5999,
      //   "number": 100,
      //   "img": "...",
      //   "pclass": "电子产品",
      //   "id": 6
      // },
      // {
      //   "pid": 7,
      //   "pname": "海尔滚筒洗衣机",
      //   "desc": "智能控制，节能环保",
      //   "price": 2999,
      //   "number": 50,
      //   "img": "...",
      //   "pclass": "家电",
      //   "id": 7
      // },
      // {
      //   "pid": 8,
      //   "pname": "美的智能冰箱",
      //   "desc": "大容量，智能保鲜",
      //   "price": 3999,
      //   "number": 80,
      //   "img": "...",
      //   "pclass": "家电",
      //   "id": 8
      // }
    ])
    const multipleSelection = ref([])
    const listLoading = ref(false)
    const logisticsDialogVisible = ref(false)
    const defaultLogisticsList=[
      {name: '订单已提交，等待付款',time:'2017-04-01 12:00:00 '},
      {name: '订单付款成功',time:'2017-04-01 12:00:00 '},
      {name: '在北京市进行下级地点扫描，等待付款',time:'2017-04-01 12:00:00 '},
      {name: '在分拨中心广东深圳公司进行卸车扫描，等待付款',time:'2017-04-01 12:00:00 '},
      {name: '在广东深圳公司进行发出扫描',time:'2017-04-01 12:00:00 '},
      {name: '到达目的地网点广东深圳公司，快件将很快进行派送',time:'2017-04-01 12:00:00 '},
      {name: '订单已签收，期待再次为您服务',time:'2017-04-01 12:00:00 '}
    ];
    const listQuery = ref({
      pageNum: 1,
      pageSize: 10,
      id: null,
      pname: null,
      pclass: null
    })
    const total = ref(0)
    const operateType = ref(null)
    const operateOptions = [
      {
        label: "批量上架",
        value: 1
      },
      {
        label: "批量删除",
        value: 2
      },
    ]
    function handleSelectionChange(val) {
      multipleSelection.value = val;
    }
    function handleViewOrder(index, row) {
      console.log(index, row)
      router.push('/admin/order_detail')
    }
    function handleDeliveryOrder(index, row) {
      const deliveryForm = {
        id: row.id,
        expressCompany: '顺丰快递',
        expressNo: '1234567890',
        expressName: '张三',
        expressMobile: '13812345678',
        expressAddress: '广东省深圳市南山区',
      }
      updateOrderStatus(deliveryForm).then(response => {
        console.log(response)
      }).catch(error => {
      })
      getList();
    }
    function handleViewLogistics(index, row) {
      logisticsDialogVisible.value = true; //to do
    }
    function handleDeleteProduct(index, row) {
      //删除商品操作
      const id = {
        id: row.id
      }
      console.log("id====",id);
      deleteProduct(id).then(response => {
      }).catch(error => {
        console.log(error);
      });
      getList();
    }
    function handleLogisticsDialogClose(done) {
      logisticsDialogVisible.value = false;
      done();
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
    function handleResetSearch() {
      listQuery.value.pageNum = 1;
      listQuery.value.id = null;
      listQuery.value.pname = null;
      listQuery.value.pclass = null;
      getList();
    }
    function handleSearchList() {
      listQuery.value.pageNum = 1;
      console.log(listQuery.value);
      getList();
    }
    function getList() {
      // listLoading.value = true;
      fetchList(listQuery.value).then(res => {
        listLoading.value = false;
        list.value = res.data.list;
        total.value = res.data.total;
        console.log(list.value)
        console.log(total.value)
      }).catch(err => {
        listLoading.value = false;
        console.log(err);
      });
    }

    function handleBatchOperate() {
      console.log("test_batch_operate")
      console.log(operateType.value, multipleSelection.value)  //to do
      if(multipleSelection.length < 1){
        this.$message({
          message: '请选择要操作的订单',
          type: 'warning',
          duration: 1000
        });
        return;
      }
      if(this.operateType===1){
        //批量发货
        let list=[];
        for(let i=0;i<this.multipleSelection.length;i++){
          if(this.multipleSelection[i].status===1){
            list.push(this.covertOrder(this.multipleSelection[i]));
          }
        }
        if(list.length===0){
          this.$message({
            message: '选中订单中没有可以发货的订单',
            type: 'warning',
            duration: 1000
          });
          return;
        }
        this.$router.push({path:'/oms/deliverOrderList',query:{list:list}})
      }
      else if(this.operateType===2){
        //删除商品

        for(let i=0;i<this.multipleSelection.length;i++){
          console.log("this.multipleSelection[i]:",this.multipleSelection[i]);
          deleteProduct(this.multipleSelection[i]).then(response => {
          }).catch(error => {
            console.log(error);
          });
          console.log("test_batch_delete");
        }
      }else if(this.operateType===3){
        //删除订单
        let ids=[];
        for(let i=0;i<this.multipleSelection.length;i++){
          ids.push(this.multipleSelection[i].id);
        }
        this.deleteOrder(ids);
      }
    }
    onMounted(() => {
      getList();
    })
    return {
      classOptions,
      list,
      multipleSelection,
      listLoading,
      logisticsDialogVisible,
      defaultLogisticsList,
      listQuery,
      total,
      operateType,
      operateOptions,
      handleSelectionChange,
      handleViewOrder,
      handleDeliveryOrder,
      handleViewLogistics,
      handleDeleteProduct,
      handleLogisticsDialogClose,
      handleSizeChange,
      handleCurrentChange,
      handleBatchOperate,
      handleResetSearch,
      handleSearchList,
    }
  }
}

</script>
<style scoped>
.input-width {
  width: 203px;
}
</style>