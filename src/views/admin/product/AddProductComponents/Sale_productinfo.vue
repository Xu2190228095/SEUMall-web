<template>
  <div style="margin-top: 50px">
    <el-form :model="value" ref="productSaleForm" label-width="120px" class="form-inner-container" size="small">
      <el-form-item label="商品上架：">
        <el-switch
          v-model="value.publishStatus"
          :active-value="1"
          :inactive-value="0">
        </el-switch>
      </el-form-item>
      <el-form-item label="商品推荐：">
        <span style="margin-right: 10px">新品</span>
        <el-switch
          v-model="value.newStatus"
          :active-value="1"
          :inactive-value="0">
        </el-switch>
        <span style="margin-left: 10px;margin-right: 10px">推荐</span>
        <el-switch
          v-model="value.recommandStatus"
          :active-value="1"
          :inactive-value="0">
        </el-switch>
      </el-form-item>
      <el-form-item label="服务保证：">
        <el-checkbox-group v-model="selectServiceList">
          <el-checkbox :label="1">无忧退货</el-checkbox>
          <el-checkbox :label="2">快速退款</el-checkbox>
          <el-checkbox :label="3">免费包邮</el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <el-form-item label="详细页标题：">
        <el-input v-model="value.detailTitle"></el-input>
      </el-form-item>
      <el-form-item label="详细页描述：">
        <el-input v-model="value.detailDesc"></el-input>
      </el-form-item>
      <el-form-item label="商品关键字：">
        <el-input v-model="value.keywords"></el-input>
      </el-form-item>
      <el-form-item label="商品备注：">
        <el-input v-model="value.note" type="textarea" :autoSize="true"></el-input>
      </el-form-item>
      <el-form-item v-show="value.promotionType===1">
        <div>
          开始时间：
          <el-date-picker
            v-model="value.promotionStartTime"
            type="datetime"
            :picker-options="pickerOptions1"
            placeholder="选择开始时间">
          </el-date-picker>
        </div>
        <div class="littleMargin">
          结束时间：
          <el-date-picker
            v-model="value.promotionEndTime"
            type="datetime"
            :picker-options="pickerOptions1"
            placeholder="选择结束时间">
          </el-date-picker>
        </div>
        <div class="littleMargin">
          促销价格：
          <el-input style="width: 220px" v-model="value.promotionPrice" placeholder="输入促销价格"></el-input>
        </div>

      </el-form-item>
      <el-form-item v-show="value.promotionType===2">
        <div v-for="(item, index) in value.memberPriceList" :class="{littleMargin:index!==0}">
          {{item.memberLevelName}}：
          <el-input v-model="item.memberPrice" style="width: 200px"></el-input>
        </div>
      </el-form-item>
      <el-form-item v-show="value.promotionType===3">
        <el-table :data="value.productLadderList"
                  style="width: 80%" border>
          <el-table-column
            label="数量"
            align="center"
            width="120">
            <template slot-scope="scope">
              <el-input v-model="scope.row.count"></el-input>
            </template>
          </el-table-column>
          <el-table-column
            label="折扣"
            align="center"
            width="120">
            <template slot-scope="scope">
              <el-input v-model="scope.row.discount"></el-input>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            label="操作">
            <template slot-scope="scope">
              <el-button type="text" @click="handleRemoveProductLadder(scope.$index, scope.row)">删除</el-button>
              <el-button type="text" @click="handleAddProductLadder(scope.$index, scope.row)">添加</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
      <el-form-item v-show="value.promotionType===4">
        <el-table :data="value.productFullReductionList"
                  style="width: 80%" border>
          <el-table-column
            label="满"
            align="center"
            width="120">
            <template slot-scope="scope">
              <el-input v-model="scope.row.fullPrice"></el-input>
            </template>
          </el-table-column>
          <el-table-column
            label="立减"
            align="center"
            width="120">
            <template slot-scope="scope">
              <el-input v-model="scope.row.reducePrice"></el-input>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            label="操作">
            <template slot-scope="scope">
              <el-button type="text" @click="handleRemoveFullReduction(scope.$index, scope.row)">删除</el-button>
              <el-button type="text" @click="handleAddFullReduction(scope.$index, scope.row)">添加</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
      <el-form-item style="text-align: center">
        <el-button size="medium" @click="handlePrev">上一步，填写商品信息</el-button>
        <el-button type="primary" size="medium" @click="handleNext">完成</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  // import {fetchList as fetchMemberLevelList} from '@/api/memberLevel'
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
    name: "ProductSaleDetail",
    props: {
      value: Object,
      isEdit: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        //日期选择器配置
        value:Object.assign({}, defaultProductParam),
      }
    }
  }

</script>

<style scoped>
  .littleMargin {
    margin-top: 10px;
  }
</style>
