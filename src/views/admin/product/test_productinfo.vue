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
        <el-form-item label="上传图片">
          <el-upload
              class="upload-demo"
              action="https://jsonplaceholder.typicode.com/posts/"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              :file-list="fileList"
              list-type="picture">
            <el-button size="small" type="primary">点击上传</el-button>
            <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
          </el-upload>
        </el-form-item>

        <el-upload action="https://jsonplaceholder.typicode.com/posts/" multiple list-type="picture-card" :data="fileData" name="img"
                   accept="image/jpeg,image/png,image/jpg" :on-preview="handlePictureCardPreview" :on-remove="handleRemove"
                   :on-success="handleimg">
          <el-icon>
            <Plus />
          </el-icon>
          <template #tip>
            <div class="el-upload__tip">只能上传jpg/png/jpeg文件，且单个不超过2M</div>
          </template>
        </el-upload>
        <el-dialog v-model="dialogVisible">
          <img w-full :src="imageUrl" alt="Preview Image" />
        </el-dialog>

        <el-form-item style="text-align: center">
          <el-button type="primary" size="medium" @click="finishCommit()">添加商品</el-button>
        </el-form-item>
      </el-form>
    </div>
  </el-card>

</template>
<script>

import { addProduct } from '@/api/product'

// const defaultProductParam = {
//   albumPics: '',
//   brandId: null,
//   brandName: '',
//   deleteStatus: 0,
//   detailDesc: '',
//   detailHtml: '',
//   detailMobileHtml: '',
//   detailTitle: '',
//   feightTemplateId: 0,
//   flashPromotionCount: 0,
//   flashPromotionId: 0,
//   flashPromotionPrice: 0,
//   flashPromotionSort: 0,
//   giftPoint: 0,
//   giftGrowth: 0,
//   keywords: '',
//   lowStock: 0,
//
//   newStatus: 0,
//   note: '',
//   originalPrice: 0,
//   pic: '',
//   //会员价格{memberLevelId: 0,memberPrice: 0,memberLevelName: null}
//   memberPriceList: [],
//   //商品满减
//   productFullReductionList: [{fullPrice: 0, reducePrice: 0}],
//   //商品阶梯价格
//   productLadderList: [{count: 0,discount: 0,price: 0}],
//   previewStatus: 0,
//
//   productAttributeCategoryId: null,
//   //商品属性相关{productAttributeId: 0, value: ''}
//   productAttributeValueList: [],
//   //商品sku库存信息{lowStock: 0, pic: '', price: 0, sale: 0, skuCode: '', spData: '', stock: 0}
//   skuStockList: [],
//   //商品相关专题{subjectId: 0}
//   subjectProductRelationList: [],
//   //商品相关优选{prefrenceAreaId: 0}
//   prefrenceAreaProductRelationList: [],
//   productCategoryName: '',
//   productSn: '',
//   promotionEndTime: '',
//   promotionPerLimit: 0,
//   promotionPrice: null,
//   promotionStartTime: '',
//   promotionType: 0,
//   publishStatus: 0,
//   recommandStatus: 0,
//   sale: 0,
//   serviceIds: '',
//   sort: 0,
//
//   subTitle: '',
//   unit: '',
//   usePointLimit: 0,
//   verifyStatus: 0,
//   weight: 0,
//
//   number: 0,
//   price: 0,
//   desc: '',
//   pname: '',
//   productCategoryId: null,
// };

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
        subTitle: [{required: true, message: '请输入商品副标题', trigger: 'blur'}],
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

    handleRemove(img, fileList) {
      console.log(img, fileList);
    },
    handlePictureCardPreview(img) {//这里需要注意 用的img并不是file，因为接口文档给的是img，我们在upload中定义个name=“img”参数就可以了
      // 检查文件类型
      const isImage = img.raw.type.includes("image");
      if (!isImage) {
        this.$message.error("上传文件类型必须是图片!");
        return false
      }
      // 检查文件大小
      if (img.size > (2 * 1024 * 1024)) {
        this.$message.error(`上传文件大小不能超过10Mb`);
        this.$refs['refUpload'].handleRemove(img);
        return false;
      }
      // 检查文件数量
      if (fileList.length > 1) {
        this.$message.error(`上传文件最大数量为1`);
        this.$refs['refUpload'].handleRemove(img);
        return false;
      }
      this.ImageUrl = img.url;
      this.dialogVisible = true;
    },
    handleimg(res, img, fileList) {
      console.log(img);
      console.log(fileList);
      if (res.code === 200) {
        this.url = res.data.file
      } else {
        this.$message.error(`图片${img.name}上传失败`)
      }
    },
    handlePreview(file) {
      console.log(file);
    },
    //处理编辑逻辑
    handleEditCreated(){
      if(this.value.pclass!=null){
        this.selectProductCateValue.push(this.value.pclass);
      }
    },
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
        addProduct(this.value).then(response=>{
          console.log(this.value);
          this.$message({
            type: 'success',
            message: '提交成功',
            duration:1000
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