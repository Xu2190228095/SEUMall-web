<template>
    <div class="header">
        <el-page-header @back="goBack" style="font-size: 20px; font-weight: 300; color: #000;">
            <template #content>
                <span class="text1"> {{ productName }} </span><!-- title根据商品名变化 -->
            </template>
        </el-page-header>
    </div>

    <div>
        <el-container>
            <el-header class="header1">
                <span class="text2"> {{ shopName }} </span>
                <div class="button-container">
                    <el-button class="custom-button" plain>进入店铺</el-button>
                    <el-button class="custom-button" plain>联系客服</el-button>
                </div>
            </el-header>
            <el-container>
                <el-aside  style="width: 60%; background-image: url('path/to/your/image.jpg'); background-size: cover; background-position: center;">
                    图片
                </el-aside>
                <el-main>
                    <el-row class="product-name">
                        {{ productName }}
                    </el-row>
                    <el-row class="product-price">
                        商品价格
                    </el-row>
                    <el-row>
                        <el-button-group v-model="selectedSpec" class="button-group">
                            <el-button :class="{ 'is-active': selectedSpec === 'spec1' }" @click="selectedSpec = 'spec1'">
                            规格1
                            </el-button>
                            <el-button :class="{ 'is-active': selectedSpec === 'spec2' }" @click="selectedSpec = 'spec2'">
                            规格2
                            </el-button>
                            <el-button :class="{ 'is-active': selectedSpec === 'spec3' }" @click="selectedSpec = 'spec3'">
                            规格3
                            </el-button>
                        </el-button-group>
                    </el-row>
                    <el-row>
                        <div style="margin-top: 10px; justify-content: center;">
                            <el-button class="custom-button1" plain>立即购买</el-button>
                            <el-button class="custom-button1" color="orange" plain>加入购物车</el-button>
                        </div>
                    </el-row>
                </el-main>
            </el-container>
        </el-container>
    </div>

</template>

<script>

export default {
  data() {
    return {
      selectedSpec: 'spec1',  // 默认选中 '规格1'
      productName: 'Mutrain慕春影数码口袋照相机学生党ccd高清旅游随身小型女入门版', // 示例商品名
      shopName: 'Mutrain慕春影旗舰店',
    };
  },
  methods: {
    goBack() {
        console.log('go back');
      // 返回操作的代码
    }
  }
};

</script>

<style scoped>

.header{
    display: flex;
    width: 100%; /* 或者固定值，比如 200px */
    height: 50px; /* 或者你需要的高度 */
    background-color: #fff;
    align-items: center; /* 垂直居中对齐 */
    /* text-align: left; 文本靠左 */
}

.header1{
    display: flex; /* 使用 Flexbox 布局 */
    justify-content: space-between; /* 两侧对齐，标题在左，按钮在右 */
    width: 100%; /* 或者固定值，比如 200px */
    height: 80px; /* 或者你需要的高度 */
    margin-top: 10px;
    border-radius: 20px;
    background-color: #f0f0f0;
    /* text-align: left; 文本靠左 */
    padding: 10px; /* 内边距，控制容器大小 */
    align-items: center; /* 垂直居中对齐 */
}

.text1{
    margin-top: 10px;
    height: 50px; 
    color: #000;
    text-align: left; /* 文本靠左 */
    font-size: 25px; /* 字体大小 */
    font-weight: 1000;
}

.text2{
    font-size: 25px; /* 标题的字体大小 */
    color: #000;
    font-weight: 500;
    /*text-align: left;  文本靠左 */
}

.button-container {
    display: flex; /*使用 Flexbox 布局*/
    justify-content: flex-end; /* 水平方向靠右对齐 */
    gap: 10px; /* 按钮之间的间距 */
    /* margin-bottom: 10px; 与其他内容的间距 */
}

.custom-button {
    padding: 10px 20px; /* 内边距，调整按钮大小 */
    font-size: 16px; /* 字体大小 */
    border-radius: 5px; /* 圆角效果 */
    background-color: #fead21; /* 背景色 */
    color: white; /* 字体颜色 */
    border: 0px solid #FFFFFF00; /* 边框颜色 */
    margin-right: 10px;
}

.custom-button:hover {
    background-color: #ffc258; /* 悬停时背景色 */
    border-color: #FFFFFF00; /* 悬停时边框颜色 */
    color: #fff; /* 悬停时字体颜色 */
}

.button-group {
    display: flex;
    gap: 30px;
    flex-direction: column; 
    width: 90%; /* 保证按钮的宽度占满父容器 */
    border-radius: 5px; /* 圆角效果 */
}

.button-group .el-button {
    font-size: 18px; /* 调整按钮字体大小 */
    padding: 20px 20px; /* 调整按钮的内边距 */
    border-radius: 5px; /* 圆角效果 */
    background-color: #FFFFFF; /* 背景色 */
    color: #000; /* 字体颜色 */
    border: 1px solid #f8e0a4; /* 边框颜色 */
}

.button-group .el-button:hover {
    background-color: #f8b94c; /* 悬停时背景色 */
    border-color: #FFFFFF00; /* 悬停时边框颜色 */
    color: #fff; /* 悬停时字体颜色 */
}

.button-group .el-button.is-active {
    background-color: #f8b94c; /* 设置选中时的背景颜色 */
    color: white; /* 选中时的文字颜色 */
    border-color: #FFFFFF; /* 悬停时边框颜色 */
    border-radius: 5px; /* 圆角效果 */
}

.product-name{
    font-size: 40px;
    color: #000;
    font-weight: 1000;
    margin-bottom: 30px;
}

.product-price{
    font-size: 25px;
    color: #000;
    font-weight: 500;
    margin-bottom: 10px;
}

.custom-button1 {
    padding: 20px 25px; /* 内边距，调整按钮大小 */
    font-size: 20px; /* 字体大小 */
    border-radius: 5px; /* 圆角效果 */
    margin-right: 20px;
}
</style>