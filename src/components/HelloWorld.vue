<template>
  <!-- <el-table :data="tableData" style="width: 100%"> -->
<!--    <el-table-column prop="deptno" label="deptno" width="180"></el-table-column>-->
<!--    <el-table-column prop="dname" label="dname" width="180"></el-table-column>-->
<!--    <el-table-column prop="loc" label="loc"></el-table-column>-->
    <!-- <el-table-column prop="id" label="id" width="180"></el-table-column>
    <el-table-column prop="username" label="username" width="180"></el-table-column>
    <el-table-column prop="password" label="password"></el-table-column>
  </el-table> -->
  <el-input v-model="inputValue" placeholder="请输入文件地址" style="width: 40%"></el-input>
  <el-button type="primary" @click="handleClick">下载文件</el-button>
  <el-image :src="image" style="width: 100%"></el-image>

  <el-upload
    v-model:file-list="fileList"
    class="upload-demo"
    drag
    action="http://localhost:8080/fastdfs/upload"
    :on-preview="handlePreview"
    multiple
    :on-remove="handleRemove"
    list-type="picture"
  >
    <el-icon class="el-icon--upload"><upload-filled /></el-icon>
    <div class="el-upload__text">
      Drop file here or <em>click to upload</em>
    </div>
    <template #tip>
      <div class="el-upload__tip">
        jpg/png files with a size less than 500kb
      </div>
    </template>
  </el-upload>
</template>

<script lang = "ts">
import {ref, onMounted, getCurrentInstance} from 'vue'
import { UploadFilled } from '@element-plus/icons-vue'
import type { UploadProps, UploadUserFile } from 'element-plus'

export default {
  setup() {
    const tableData = ref([])
    const instance = getCurrentInstance();
    const $axios = instance.appContext.config.globalProperties.$axios;

    // onMounted(async () => {
    //   try {
    //     // const response = await $axios.get('/dept/list')
    //     const response = await $axios.get('/user/list')
    //     tableData.value = response.data
    //     // 在这里打印数据
    //     console.log('Fetched User Data:', tableData.value);
    //   } catch (error) {
    //     console.error('Failed to fetch data:', error)
    //   }
    // })

    const inputValue = ref('')

    const image = ref('')

    function handleClick(){
      console.log('Clicked:', inputValue.value)
      // 在这里调用接口
      try {
        // const response = await $axios.post('/dept/add', {
        const response = $axios({
            method: 'post',
            url: '/fastdfs/download',
            data: inputValue.value,
            responseType: 'blob',
            headers: {
              'Content-Type':'text/plain'
            }
          }).then(response => {
            const url = window.URL.createObjectURL(new Blob([response.data], {type: 'image/jpg'}));
            image.value = url;
            // const link = document.createElement('a');
            // link.href = url;
            // link.setAttribute('download', 'download.jpg');
            // document.body.appendChild(link);
            // link.click();
          })
      }catch (error) {
        console.error('Failed to fetch data:', error)
      }
    }

    const fileList = ref<UploadUserFile[]>([])
    const handlePreview: UploadProps['onPreview'] = (file) => {
      console.log(file)
    }

    const handleRemove: UploadProps['onRemove'] = (uploadFile, uploadFiles) => {
      console.log(uploadFile, uploadFiles)
    }

    return {
      tableData,
      inputValue,
      handleClick,
      image,
      handlePreview,
      handleRemove,
      fileList,
    }
  }
}

</script>

<style scoped>
/* 你可以在这里添加你的样式 */
</style>
