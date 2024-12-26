<template>
    <div class="GoodsDetail">
      <el-header class="header">
        <el-button type="primary"
        class="menu-btn"
        style="margin-left: 10px;"
        @click="$router.push('/homePage')">首页</el-button>

        <div class="logo">东南易购</div>
        <el-input
          v-model="searchQuery"
          class="search-bar"
          placeholder="搜索商品"
          style="width: 300px; height: 40px;"
          @keyup.enter="search"
        >
          <template #append>
            <el-button
              type="primary"
              @click="search"
              style="height: 100%; padding: 0 10px;">
              搜索
            </el-button>
          </template>
        </el-input>
      </el-header>

      <div class="content">
        <div class="goodsInfo">
                <!-- 商品图片部分 -->
            <div class="item-detail-left" style="display: inline-block; transform: translate(150px, 0);">
                <div class="item-detail-big-img">
                    <img :src= "productImage1" alt="商品图片" />
                </div>
            </div>
          <div class="infoRight" style="display: inline-block">
            <div class="infoBox">
              <h3 class="name">{{ goodsName }}</h3>
            </div>
            <div class="infoBox">
              <p>{{ goodsDesc }}</p>
            </div>
            <div class="infoBox">
              <h3 class="price">{{ "¥   " + goodsPrice }}</h3>
            </div>
            <div class="infoBox">
              <span>类别： </span>
              <span>{{goodsClass}}</span>
            </div>
            <div class="infoBox">
              <span>数量：</span>
              <NumberInput v-model="num" :min="1" :max="goodsNum" />
            </div>
            <div class="infobox">
              <span>库存：{{ goodsNum }}</span>
            </div>

            <button class="buyBtn" @click="goToBuyPage">立即购买</button>
            <button @click="addToCart">加入购物车</button>
          </div>
        </div>


        <section class="msgBox leftContainer">
            <ul class="tagList">
              <li
                :class="{ selected: curIndex === index }"
                v-for="(item, index) in tagList"
                :key="'tag' + index"
                @click="changeIndex(index)"
              >
                {{ item }}
              </li>
            </ul>

            <div class="commentBody" v-if="curIndex === 0">
              <div v-if="totalComment > 0" class="rateBox">
                <span>平均得分</span>
                <span class="commentAverageScore" style="margin-right: 20px;">{{ commentAverageScore }}</span> <!-- 设置右边距 -->
                <span class="totalCommentsCount">共 {{ totalComment }} 条评论</span>
              </div>

              <div v-if="commentList.length !== 0">
                <ul class="commentList">
                  <li v-for="(item, index) in commentList" :key="'comment' + index">
                    <div class="userInfo">
                      <span>用户{{ item.cid }}</span> <!-- 这里暂时用 cid 代替用户名 -->
                    </div>
                    <div class="commentInfo">
                      <!-- 评分 -->
                      <el-rate
                        v-model="item.score"
                        disabled
                        show-score
                        text-color="#ff9900"
                        score-template="{value}"
                      />
                      <!-- 评论内容 -->
                      <p class="comment">{{ item.comment }}</p> <!-- 这里是评论内容 -->
                      <!-- 评论时间（占位，后端没有时间字段的话可以跳过）-->
                      <p class="time">2024-12-26 12:00</p> <!-- 这里可以加入评论时间 -->
                    </div>
                  </li>
                </ul>
              </div>

              <div class="noComment" v-else>暂时还没有评论~</div>

              <el-pagination
                background
                layout="prev, pager, next"
                @current-change="handlePageChange"
                :page-size= "limit"
                :current-page.sync="page"
                :total="totalComment"
                v-if="totalComment !== 0"
              />

            </div>
          </section>
      </div>
    </div>
  </template>

<script>
import { ref, computed, onMounted } from 'vue';
import axios from 'axios'; // 用于发起 API 请求
import {useRouter } from 'vue-router';
import { fetchProduct} from '../../api/product'; // 引入封装的接口
import { findByPid} from '../../api/comments'; // 引入封装的接口
import NumberInput from '../../components/numberInput.vue';
import productImage1 from '@/assets/images/wahahawater.jpg'

