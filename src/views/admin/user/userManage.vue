<template>
  <div class="app-container">

    <el-card class="filter-container" shadow="never">
      <div>
        <!-- <i class="el-icon-search"></i> -->
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
            <el-input v-model="listQuery.username" class="input-width" placeholder="请输入帐号" clearable></el-input>
          </el-form-item>
        </el-form>
      </div>
    </el-card>

    <el-card class="operate-container" shadow="never">
      <!-- <i class="el-icon-tickets"></i> -->
      <span>数据列表</span>
      <el-button size="mini" class="btn-add" @click="handleAdd()" style="float:right">添加</el-button>
    </el-card>

    <div class="table-container">
      <el-table ref="adminTable"
                :data="list"
                style="width: 100%;"
                v-loading="listLoading" border>
        <el-table-column label="编号" width="100" align="center">
          <template #default="scope">{{scope.row.uid}}</template>
        </el-table-column>

        <el-table-column label="帐号" align="center">
          <template #default="scope">{{scope.row.username}}</template>
        </el-table-column>

        <el-table-column label="角色" align="center">
          <template #default="scope">
            <div>
            <!-- 根据 scope.row.character 显示不同内容 -->
            <span v-if="scope.row.character === 'ROLE_admin'">管理员</span>
            <span v-else-if="scope.row.character === 'ROLE_user'">商家</span>
            <span v-else>未知角色</span>
          </div>
          </template>
        </el-table-column>
        
        <el-table-column label="邮箱" align="center">
          <template #default="scope">{{scope.row.email}}</template>
        </el-table-column>

        <el-table-column label="添加时间" width="160" align="center">
          <template #default="scope">{{scope.row.createTime}}</template>
        </el-table-column>

        <el-table-column label="最后登录" width="160" align="center">
          <template #default="scope">{{scope.row.lastLoginTime}}</template>
        </el-table-column>

        <el-table-column label="是否启用" width="140" align="center">
          <template #default="scope">
            <el-switch
              @change="handleStatusChange(scope.$index, scope.row)"
              :active-value=true
              :inactive-value=false
              v-model="scope.row.isActive">
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180" align="center">
          <template #default="scope">
            <el-button size="mini"
                       type="text"
                       @click="handleUpdate(scope.$index, scope.row)">
              编辑
            </el-button>
            <el-button size="mini"
                       type="text"
                       @click="handleDelete(scope.$index, scope.row)">删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="pagination-container">
      <el-pagination
        background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        layout="total, sizes,prev, pager, next,jumper"
        v-model:current-page="listQuery.pageNum"
        v-model:page-size="listQuery.pageSize"
        :page-sizes="[5,10,15,20]"
        v-model:total="total">
      </el-pagination>
    </div>

    <el-dialog
      :title="isEdit?'编辑用户':'添加用户'"
      v-model="dialogVisible"
      align-center
      width="40%">
      <el-form :model="admin"
               ref="adminForm"
               label-width="150px" size="small">
        <el-form-item label="帐号：">
          <el-input v-model="admin.username" style="width: 250px"></el-input>
        </el-form-item>
        <el-form-item label="邮箱：">
          <el-input v-model="admin.email" style="width: 250px"></el-input>
        </el-form-item>
        <el-form-item label="密码：">
          <el-input v-model="admin.password"  type="password" style="width: 250px"></el-input>
        </el-form-item>
        <el-form-item label="是否启用：">
          <el-radio-group v-model="admin.isActive">
            <el-radio :label=true>是</el-radio>
            <el-radio :label=false>否</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false" size="small">取 消</el-button>
        <el-button type="primary" @click="handleDialogConfirm()" size="small">确 定</el-button>
      </span>
    </el-dialog>

  </div>
