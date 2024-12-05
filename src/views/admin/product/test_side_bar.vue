<template>
  <div class="sidebar">
    <ul>
      <li v-for="category in categories" :key="category.id">
        <router-link :to="category.link">
          {{ category.name }}
        </router-link>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'Sidebar',
  data() {
    return {
      // 固定的类别数据
      categories: [
        { id: 1, name: 'product_info', link: { name: 'product_info' }  },
        { id: 2, name: '添加商品', link: { name: 'product_add' }  },
        { id: 3, name: '订单列表', link: { name: 'order_info' }  },
        { id: 4, name: '退货处理', link: { name: 'refund_deal' }  },
      ],
    };
  },
  methods: {
    handleClick(categoryName) {
      // 这里可以添加点击事件的处理逻辑
      // 比如导航到某个页面或者显示一个弹窗等
      console.log(`Clicked on category: ${categoryName}`);
    },
  },
};
</script>

<style scoped>
.sidebar {
  width: 20%;
  background-color: #333;
  color: white;
  padding: 20px;
  position: fixed;
  height: 100%;
  top: 0;
  left: 0;
  overflow-y: auto;
}

.sidebar ul {
  list-style-type: none;
  padding: 0;
}

.sidebar li {
  margin-bottom: 10px;
}

.sidebar a {
  color: white;
  text-decoration: none;
  display: block;
  padding: 10px;
  border-radius: 5px;
}

.sidebar a:hover {
  background-color: #444;
}
</style>