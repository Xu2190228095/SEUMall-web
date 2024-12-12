<template>
  <el-container class="layout-container-demo" style="height: 500px">
    <el-header style="text-align: right; font-size: 12px">
      <div class="toolbar">
        <el-dropdown>
          <el-icon style="margin-right: 8px; margin-top: 1px">
            <setting/>
          </el-icon>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item>
                <router-link to="/sellerInfo">个人资料</router-link>
              </el-dropdown-item>
              <el-dropdown-item>
                <router-link to="/sellerInfo">安全设置</router-link>
              </el-dropdown-item>
              <el-dropdown-item>
                <router-link to="/sellerInfo">账号绑定</router-link>
              </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
        <span>Tom</span>
      </div>
    </el-header>

    <el-container>
      <el-aside width="200px">
        <el-scrollbar>
          <el-menu :default-openeds="['1', '2']">
            <el-sub-menu index="1">
              <template #title>
                <el-icon><message /></el-icon>商品管理
              </template>
              <el-menu-item-group>
                <el-menu-item index="1-1">
                  <router-link to="/admin/product_info">商品列表</router-link>
                </el-menu-item>
                <el-menu-item index="1-2">
                  <router-link to="/admin/product_add">添加商品</router-link>
                </el-menu-item>
              </el-menu-item-group>
            </el-sub-menu>
            <el-sub-menu index="2">
              <template #title>
                <el-icon><icon-menu /></el-icon>订单管理
              </template>
              <el-menu-item-group>
                <el-menu-item index="2-1">
                  <router-link to="/admin/order_info">订单列表</router-link>
                </el-menu-item>
                <el-menu-item index="2-2">
                  <router-link to="/admin/refund_deal">退款处理</router-link>
                </el-menu-item>
              </el-menu-item-group>
            </el-sub-menu>
          </el-menu>
        </el-scrollbar>
      </el-aside>

      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>


<!--<script>-->
<script lang="ts" setup>
import {ref} from 'vue'
import {Menu as IconMenu, Message, Setting} from '@element-plus/icons-vue'


const item = {
  date: '2016-05-02',
  name: 'Tom',
  address: 'No. 189, Grove St, Los Angeles',
}
const tableData = ref(Array.from({length: 20}).fill(item))

const categories= [
        { id: 1, name: '商品信息', link: { name: 'product_info' }  },
        { id: 2, name: '添加商品', link: { name: 'product_add' }  },
        { id: 3, name: '订单列表', link: { name: 'order_info' }  },
        { id: 4, name: '退货处理', link: { name: 'refund_deal' }  },
      ]

</script>

<style scoped>
.layout-container-demo .el-header {
  position: relative;
  background-color: var(--el-color-primary-light-7);
  color: var(--el-text-color-primary);
}

.layout-container-demo .el-aside {
  color: var(--el-text-color-primary);
  background: var(--el-color-primary-light-8);
}

.layout-container-demo .el-menu {
  border-right: none;
}

.layout-container-demo .el-main {
  padding: 0;
}

.layout-container-demo .toolbar {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  right: 20px;
}
</style>
