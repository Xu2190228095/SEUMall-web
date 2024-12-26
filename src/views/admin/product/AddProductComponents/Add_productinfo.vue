<template>
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
<!--      <el-form-item label="商品重量：">-->
<!--        <el-input v-model="value.weight" style="width: 300px"></el-input>-->
<!--        <span style="margin-left: 20px">克</span>-->
<!--      </el-form-item>-->
<!--      <el-form-item label="排序">-->
<!--        <el-input v-model="value.sort"></el-input>-->
<!--      </el-form-item>-->
      <el-form-item style="text-align: center">
        <el-button type="primary" size="medium" @click="handleNext('productInfoForm')">下一步</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
// import {fetchListWithChildren} from '@/api/productCate'
// import {fetchList as fetchBrandList} from '@/api/brand'
// import {getProduct} from '@/api/product';

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
  name: "ProductInfoDetail",
  props: {
    // value: Object,
    isEdit: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      hasEditCreated:false,
      //选中商品分类的值
      selectProductCateValue: [],
      productCateOptions: [],
      brandOptions: [],
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
    };
  },
  // created() {
  //   this.getProductCateList();
  //   this.getBrandList();
  // },
  // computed:{
  //   //商品的编号
  //   productId(){
  //     return this.value.id;
  //   }
  // },
  // watch: {
  //   productId:function(newValue){
  //     if(!this.isEdit)return;
  //     if(this.hasEditCreated)return;
  //     if(newValue===undefined||newValue==null||newValue===0)return;
  //     this.handleEditCreated();
  //   },
  //   selectProductCateValue: function (newValue) {
  //     if (newValue != null && newValue.length === 2) {
  //       this.value.productCategoryId = newValue[1];
  //       this.value.productCategoryName= this.getCateNameById(this.value.productCategoryId);
  //     } else {
  //       this.value.productCategoryId = null;
  //       this.value.productCategoryName=null;
  //     }
  //   }
  // },
  // methods: {
  //   //处理编辑逻辑
  //   handleEditCreated(){
  //     if(this.value.productCategoryId!=null){
  //       this.selectProductCateValue.push(this.value.cateParentId);
  //       this.selectProductCateValue.push(this.value.productCategoryId);
  //     }
  //     this.hasEditCreated=true;
  //   },
  //   getProductCateList() {
  //     fetchListWithChildren().then(response => {
  //       let list = response.data;
  //       this.productCateOptions = [];
  //       for (let i = 0; i < list.length; i++) {
  //         let children = [];
  //         if (list[i].children != null && list[i].children.length > 0) {
  //           for (let j = 0; j < list[i].children.length; j++) {
  //             children.push({label: list[i].children[j].name, value: list[i].children[j].id});
  //           }
  //         }
  //         this.productCateOptions.push({label: list[i].name, value: list[i].id, children: children});
  //       }
  //     });
  //   },
  //   getBrandList() {
  //     fetchBrandList({pageNum: 1, pageSize: 100}).then(response => {
  //       this.brandOptions = [];
  //       let brandList = response.data.list;
  //       for (let i = 0; i < brandList.length; i++) {
  //         this.brandOptions.push({label: brandList[i].name, value: brandList[i].id});
  //       }
  //     });
  //   },
  //   getCateNameById(id){
  //     let name=null;
  //     for(let i=0;i<this.productCateOptions.length;i++){
  //       for(let j=0;j<this.productCateOptions[i].children.length;j++){
  //         if(this.productCateOptions[i].children[j].value===id){
  //           name=this.productCateOptions[i].children[j].label;
  //           return name;
  //         }
  //       }
  //     }
  //     return name;
  //   },
  //   handleNext(formName){
  //     this.$refs[formName].validate((valid) => {
  //       if (valid) {
  //         this.$emit('nextStep');
  //       } else {
  //         this.$message({
  //           message: '验证失败',
  //           type: 'error',
  //           duration:1000
  //         });
  //         return false;
  //       }
  //     });
  //   },
  //   handleBrandChange(val) {
  //     let brandName = '';
  //     for (let i = 0; i < this.brandOptions.length; i++) {
  //       if (this.brandOptions[i].value === val) {
  //         brandName = this.brandOptions[i].label;
  //         break;
  //       }
  //     }
  //     this.value.brandName = brandName;
  //   }
  // }
}
</script>

<style scoped>
</style>
