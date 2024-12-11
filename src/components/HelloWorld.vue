<template>
  <el-table :data="tableData" style="width: 100%">
<!--    <el-table-column prop="deptno" label="deptno" width="180"></el-table-column>-->
<!--    <el-table-column prop="dname" label="dname" width="180"></el-table-column>-->
<!--    <el-table-column prop="loc" label="loc"></el-table-column>-->
    <el-table-column prop="id" label="id" width="180"></el-table-column>
    <el-table-column prop="username" label="username" width="180"></el-table-column>
    <el-table-column prop="password" label="password"></el-table-column>
  </el-table>
</template>

<script>

import {ref, onMounted, getCurrentInstance} from 'vue'

export default {
  setup() {
    const tableData = ref([])

    const instance = getCurrentInstance();
    const $axios = instance.appContext.config.globalProperties.$axios;

    onMounted(async () => {
      try {
        // const response = await $axios.get('/dept/list')
        const response = await $axios.get('/user/list')
        tableData.value = response.data
        // 在这里打印数据
        console.log('Fetched User Data:', tableData.value);
      } catch (error) {
        console.error('Failed to fetch data:', error)
      }
    })

    return {
      tableData
    }
  }
};
</script>

<style scoped>
/* 你可以在这里添加你的样式 */
</style>
