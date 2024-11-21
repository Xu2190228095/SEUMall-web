<template>
  <el-header>
    <div>
      <span>Vue3商城后台管理系统</span>
    </div>
    <el-button type="info" @click="logout">退出</el-button>
  </el-header>
</template>

<script setup>

</script>

<style lang="scss" scoped>
.el-header {
  background-color: #373d41;
  position: relative;
  display: flex;
  justify-content: space-between;
  padding-left: 0;
  align-items: center;
  color: #fff;
  font-size: 20px;

  > div {
    display: flex;
    align-items: center;

    span {
      margin-left: 15px;
    }
  }

  img {
    width: 50px;
    height: 50px;
  }
}

.el-aside {
  position: absolute;
  left: 0;
  bottom: 0;
  top: 60px;
  background-color: #333744;

  .el-menu {
    border-right: none;
  }
}

.el-main {
  position: absolute;
  left: 200px;
  right: 0;
  bottom: 0;
  top: 60px;
  background-color: #eaedf1;
}

.iconfont {
  margin-right: 10px;
}

.toggle-button {
  background-color: #4a5064;
  font-size: 10px;
  line-height: 24px;
  color: #fff;
  text-align: center;
  letter-spacing: 0.2em;
  cursor: pointer;
}
</style>