export default {
  name: 'GoodsDetail',
  components: {
    NumberInput,
  },
  setup() {

    const router = useRouter();

    const num=ref(1);
    const goodsId = router.currentRoute.value.query.id;; // 假设商品ID,应该要从商品搜索界面点击从而传输商品id
    const goodsName = ref('');
    const goodsDesc = ref('');
    const goodsPrice = ref('');
    const goodsClass = ref('');
    const goodsImg = ref([]);
    const goodsNum = ref('');
    const goodsPic = ref( );
    const specs = ref([]);
    const selectedSpecs = ref({});
    const commentAverageScore=ref('');
    const commentScoreList=ref([]);
    const commentContentList=ref([]);
    const commentList = ref([]);
    const rate = ref(0);
    const totalComment = ref(0);  // 总评论数
    const limit = ref(5);  // 每页显示的评论数
    const page = ref(1);    // 当前页码

    // 获取商品详情
    const fetchGoodsDetail = async () => {
      try {
        const response = await fetchProduct(goodsId);
        const data = response.data.product;
        console.log("data:",data);
        goodsPic.value=response.data.picture;
        goodsName.value = data.pname;
        goodsDesc.value = data.desc;
        goodsPrice.value = data.price;
        goodsClass.value = data.pclass;
        goodsImg.value = data.img; // 你可以根据实际返回数据结构调整
        goodsNum.value = data.number;
        specs.value = data.specifications || []; // 规格数据
        rate.value = data.averageRating || 0;
        console.log('number:', goodsNum.value);

        // 初始化选中的规格
        specs.value.forEach(spec => {
          selectedSpecs.value[spec.name] = spec.values[0]; // 默认选第一个规格
        });
      } catch (error) {
        console.error('Failed to fetch goods details:', error);
      }
    };

    // 获取评论列表
    const fetchComments = async () => {
      try {
        const response = await findByPid(goodsId); // 获取第一页的评论，每页10条
        const data = response.data;

        commentAverageScore.value = data.reduce((sum, item) => sum + item.score, 0) / data.length;  // 计算评论的平均分
        commentList.value = data;  // 直接将返回的评论数据赋值给 commentList
        totalComment.value=data.length;

        console.log('Fetched comments:', data);  // 打印整个响应数据
        console.log('Comments array:', data.comment);  // 打印评论数据
        console.log('page total:',totalComment);

      } catch (error) {
        console.error('Failed to fetch comments:', error);
      }
    };

    // 删除评论
    const handleDeleteComment = async (commentId) => {
      try {
        await deleteComment(commentId);
        fetchComments(); // 删除后重新获取评论列表
      } catch (error) {
        console.error('Failed to delete comment:', error);
      }
    };

    // 添加商品到购物车
    const handleAddToCart = async () => {
      try {
        await addToCart({
          goodsId,
          quantity: num.value,
          selectedSpecs: selectedSpecs.value
        });
        alert('商品已加入购物车');
      } catch (error) {
        console.error('Failed to add to cart:', error);
      }
    };

    // 立即购买
    const handleBuyNow = async () => {
      try {
        await buyNow({
          goodsId,
          quantity: num.value,
          selectedSpecs: selectedSpecs.value
        });
        alert('购买成功！');
      } catch (error) {
        console.error('Failed to buy:', error);
      }
    };

    const goToBuyPage = () => {
      console.log('按钮点击，准备跳转到支付页面');
      console.log('购买数量',num.value);
      router.push({
        name: 'pay',  // 路由名称
        query: {
          goodsId,  // 商品 ID
          quantity:num.value,
          //selectedSpecs: JSON.stringify(selectedSpecs.value),  // 选中的规格，转换成字符串
        }
      });
    };

    // 当页码改变时，处理分页逻辑
    const handlePageChange = (newPage) => {
      console.log('当前页码:', newPage);
      page.value = newPage;

      // 在这里执行分页请求，例如更新展示的数据
      fetchData(newPage, pageSize);
    };

    const fetchData = (currentPage, pageSize) => {
      // 在这里根据分页参数请求数据并更新组件状态
      console.log('请求数据: ', currentPage, pageSize);
      // 模拟数据请求，可以根据实际需求进行修改
    };

    // 页面加载时获取商品详情和评论
    onMounted(() => {
      fetchGoodsDetail();
      fetchComments();
    });

    return {
      num,
      totalComment,
      limit,
      page,
      goodsName,
      goodsDesc,
      goodsPrice,
      goodsImg,
      goodsNum,
      goodsClass,
      specs,
      selectedSpecs,
      commentList,
      rate,
      handleDeleteComment,
      handleAddToCart,
      handleBuyNow,
      goToBuyPage,
      productImage1,
      commentAverageScore,
      commentScoreList,
      commentContentList,
      newComment: {
            content: '',
            score: 5,
          },
      curIndex: 0,
      commentList
    };

  }
};
</script>

