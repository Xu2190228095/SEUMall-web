<template> 
  <el-card class="form-container" shadow="never">
    <div class="centered-title-container">
      <h1>填写商品信息</h1>
    </div>
    <div style="margin-top: 50px">
      <el-form :model="value" :rules="rules" ref="productInfoForm" label-width="120px" class="form-inner-container" size="small">
        <el-form-item label="商品分类：" prop="productCategoryId">
          <el-cascader
              v-model="selectProductCateValue"
              :options="productCateOptions">
          </el-cascader>
        </el-form-item>
        <el-form-item label="商品名称：" prop="name">
          <el-input v-model="value.name"></el-input>
        </el-form-item>
        <el-form-item label="副标题：" prop="subTitle">
          <el-input v-model="value.subTitle"></el-input>
        </el-form-item>
        <el-form-item label="商品品牌：" prop="brandId">
          <el-select
              v-model="value.brandId"
              @change="handleBrandChange"
              placeholder="请选择品牌">
            <el-option
                v-for="item in brandOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="商品介绍：">
          <el-input
              :autoSize="true"
              v-model="value.description"
              type="textarea"
              placeholder="请输入内容"></el-input>
        </el-form-item>
        <el-form-item label="商品货号：">
          <el-input v-model="value.productSn"></el-input>
        </el-form-item>
        <el-form-item label="商品售价：">
          <el-input v-model="value.price"></el-input>
        </el-form-item>
        <!--      <el-form-item label="市场价：">-->
        <!--        <el-input v-model="value.originalPrice"></el-input>-->
        <!--      </el-form-item>-->
        <el-form-item label="商品库存：">
          <el-input v-model="value.stock"></el-input>
        </el-form-item>
        <el-form-item label="计量单位：">
          <el-input v-model="value.unit"></el-input>
        </el-form-item>
        <el-form-item style="text-align: center">
          <el-button type="primary" size="medium" @click="handleNext('productInfoForm')">下一步</el-button>
        </el-form-item>
      </el-form>
    </div>
  </el-card>

</template>
<script>
import ProductInfoDetail from './AddProductComponents/Add_productinfo.vue';

const defaultProductParam = {
  albumPics: '',
  brandId: null,
  brandName: '',
  deleteStatus: 0,
  description: '',
  detailDesc: '',
  detailHtml: '',
  detailMobileHtml: '',
  detailTitle: '',
  feightTemplateId: 0,
  flashPromotionCount: 0,
  flashPromotionId: 0,
  flashPromotionPrice: 0,
  flashPromotionSort: 0,
  giftPoint: 0,
  giftGrowth: 0,
  keywords: '',
  lowStock: 0,
  name: '',
  newStatus: 0,
  note: '',
  originalPrice: 0,
  pic: '',
  //会员价格{memberLevelId: 0,memberPrice: 0,memberLevelName: null}
  memberPriceList: [],
  //商品满减
  productFullReductionList: [{fullPrice: 0, reducePrice: 0}],
  //商品阶梯价格
  productLadderList: [{count: 0,discount: 0,price: 0}],
  previewStatus: 0,
  price: 0,
  productAttributeCategoryId: null,
  //商品属性相关{productAttributeId: 0, value: ''}
  productAttributeValueList: [],
  //商品sku库存信息{lowStock: 0, pic: '', price: 0, sale: 0, skuCode: '', spData: '', stock: 0}
  skuStockList: [],
  //商品相关专题{subjectId: 0}
  subjectProductRelationList: [],
  //商品相关优选{prefrenceAreaId: 0}
  prefrenceAreaProductRelationList: [],
  productCategoryId: null,
  productCategoryName: '',
  productSn: '',
  promotionEndTime: '',
  promotionPerLimit: 0,
  promotionPrice: null,
  promotionStartTime: '',
  promotionType: 0,
  publishStatus: 0,
  recommandStatus: 0,
  sale: 0,
  serviceIds: '',
  sort: 0,
  stock: 0,
  subTitle: '',
  unit: '',
  usePointLimit: 0,
  verifyStatus: 0,
  weight: 0
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
      brandOptions: [{
        label: '小米',
        value: '小米'
      }],
      value:Object.assign({}, defaultProductParam),
      rules: {
        name: [
          {required: true, message: '请输入商品名称', trigger: 'blur'},
          {min: 2, max: 140, message: '长度在 2 到 140 个字符', trigger: 'blur'}
        ],
        subTitle: [{required: true, message: '请输入商品副标题', trigger: 'blur'}],
        productCategoryId: [{required: true, message: '请选择商品分类', trigger: 'blur'}],
        brandId: [{required: true, message: '请选择商品品牌', trigger: 'blur'}],
        description: [{required: true, message: '请输入商品介绍', trigger: 'blur'}],
        requiredProp: [{required: true, message: '该项为必填项', trigger: 'blur'}]
      }

    }
  },
  created(){
    if(this.isEdit){
      getProduct(this.$route.query.id).then(response=>{
        this.productParam=response.data;
      });
    }
  },
  methods: {
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
    finishCommit(isEdit) {
      this.$confirm('是否要提交该产品', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        if(isEdit){
          updateProduct(this.$route.query.id,this.productParam).then(response=>{
            this.$message({
              type: 'success',
              message: '提交成功',
              duration:1000
            });
            this.$router.back();
          });
        }else{
          createProduct(this.productParam).then(response=>{
            this.$message({
              type: 'success',
              message: '提交成功',
              duration:1000
            });
            location.reload();
          });
        }
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
</style>
<script setup lang="ts">
</script>