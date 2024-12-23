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
              <el-input v-model="listQuery.order_id" class="input-width" placeholder="商品编号"></el-input>
            </el-form-item>
            <el-form-item label="商品：">
              <el-input v-model="listQuery.keyword_username" class="input-width" placeholder="商品名称"></el-input>
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
          <el-table-column label="编号" width="80" align="center">
            <template #default="scope">{{scope.row.id}}</template>
          </el-table-column>
          <el-table-column label="商品编号" width="80" align="center">
            <template #default="scope">{{scope.row.pid}}</template>
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
              >查看订单</el-button>
              <el-button
                size="mini"
                @click="handleDeliveryOrder(scope.$index, scope.row)"
                v-show="scope.row.state==='待发货'">订单发货</el-button>
              <el-button
                size="mini"
                @click="handleViewLogistics(scope.$index, scope.row)"
                v-show="scope.row.state==='已发货' || scope.row.state==='已收货'">订单跟踪</el-button>
              <el-button
                size="mini"
                type="danger"
                @click="handleDeleteOrder(scope.$index, scope.row)"
                v-show="scope.row.state==='已完成'">删除订单</el-button>
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
    import { fetchList , deleteProduct, updateProductStatus } from '@/api/product'
    import {AllList} from "../../../api/product";

    export default {
        setup() {
            const statusOptions = ref([
                {
                    label: '全部',
                    value: null
                },
                {
                    label: '待发货',
                    value: '待发货'
                },
                {
                    label: '已发货',
                    value: '已发货'
                },
                {
                    label: '已收货',
                    value: '已收货'
                },
                {
                    label: '已完成',
                    value: '已完成'
                }
            ])
            const list = ref([
              {
                "pid": 1,
                "pname": "娃哈哈矿泉水",
                "desc": "我们不生产水，我们这是大自然的搬运工",
                "price": 2,
                "number": 1000,
                "img": "...",
                "pclass": "食品",
                "id": 1
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
                order_id: null,
                keyword_username: null,
                state: null,
                create_time: null,
            })
            const total = ref(0)
            const operateType = ref(null)
            const operateOptions = [
                {
                    label: "批量发货",
                    value: 1
                },
                {
                    label: "删除订单",
                    value: 2
                }
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
            function handleDeleteOrder(index, row) {
                const id = {
                    id: row.id
                }
                deleteOrder(id).then(response => {
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
                listQuery.value.order_id = null;
                listQuery.value.keyword_username = null;
                listQuery.value.state = null;
                listQuery.value.create_time = null;
                getList();
            }
            function handleSearchList() {
                listQuery.value.pageNum = 1;
                getList();
            }
            // function getList() {
            //     // listLoading.value = true;
            //     fetchList(listQuery.value).then(res => {
            //       listLoading.value = false;
            //       list.value = res.data.list;
            //       total.value = res.data.total;
            //       console.log(list.value)
            //       console.log(total.value)
            //     }).catch(err => {
            //       listLoading.value = false;
            //       console.log(err);
            //     });
            // }
          function getList() {
            console.log("11111111111111111111111111111111")
            AllList(listQuery.value).then(res => {
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
                console.log(operateType.value, multipleSelection.value)  //to do
            }
            onMounted(() => {
                getList();
            })
            return {
                statusOptions,
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
                handleDeleteOrder,
                handleLogisticsDialogClose,
                handleSizeChange,
                handleCurrentChange,
                handleBatchOperate,
                handleResetSearch,
                handleSearchList,
            }
        }
    }
    // import {fetchList,closeOrder,deleteOrder} from '@/api/order'
    // import {formatDate} from '@/utils/date';
    // import LogisticsDialog from '@/views/oms/order/components/logisticsDialog';
    // const defaultListQuery = {
    //   pageNum: 1,
    //   pageSize: 10,
    //   orderSn: null,
    //   receiverKeyword: null,
    //   status: null,
    //   orderType: null,
    //   sourceType: null,
    //   createTime: null,
    // };
    // export default {
    //   name: "orderList",
    //   components:{LogisticsDialog},
    //   data() {
    //     return {
    //       listQuery: Object.assign({}, defaultListQuery),
    //       listLoading: true,
    //       list: null,
    //       total: null,
    //       operateType: null,
    //       multipleSelection: [],
    //       closeOrder:{
    //         dialogVisible:false,
    //         content:null,
    //         orderIds:[]
    //       },
    //       statusOptions: [
    //         {
    //           label: '待付款',
    //           value: 0
    //         },
    //         {
    //           label: '待发货',
    //           value: 1
    //         },
    //         {
    //           label: '已发货',
    //           value: 2
    //         },
    //         {
    //           label: '已完成',
    //           value: 3
    //         },
    //         {
    //           label: '已关闭',
    //           value: 4
    //         }
    //       ],
    //       orderTypeOptions: [
    //         {
    //           label: '正常订单',
    //           value: 0
    //         },
    //         {
    //           label: '秒杀订单',
    //           value: 1
    //         }
    //       ],
    //       sourceTypeOptions: [
    //         {
    //           label: 'PC订单',
    //           value: 0
    //         },
    //         {
    //           label: 'APP订单',
    //           value: 1
    //         }
    //       ],
    //       operateOptions: [
    //         {
    //           label: "批量发货",
    //           value: 1
    //         },
    //         {
    //           label: "关闭订单",
    //           value: 2
    //         },
    //         {
    //           label: "删除订单",
    //           value: 3
    //         }
    //       ],
    //       logisticsDialogVisible:false
    //     }
    //   },
    //   created() {
    //     this.getList();
    //   },
    //   filters: {
    //     formatCreateTime(time) {
    //       let date = new Date(time);
    //       return formatDate(date, 'yyyy-MM-dd hh:mm:ss')
    //     },
    //     formatPayType(value) {
    //       if (value === 1) {
    //         return '支付宝';
    //       } else if (value === 2) {
    //         return '微信';
    //       } else {
    //         return '未支付';
    //       }
    //     },
    //     formatSourceType(value) {
    //       if (value === 1) {
    //         return 'APP订单';
    //       } else {
    //         return 'PC订单';
    //       }
    //     },
    //     formatStatus(value) {
    //       if (value === 1) {
    //         return '待发货';
    //       } else if (value === 2) {
    //         return '已发货';
    //       } else if (value === 3) {
    //         return '已完成';
    //       } else if (value === 4) {
    //         return '已关闭';
    //       } else if (value === 5) {
    //         return '无效订单';
    //       } else {
    //         return '待付款';
    //       }
    //     },
    //   },
    //   methods: {
    //     handleResetSearch() {
    //       this.listQuery = Object.assign({}, defaultListQuery);
    //     },
    //     handleSearchList() {
    //       this.listQuery.pageNum = 1;
    //       this.getList();
    //     },
    //     handleSelectionChange(val){
    //       this.multipleSelection = val;
    //     },
    //     handleViewOrder(index, row){
    //       this.$router.push({path:'/oms/orderDetail',query:{id:row.id}})
    //     },
    //     handleCloseOrder(index, row){
    //       this.closeOrder.dialogVisible=true;
    //       this.closeOrder.orderIds=[row.id];
    //     },
    //     handleDeliveryOrder(index, row){
    //       let listItem = this.covertOrder(row);
    //       this.$router.push({path:'/oms/deliverOrderList',query:{list:[listItem]}})
    //     },
    //     handleViewLogistics(index, row){
    //       this.logisticsDialogVisible=true;
    //     },
    //     handleDeleteOrder(index, row){
    //       let ids=[];
    //       ids.push(row.id);
    //       this.deleteOrder(ids);
    //     },
    //     handleBatchOperate(){
    //       if(this.multipleSelection==null||this.multipleSelection.length<1){
    //         this.$message({
    //           message: '请选择要操作的订单',
    //           type: 'warning',
    //           duration: 1000
    //         });
    //         return;
    //       }
    //       if(this.operateType===1){
    //         //批量发货
    //         let list=[];
    //         for(let i=0;i<this.multipleSelection.length;i++){
    //           if(this.multipleSelection[i].status===1){
    //             list.push(this.covertOrder(this.multipleSelection[i]));
    //           }
    //         }
    //         if(list.length===0){
    //           this.$message({
    //             message: '选中订单中没有可以发货的订单',
    //             type: 'warning',
    //             duration: 1000
    //           });
    //           return;
    //         }
    //         this.$router.push({path:'/oms/deliverOrderList',query:{list:list}})
    //       }else if(this.operateType===2){
    //         //关闭订单
    //         this.closeOrder.orderIds=[];
    //         for(let i=0;i<this.multipleSelection.length;i++){
    //           this.closeOrder.orderIds.push(this.multipleSelection[i].id);
    //         }
    //         this.closeOrder.dialogVisible=true;
    //       }else if(this.operateType===3){
    //         //删除订单
    //         let ids=[];
    //         for(let i=0;i<this.multipleSelection.length;i++){
    //           ids.push(this.multipleSelection[i].id);
    //         }
    //         this.deleteOrder(ids);
    //       }
    //     },
    //     handleSizeChange(val){
    //       this.listQuery.pageNum = 1;
    //       this.listQuery.pageSize = val;
    //       this.getList();
    //     },
    //     handleCurrentChange(val){
    //       this.listQuery.pageNum = val;
    //       this.getList();
    //     },
    //     handleCloseOrderConfirm() {
    //       if (this.closeOrder.content == null || this.closeOrder.content === '') {
    //         this.$message({
    //           message: '操作备注不能为空',
    //           type: 'warning',
    //           duration: 1000
    //         });
    //         return;
    //       }
    //       let params = new URLSearchParams();
    //       params.append('ids', this.closeOrder.orderIds);
    //       params.append('note', this.closeOrder.content);
    //       closeOrder(params).then(response=>{
    //         this.closeOrder.orderIds=[];
    //         this.closeOrder.dialogVisible=false;
    //         this.getList();
    //         this.$message({
    //           message: '修改成功',
    //           type: 'success',
    //           duration: 1000
    //         });
    //       });
    //     },
    //     getList() {
    //       this.listLoading = true;
    //       fetchList(this.listQuery).then(response => {
    //         this.listLoading = false;
    //         this.list = response.data.list;
    //         this.total = response.data.total;
    //       });
    //     },
    //     deleteOrder(ids){
    //       this.$confirm('是否要进行该删除操作?', '提示', {
    //         confirmButtonText: '确定',
    //         cancelButtonText: '取消',
    //         type: 'warning'
    //       }).then(() => {
    //         let params = new URLSearchParams();
    //         params.append("ids",ids);
    //         deleteOrder(params).then(response=>{
    //           this.$message({
    //             message: '删除成功！',
    //             type: 'success',
    //             duration: 1000
    //           });
    //           this.getList();
    //         });
    //       })
    //     },
    //     covertOrder(order){
    //       let address=order.receiverProvince+order.receiverCity+order.receiverRegion+order.receiverDetailAddress;
    //       let listItem={
    //         orderId:order.id,
    //         orderSn:order.orderSn,
    //         receiverName:order.receiverName,
    //         receiverPhone:order.receiverPhone,
    //         receiverPostCode:order.receiverPostCode,
    //         address:address,
    //         deliveryCompany:null,
    //         deliverySn:null
    //       };
    //       return listItem;
    //     }
    //   }
    // }
  </script>
  <style scoped>
    .input-width {
      width: 203px;
    }
  </style>