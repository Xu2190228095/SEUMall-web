<template> 
  <el-card class="form-container" shadow="never">
    <div class="centered-title-container">
      <h1>填写商品信息</h1>
    </div>
    <div style="margin-top: 50px">
      <el-form :model="value" :rules="rules" ref="productInfoForm" label-width="120px" class="form-inner-container" size="small">
        <el-form-item label="商品分类：" prop="class">
          <el-cascader
              v-model="selectProductCateValue"
              :options="productCateOptions">
          </el-cascader>
        </el-form-item>
        <el-form-item label="商品名称：" prop="name">
          <el-input v-model="value.pname"></el-input>
        </el-form-item>
        <el-form-item label="商品介绍：">
          <el-input
              :autoSize="true"
              v-model="value.desc"
              type="textarea"
              placeholder="请输入内容"></el-input>
        </el-form-item>
        <el-form-item label="商品售价：">
          <el-input v-model="value.price"></el-input>
        </el-form-item>
        <el-form-item label="商品库存：">
          <el-input v-model="value.number"></el-input>
        </el-form-item>
        <el-dialog v-model="dialogVisible">
          <img w-full :src="imageUrl" alt="Preview Image" />
        </el-dialog>

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
            点击或拖拽 <em>上传图片</em>
          </div>
          <template #tip>
            <div class="el-upload__tip">
              jpg/png格式且小于500kb
            </div>
          </template>
        </el-upload>
        <el-form-item style="text-align: center">
          <el-button type="primary" size="medium" @click="finishCommit()">添加商品</el-button>
        </el-form-item>
      </el-form>


    </div>
  </el-card>

</template>
<script>

import { addProduct } from '@/api/product'

const defaultProductParam = {
  number: 0,
  price: 0,
  desc: '',
  pname: '',
  pclass: null,
};
export default {
  name: 'ProductDetail',
  props: {
    isEdit: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      imageUrl: '',
      dialogVisible: false,
      fileData: {   // 额外参数
        id: ''
      },

      active: 0,
      productParam: Object.assign({}, defaultProductParam),
      showStatus: [true, false, false, false],
      hasEditCreated:false,
      //选中商品分类的值
      selectProductCateValue: [],
      productCateOptions: [
        {
          label: '饮料',
          value: '饮料'
        },
        {
          label: '手机',
          value: '手机'
        },
        {
          label: '电脑',
          value: '电脑'
        }],
      value:Object.assign({}, defaultProductParam),
      rules: {
        name: [
          {required: true, message: '请输入商品名称', trigger: 'blur'},
          {min: 2, max: 140, message: '长度在 2 到 140 个字符', trigger: 'blur'}
        ],
        pclass: [{required: true, message: '请选择商品分类', trigger: 'blur'}],
        brandId: [{required: true, message: '请选择商品品牌', trigger: 'blur'}],
        description: [{required: true, message: '请输入商品介绍', trigger: 'blur'}],
        requiredProp: [{required: true, message: '该项为必填项', trigger: 'blur'}]
      },
    }
  },
  // created(){
  //   if(this.isEdit){
  //     getProduct(this.$route.query.id).then(response=>{
  //       this.productParam=response.data;
  //     });
  //   }
  // },
  watch: {
    selectProductCateValue: function (newValue) {
      console.log(newValue[0]);
      this.value.pclass = newValue[0];
    }
  },
  methods: {
    getCateNameById(id){
      let name=null;
      for(let i=0;i<this.productCateOptions.length;i++){
        for(let j=0;j<this.productCateOptions[i].children.length;j++){
          if(this.productCateOptions[i].children[j].value===id){
            name=this.productCateOptions[i].children[j].label;
            return name;
          }
        }
      }
      return name;
    },
    hideAll() {
      for (let i = 0; i < this.showStatus.length; i++) {
        this.showStatus[i] = false;
      }
    },
    prevStep() {
      if (this.active > 0 && this.active < this.showStatus.length) {
        this.active--;
        this.hideAll();
        this.showStatus[this.active] = true;
      }
    },
    nextStep() {
      if (this.active < this.showStatus.length - 1) {
        this.active++;
        this.hideAll();
        this.showStatus[this.active] = true;
      }
    },
    finishCommit() {
      this.$confirm('是否要提交该产品', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        addProduct(this.value).then(response => {
          console.log(this.value);
          this.$message({
            type: 'success',
            message: '提交成功',
            duration: 1000
          });
          // location.reload();
        });
      })
    }
  }

}
</script>
<style>
.centered-title-container {
  text-align: center;
  margin-top: 50px; /* 可选：增加一些顶部间距 */
}

.form-container {
  width: 960px;
}

.form-inner-container {
  width: 800px;
}

.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.avatar-uploader .el-upload:hover {
  border-color: #409EFF;
}

.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}

.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>
<script setup lang="ts">
</script>