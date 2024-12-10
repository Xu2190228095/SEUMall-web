<template>
  <el-table :data="tableData" style="width: 100%">
    <el-table-column prop="deptno" label="deptno" width="180"></el-table-column>
    <el-table-column prop="dname" label="dname" width="180"></el-table-column>
    <el-table-column prop="loc" label="loc"></el-table-column>
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
        const response = await $axios.get('/dept/list')
        tableData.value = response.data
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
