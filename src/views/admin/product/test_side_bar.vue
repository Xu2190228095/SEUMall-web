<template>
  <div class="sidebar">
    <ul>
      <li v-for="category in categories" :key="category.id">
        <a :href="category.link" @click.prevent="handleClick(category.name)">
          {{ category.name }}
        </a>
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
        { id: 1, name: 'Home', link: '#' },
        { id: 2, name: 'About', link: '#' },
        { id: 3, name: 'Services', link: '#' },
        { id: 4, name: 'Contact', link: '#' },
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
  width: 250px;
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