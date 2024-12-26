<template>
  <div class="container">
    <h1>我的地址</h1>

    <!-- 显示地址列表 -->
    <ul v-if="addresses.length > 0" class="address-list">
      <li v-for="address in addresses" :key="address.id" class="address-item">
        <div class="address-info">
          <p><strong>姓名:</strong> {{ address.name }}</p>
          <p><strong>电话:</strong> {{ address.phone }}</p>
          <p><strong>地址:</strong> {{ address.detailedAddress }}</p>
        </div>
        <div class="address-actions">
          <button @click="deleteAddressById(address.id)" class="btn-delete">删除</button>
        </div>
      </li>
    </ul>

    <p v-else>No addresses available.</p>

    <!-- 添加新地址按钮 -->
    <button @click="openAddAddressDialog" class="btn-add">添加新地址</button>

    <!-- 弹出添加地址的对话框 -->
    <div v-if="showAddAddressDialog" class="dialog">
      <div class="dialog-content">
        <h2>添加新地址</h2>
        <form @submit.prevent="addNewAddress">
          <label for="name">姓名</label>
          <input v-model="newAddress.name" type="text" id="name" required />

          <label for="phone">电话</label>
          <input v-model="newAddress.phone" type="text" id="phone" required />

          <label for="country">国</label>
          <input v-model="newAddress.country" type="text" id="country" required />

          <label for="province">省</label>
          <input v-model="newAddress.province" type="text" id="province" required />

          <label for="city">市</label>
          <input v-model="newAddress.city" type="text" id="city" required />

          <label for="detailedAddress">详细地址</label>
          <input v-model="newAddress.detailedAddress" type="text" id="detailedAddress" required />

          <div class="dialog-actions" style = "margin-top: 20px; margin-bottom: 10px;">
            <button type="submit" class="btn-submit">添加</button>
            <button @click="closeAddAddressDialog" class="btn-cancel" type="button">取消</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { getAddressesByCid, addAddress, deleteAddress } from '../../api/address'; // 引入封装的 API 函数

export default {
  data() {
    return {
      addresses: [], // 存储地址列表
      newAddress: {   // 新地址表单
        name: '',
        phone: '',
        country: '',
        province: '',
        city: '',
        detailedAddress: ''
      },
      showAddAddressDialog: false, // 控制添加地址对话框的显示与隐藏
    };
  },
  methods: {
    // 查询地址（通过 cid）
    async fetchAddresses(cid) {
      try {
        const response = await getAddressesByCid(cid);
        this.addresses = response.data || []; // 将返回的数据赋值给 addresses
        console.log(response.data);
      } catch (error) {
        console.error('Error fetching addresses:', error);
      }
    },

    // 打开添加新地址的对话框
    openAddAddressDialog() {
      this.showAddAddressDialog = true;
    },

    // 关闭添加新地址的对话框
    closeAddAddressDialog() {
      this.showAddAddressDialog = false;
    },

    // 添加新地址
    async addNewAddress() {
      try {
        // 获取当前用户的 cid（假设存储在 localStorage 中）
        const cid = localStorage.getItem('cid');
        if (!cid) {
          throw new Error('User cid not found');
        }

        // 将 cid 自动添加到地址数据中
        const addressWithCid = { ...this.newAddress, cid: parseInt(cid) };

        // 调用 addAddress API，将新的地址信息传递给后端
        const response = await addAddress(addressWithCid);

        // 将新地址添加到地址列表
        this.addresses.push(response.data);

        // 地址添加成功后，重新刷新地址列表
        await this.fetchAddresses(cid);  // 重新获取地址列表

        // 重置表单
        this.newAddress = {
          name: '',
          phone: '',
          country: '',
          province: '',
          city: '',
          detailedAddress: ''
        };

        // 关闭弹出框
        this.closeAddAddressDialog();
      } catch (error) {
        console.error('Error adding address:', error);
      }
    },


    // 删除地址
    async deleteAddressById(addressId) {
      try {
        await deleteAddress(addressId);
        this.addresses = this.addresses.filter(address => address.id !== addressId); // 从地址列表中移除已删除地址
      } catch (error) {
        console.error('Error deleting address:', error);
      }
    }
  },

  mounted() {
    this.fetchAddresses(localStorage.getItem('cid'));  // 组件挂载时加载用户地址
  }
};
</script>

<style scoped>
.container {
  background-color: #f0f8ff;
  padding: 20px;
  border-radius: 10px;
  max-width: 800px;
  margin: 0 auto;
}

h1 {
  text-align: center;
  color: #2c3e50;
}

.address-list {
  list-style-type: none;
  padding: 0;
}

.address-item {
  background-color: #fff;
  padding: 15px;
  margin-bottom: 15px;
  border-radius: 8px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.address-info {
  font-size: 16px;
  color: #34495e;
}

.address-actions {
  text-align: right;
}

button {
  padding: 8px 15px;
  border: none;
  cursor: pointer;
  border-radius: 5px;
}

.btn-delete {
  background-color: #e74c3c;
  color: white;
}

.btn-delete:hover {
  background-color: #c0392b;
}

.btn-add {
  display: block;
  width: 200px;
  margin: 20px auto;
  background-color: #3498db;
  color: white;
  padding: 15px;
  font-size:15px;
}

.btn-add:hover {
  background-color: #2980b9;
}

.dialog {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.dialog-content {
  background-color: white;
  padding: 30px;
  width: 400px;
  border-radius: 8px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
}

label {
  display: block;
  margin-top: 10px;
  font-weight: bold;
  color: #34495e;
}

input {
  width: 100%;
  padding: 10px;
  margin-top: 5px;
  margin-bottom: 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 16px;
}

.dialog-actions {
  display: flex;
  justify-content: space-between;
}

.btn-submit {
  background-color: #2ecc71;
  color: white;
  width: 48%;
}

.btn-submit:hover {
  background-color: #27ae60;
}

.btn-cancel {
  background-color: #95a5a6;
  color: white;
  width: 48%;
}

.btn-cancel:hover {
  background-color: #7f8c8d;
}
</style>