<style scoped>

.logo {
  font-size: 24px;
  font-weight: bold;
  margin-left: 20px;
  margin-right: 20px;  /* 增加与搜索框的距离 */
}

.GoodsDetail {
  .content {
    width: 100%;
    padding-top: 100px;

    .goodsInfo {
      width: 100%;
      overflow: hidden;

      .item-detail-big-img img {
        height: auto;
        max-width: 500px;  /* 控制最大宽度 */
        object-fit: contain;  /* 保持图片比例 */
        width: 100%;
      }

      .item-detail-img-row {
        margin-top: 15px;
        display: flex;
      }


      .item-detail-left {
        width: 350px;
        margin-right: 30px;
      }

      .item-detail-big-img {
        height: autopx;
        width: 500px;
        box-shadow: 0px 0px 8px rgba(0, 102, 204, 0.4);
        cursor: pointer;
      }

      .infoLeft {
        display: inline-block;
        width: 400px;
        height: 400px;
        float: left;
      }

      .infoRight {
        display: inline-block;
        float: right;
        width: 700px;

        .infoBox {
          margin-bottom: 30px;

          .name {
            font-size: 40px;
            color: #003366;
          }

          p {
            color: #444;
            font-size: 15px;
          }

          .price {
            font-size: 35px;
            color: #005b96;
          }

          span {
            color: #444;
            font-size: 20px;
            display: inline-block;
            width: 100px;
          }

          .tips {
            width: auto;
            margin: 0 20px 0 5px;
          }

          .NumberInput {
            display: inline-block;
            vertical-align: middle;
          }
        }

        button {
          background-color: #007acc;
          width: 170px;
          height: 50px;
          color: white;
          border: none;
          font-size: 19px;
          margin-right: 20px;
          margin-top: 10px;

          &:hover {
            opacity: 0.8;
          }
        }

        .buyBtn {
          border: 1px solid #007acc;
          color: #007acc;
          background-color: #e6f4fc;
        }
      }
    }

    .msgBox {
      margin: 50px 0;
      border: 1px solid #b3cde0;
      padding-top: 0;

      .tagList {
        width: 100%;
        height: 40px;
        border-bottom: 1px solid #b3cde0;
        background-color: #f0f8ff;

        li {
          width: 170px;
          height: 42px;
          position: relative;
          top: -2px;
          display: inline-block;
          text-align: center;
          line-height: 40px;
          font-size: 13px;
          cursor: pointer;

          &:hover {
            color: #005b96;
          }
        }

        .selected {
          background-color: #ffffff;
          border-top: 4px solid #005b96;
        }
      }

      .commentBody {
        padding: 20px;
        min-height: 300px;

        .rateBox {
          margin-bottom: 10px;

          span {
            color: #444;
            display: inline-block;
            margin-right: 10px;
          }

          .commentAverageScore {
            color: #ff5722;
            font-weight: 600;
            font-size: 30px;
          }
        }

        .commentList {
          width: 100%;

          li {
            width: 100%;
            display: block;
            margin: 0 auto;
            border-bottom: 1px solid #b3cde0;
            padding: 20px 0;

            .userInfo {
              transform: translateX(5%);
              width: 80px;
              height: 30px;
              display: flex;
              text-align: center;

              img {
                margin: auto;
                display: block;
                width: 30px;
                height: 30px;
                border-radius: 50%;
                margin-bottom: 6px;
              }

              span {
                font-size: 13px;
                color: #444;
              }
            }

            .commentInfo {
              transform: translateX(5%);
              display: inline-block;
              vertical-align: top;
              width: 100%;

              .specName,
              .time {
                color: #444;
                font-size: 13px;
                margin-top: 10px;
              }

              .comment {
                margin-top: 10px;
              }

              button {
                float: right;
                margin-right: 10%;
              }

              .commentImages {
                display: flex;
              }

              .commentimg {
                height: 120px;
                box-shadow: 0px 0px 8px #ccc;
                margin-left: 5px;
              }

              .commentimg img {
                height: 100%;
              }
            }
          }
        }

        .noComment {
          width: 100%;
          text-align: center;
          color: #005b96;
          padding-top: 30px;
        }
      }

      .msgBody {
        padding: 20px;
        min-height: 300px;

        .inputBox {
          margin-top: 20px;

          textarea {
            width: 88%;
            height: 50px;
            padding: 5px;
            border: 2px solid #b3cde0;
            display: inline-block;
            overflow: hidden;
            font-size: 14px;
            color: #333;
          }

          button,
          .banAsk {
            float: right;
            width: 10%;
            height: 50px;
            position: relative;
            display: inline-block;
            overflow: hidden;
            background-color: white;
            border: 2px solid #007acc;
            color: #007acc;
          }

          .banAsk {
            background-color: #007acc;
            text-align: center;
            font-size: 12px;
            line-height: 50px;
            color: white;
            user-select: none;
          }
        }

        .msgList {
          margin-top: 20px;

          li {
            border-bottom: 1px solid #b3cde0;
            padding: 10px 0;

            .ask,
            .answer {
              margin: 8px 0;
              width: 100%;

              .note {
                display: inline-block;
                color: white;
                text-align: center;
                width: 20px;
                height: 20px;
                border-radius: 50%;
                font-size: 10px;
                line-height: 20px;
              }

              .text {
                font-size: 14px;
              }

              .tipsInfo {
                float: right;
                font-size: 14px;
                color: #444;
              }
            }

            .ask {
              .note {
                background-color: #ff5722;
              }
            }

            .answer {
              .note {
                background-color: #007acc;
              }
            }
          }
        }
      }
    }

    .typeGoods {
      margin: 50px 0;
      border: 1px solid #b3cde0;
      padding-top: 0;

      .title {
        text-align: center;
        width: 100%;
        height: 40px;
        line-height: 40px;
        background-color: #f0f8ff;
        font-weight: 600;
        border-bottom: 1px solid #b3cde0;
        color: #003366;
      }

      .list {
        .GoodsItem {
          display: block;
          border-bottom: 1px dotted #b3cde0;
          margin: 0 auto;
        }
      }
    }
  }

  .ban {
    user-select: none;
    cursor: not-allowed;
  }

  /* header {
    width: 100%;
    background-color: #4877ec;
    height: 50px;
    color: #ffffff;
    user-select: none;
    z-index: 10000;
    position: absolute;
    left: 0;
    top: 0;

    .container {
      position: relative;
      height: 50px;

      .title {
        position: absolute;
        left: 20px;
        display: inline-block;
        height: 26px;
        top: 50%;
        margin-top: -18px;
        line-height: 35px;
        font-size: 30px;
        cursor: pointer;
      }

      .NoticeListBox {
        position: absolute;
        left: 200px;
      }

      .right {
        position: absolute;
        right: 20px;
        display: inline-block;
        height: 26px;
        top: 50%;
        margin-top: -13px;
        line-height: 26px;
        font-size: 18px;

        span {
          margin-left: 20px;
          cursor: pointer;
        }

        .name {
          cursor: default;
        }
      }
    }
  } */

  .header {
    background-color: #409EFF;
    padding: 10px 0;
    color: white;
    display: flex;
    justify-content: center;  /* 让内容水平居中 */
    align-items: center;      /* 让内容垂直居中 */
  }

  .search-bar {
    width: 300px;
    height: 40px;
  }
}

</style>
