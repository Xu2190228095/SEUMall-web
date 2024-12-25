<template>
  <div class="user-profile">
    <div class="profile-container">
      <h2>个人信息</h2>
      
      <!-- 展示个人信息 -->
      <div v-if="!isEditing" class="profile-info">
        <p><strong>用户名:</strong> {{ userInfo.username }}</p>
        <p><strong>余额:</strong> {{ userInfo.account }}</p>
        <p><strong>邮箱:</strong> {{ userInfo.email }}</p>
        <p><strong>密码:</strong> {{ userInfo.password ? '******' : '未设置' }}</p>

        <!-- 编辑按钮 -->
        <button @click="editProfile" class="btn-edit">编辑</button>
      </div>

      <!-- 编辑个人信息 -->
      <div v-else class="profile-edit">
        <div class="form-group">
          <label for="username">用户名:</label>
          <input v-model="editData.username" type="text" id="username" placeholder="请输入用户名" />
        </div>
        <div class="form-group">
          <label for="account">余额:</label>
          <input v-model="editData.account" type="text" id="account" placeholder="请输入余额" />
        </div>
        <div class="form-group">
          <label for="email">邮箱:</label>
          <input v-model="editData.email" type="email" id="email" placeholder="请输入邮箱" />
        </div>
        <div class="form-group">
          <label for="password">密码:</label>
          <input v-model="editData.password" type="password" id="password" placeholder="请输入新密码" />
        </div>

        <!-- 保存按钮 -->
        <button @click="saveProfile" class="btn-save">保存</button>
        <button @click="cancelEdit" class="btn-cancel">取消</button>
      </div>
    </div>
  </div>
</template>

<script>
import { getCustomerByCid, updateCustomer } from '../../api/address';  // 导入接口方法

export default {
  data() {
    return {
      isEditing: false,  // 是否处于编辑模式
      userInfo: {},      // 存储用户信息
      editData: {        // 存储编辑的用户数据
        username: '',
        account: '',
        email: '',
        password: '',
      }
    };
  },
  mounted() {
    this.loadUserInfo();  // 页面加载时获取用户信息
  },
  methods: {
    // 获取用户信息
    loadUserInfo() {
      const cid = localStorage.getItem('cid');  // 从localStorage获取cid
      if (cid) {
        getCustomerByCid(cid)
          .then(response => {
            this.userInfo = response.data;
            // 初始化编辑数据
            this.editData = { ...this.userInfo };
          })
          .catch(error => {
            console.error('获取用户信息失败', error);
          });
      } else {
        console.error('无法获取cid');
      }
    },
    // 切换到编辑模式
    editProfile() {
      this.isEditing = true;
    },
    // 保存编辑后的用户信息
    saveProfile() {
      updateCustomer(this.editData)
        .then(() => {
          this.userInfo = { ...this.editData };  // 更新展示的用户信息
          this.isEditing = false;  // 退出编辑模式
          this.$message.success('用户信息已更新');  // 使用message提示成功
        })
        .catch(error => {
          console.error('更新用户信息失败', error);
          this.$message.error('更新用户信息失败');
        });
    },
    // 取消编辑，恢复原始数据
    cancelEdit() {
      this.isEditing = false;
      this.editData = { ...this.userInfo };  // 恢复为原始数据
    }
  }
};
</script>

<style scoped>
.user-profile {
  max-width: 90%;
  margin: 50px auto;
  padding: 40px;
  background-color: #f2f9ff; /* 浅蓝色背景 */
  border-radius: 12px;
  box-shadow: 0 6px 24px rgba(0, 0, 0, 0.1);
  font-family: Arial, sans-serif;
}

.profile-container {

  padding-bottom: 40px; /* 增加容器底部的内边距 */
}

h2 {
  font-size: 34px; /* 更大的标题字体 */
  margin-bottom: 40px;
  text-align: center;
  color: #0056b3; /* 深蓝色标题 */
}

.profile-info, .profile-edit {
  padding: 22px;
}

.form-group {
  margin-bottom: 30px; /* 增加表单项之间的间距 */
}

.form-group label {
  font-size: 20px; /* 放大标签字体 */
  font-weight: bold;
  color: #0056b3; /* 蓝色标签 */
  margin-bottom: 12px; /* 增加标签和输入框之间的间距 */
  display: block;
}

.form-group input {
  width: 100%;
  padding: 16px;
  font-size: 18px; /* 增加输入框字体大小 */
  border: 1px solid #0056b3;
  border-radius: 10px;
  background-color: #e1efff; /* 浅蓝色背景 */
  color: #333;
  box-sizing: border-box;
}

button {
  padding: 16px 30px;
  font-size: 18px; /* 放大按钮字体 */
  margin-top: 25px;
  border-radius: 10px;
  cursor: pointer;
  border: none;
  transition: background-color 0.3s ease;
}

.btn-edit {
  background-color: #0056b3;
  color: white;
  float: right; /* 编辑按钮右对齐 */
}

.btn-edit:hover {
  background-color: #003f7f; /* 编辑按钮悬停效果 */
}

.btn-save {
  background-color: #28a745;
  color: white;
}

.btn-save:hover {
  background-color: #218838; /* 保存按钮悬停效果 */
}

.btn-cancel {
  background-color: #dc3545;
  color: white;
  margin-left: 20px;
}

.btn-cancel:hover {
  background-color: #c82333; /* 取消按钮悬停效果 */
}

/* 使用flexbox将按钮居中 */
.button-container {
  display: flex;
  justify-content: center;
  margin-top: 30px; /* 增加按钮容器上方的间距 */
}

.button-container button {
  margin: 0 15px; /* 为每个按钮添加左右间距 */
}

.profile-info p {
  font-size: 22px; /* 放大展示信息的字体 */
  line-height: 1.6;
  color: #333;
}

.profile-info .btn-edit {
  font-size: 18px; /* 放大按钮字体 */
  padding: 12px 24px;
  background-color: #007bff; /* 蓝色编辑按钮 */
  color: white;
}

.profile-info .btn-edit:hover {
  background-color: #0056b3; /* 编辑按钮悬停效果 */
}

@media (max-width: 768px) {
  .user-profile {
    margin: 20px;
    padding: 25px;
  }

  h2 {
    font-size: 28px; /* 在小屏幕上稍微调整标题字体 */
  }

  .form-group input {
    font-size: 24px; /* 增加输入框字体大小，适配小屏幕 */
  }

  button {
    font-size: 16px; /* 放大按钮字体 */
    padding: 12px 24px;
  }
}
</style>



