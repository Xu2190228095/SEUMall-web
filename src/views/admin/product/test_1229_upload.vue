<template>

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
import axios from 'axios'


export default {
  setup() {
    const tableData = ref([])
    const instance = getCurrentInstance();
    const $axios = instance.appContext.config.globalProperties.$axios;

    const inputValue = ref('')

    const image = ref('')

    function handleClick() {
      console.log('Clicked:', inputValue.value)
      const origin_url='/image/list?originUrl_info='+inputValue.value
      console.log('origin_url', origin_url)

      const response = $axios({
        method: 'get',
        // url: '/image/list?originUrl_info=iphone16_img',
        url: origin_url,
        data:{
          // params: {originUrl_info: 'iphone16_img',}
        },})
          .then(response => {
            console.log('Data posted:', response.data);
            const data2=response.data;
            console.log('URL', data2.remoteUrl);

            try {
              // 用远程URL去找
              const response = $axios({
                method: 'post',
                url: '/fastdfs/download',
                data: data2.remoteUrl,
                responseType: 'blob',
                headers: {
                  'Content-Type': 'text/plain'
                }
              }).then(response => {
                const url = window.URL.createObjectURL(new Blob([response.data], {type: 'image/jpg'}));
                image.value = url;
              })
            } catch (error) {
              console.error('Failed to fetch data:', error)
            }
      })

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