</template>
<script>
  import { user_info } from '../../../api/UserInfo';
  import { reactive, ref, onMounted, getCurrentInstance } from 'vue'
  import { fetchList , deleteUser, addUser, updateUser} from '@/api/user'

  export default {
    setup() {
      const list = ref([
        // {
        //   uid: '1',
        //   username: 'admin',
        //   email: 'test@qq.com',
        //   createTime: '2017-01-01 00:00:00',
        //   lastLoginTime: '2018-01-01 00:00:00',
        //   isActive: true,
        // },
        // {
        //   uid: '2',
        //   username: 'seller',
        //   email: '111',
        //   createTime: '111',
        //   lastLoginTime: '111',
        //   isActive: true,
        // },
        // {
        //   uid: '3',
        //   username: 'seller',
        //   email: '111',
        //   createTime: '111',
        //   lastLoginTime: '111',
        //   isActive: true,
        // },
        // {
        //   uid: '4',
        //   username: 'seller',
        //   email: '111',
        //   createTime: '111',
        //   lastLoginTime: '111',
        //   isActive: true,
        // },
        // {
        //   uid: '5',
        //   username: 'seller',
        //   email: '111',
        //   createTime: '111',
        //   lastLoginTime: '111',
        //   isActive: true,
        // },
        // {
        //   uid: '6',
        //   username: 'seller',
        //   email: '111',
        //   createTime: '111',
        //   lastLoginTime: '111',
        //   isActive: true,
        // }
      ]);
      const isEdit = ref(false);
      const dialogVisible = ref(false);
      const admin = ref({
        username: null,
        password: null,
        email: null,
        isActive: true
      });
      const listQuery = ref({
        pageNum: 1,
        pageSize: 5,
        username: null
      });
      const total = ref(0);
      const listLoading = ref(false);
      onMounted(() => {
        getList();
      });
      function handleStatusChange(index, row) {
        console.log(index, row);  //to do
      }
      function handleDelete(index, row) {
        console.log(index, row);  //to do
        const uid = {
          uid: row.uid
        }
        deleteUser(uid).then(response => {
        }).catch(error => {
          console.log(error);
        });
        getList();
      }
      function handleUpdate(index, row) {
        isEdit.value = true;
        dialogVisible.value = true;
        admin.value = row;//Object.assign({}, row);  //深拷贝
        admin.value.password = null;
      }
      function handleAdd() {
        isEdit.value = false;
        dialogVisible.value = true;
        admin.value = {
          username: null,
          password: null,
          email: null,
          isActive: true
        };
      }
      function handleDialogConfirm() {
        if(isEdit.value == true){
          updateUser(admin.value).then(response => {
            dialogVisible.value = false;
            getList();
          }).catch(error => {
            console.log(error);
          });
        }else{
          addUser(admin.value).then(response => {
            dialogVisible.value = false;
            getList();
          }).catch(error => {
            console.log(error);
          });
        }
        dialogVisible.value = false;
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
        listQuery.value.username = null;
        getList();
      }
      function handleSearchList() {
        listQuery.value.pageNum = 1;
        getList();
      }
      function getList(){
        listLoading.value = true;
        fetchList(listQuery.value).then(response => {
          listLoading.value = false;
          list.value = response.data.list;
          total.value = response.data.total;
          console.log(list.value)
          console.log(total.value)
        }).catch(error => {
          console.log(error);
          listLoading.value = false;
        });
      }
      return {
        list,
        isEdit,
        dialogVisible,
        admin,
        listQuery,
        total,
        listLoading,
        handleStatusChange,
        handleDelete,
        handleUpdate,
        handleAdd,
        handleDialogConfirm,
        handleSizeChange,
        handleCurrentChange,
        handleResetSearch,
        handleSearchList,
      }
    }
  }
  // import {fetchList,createAdmin,updateAdmin,updateStatus,deleteAdmin,getRoleByAdmin,allocRole} from '@/api/login';
  // import {fetchAllRoleList} from '@/api/role';
  // import {formatDate} from '@/utils/date';

  // const defaultListQuery = {
  //   pageNum: 1,
  //   pageSize: 10,
  //   username: null
  // };
  // const defaultAdmin = {
  //   id: null,
  //   username: null,
  //   password: null,
  //   nickName: null,
  //   email: null,
  //   note: null,
  //   status: 1
  // };
  // export default {
  //   name: 'adminList',
  //   data() {
  //     return {
  //       listQuery: Object.assign({}, defaultListQuery),
  //       list: null,
  //       total: null,
  //       listLoading: false,
  //       dialogVisible: false,
  //       admin: Object.assign({}, defaultAdmin),
  //       isEdit: false,
  //       allocDialogVisible: false,
  //       allocRoleIds:[],
  //       allRoleList:[],
  //       allocAdminId:null
  //     }
  //   },
  //   created() {
  //     this.getList();
  //     this.getAllRoleList();
  //   },
  //   filters: {
  //     formatDateTime(time) {
  //       if (time == null || time === '') {
  //         return 'N/A';
  //       }
  //       let date = new Date(time);
  //       return formatDate(date, 'yyyy-MM-dd hh:mm:ss')
  //     }
  //   },
  //   methods: {
  //     handleResetSearch() {
  //       this.listQuery = Object.assign({}, defaultListQuery);
  //     },
  //     handleSearchList() {
  //       this.listQuery.pageNum = 1;
  //       this.getList();
  //     },
  //     handleSizeChange(val) {
  //       this.listQuery.pageNum = 1;
  //       this.listQuery.pageSize = val;
  //       this.getList();
  //     },
  //     handleCurrentChange(val) {
  //       this.listQuery.pageNum = val;
  //       this.getList();
  //     },
  //     handleAdd() {
  //       this.dialogVisible = true;
  //       this.isEdit = false;
  //       this.admin = Object.assign({},defaultAdmin);
  //     },
  //     handleStatusChange(index, row) {
  //       this.$confirm('是否要修改该状态?', '提示', {
  //         confirmButtonText: '确定',
  //         cancelButtonText: '取消',
  //         type: 'warning'
  //       }).then(() => {
  //         updateStatus(row.id, {status: row.status}).then(response => {
  //           this.$message({
  //             type: 'success',
  //             message: '修改成功!'
  //           });
  //         });
  //       }).catch(() => {
  //         this.$message({
  //           type: 'info',
  //           message: '取消修改'
  //         });
  //         this.getList();
  //       });
  //     },
  //     handleDelete(index, row) {
  //       this.$confirm('是否要删除该用户?', '提示', {
  //         confirmButtonText: '确定',
  //         cancelButtonText: '取消',
  //         type: 'warning'
  //       }).then(() => {
  //         deleteAdmin(row.id).then(response => {
  //           this.$message({
  //             type: 'success',
  //             message: '删除成功!'
  //           });
  //           this.getList();
  //         });
  //       });
  //     },
  //     handleUpdate(index, row) {
  //       this.dialogVisible = true;
  //       this.isEdit = true;
  //       this.admin = Object.assign({},row);
  //     },
  //     handleDialogConfirm() {
  //       this.$confirm('是否要确认?', '提示', {
  //         confirmButtonText: '确定',
  //         cancelButtonText: '取消',
  //         type: 'warning'
  //       }).then(() => {
  //         if (this.isEdit) {
  //           updateAdmin(this.admin.id,this.admin).then(response => {
  //             this.$message({
  //               message: '修改成功！',
  //               type: 'success'
  //             });
  //             this.dialogVisible =false;
  //             this.getList();
  //           })
  //         } else {
  //           createAdmin(this.admin).then(response => {
  //             this.$message({
  //               message: '添加成功！',
  //               type: 'success'
  //             });
  //             this.dialogVisible =false;
  //             this.getList();
  //           })
  //         }
  //       })
  //     }
  //     getList() {
  //       this.listLoading = true;
  //       fetchList(this.listQuery).then(response => {
  //         this.listLoading = false;
  //         this.list = response.data.list;
  //         this.total = response.data.total;
  //       });
  //     }
  //   }
  // }
</script>
<style></style>


