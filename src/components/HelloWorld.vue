<template>  
    <el-table :data="tableData" style="width: 100%">  
      <el-table-column prop="deptno" label="deptno" width="180"></el-table-column>  
      <el-table-column prop="dname" label="dname" width="180"></el-table-column>  
      <el-table-column prop="loc" label="loc"></el-table-column>  
    </el-table>  
  </template>  
    
  <script>  
  
  import { ref, onMounted } from 'vue'  
  import axios from 'axios' // 确保你已经安装了 axios 或其他 HTTP 客户端
  
  export default {  
    setup() {  
      const tableData = ref([])  
    
      onMounted(async () => {  
        try {  
          const response = await axios.get('http://localhost:8080/dept/list')  
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