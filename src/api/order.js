import request from './axios';
import axios from './axios';

export function fetchList(params) {
  return request({
    url: '/order/fetchList',
    method: 'get',
    params
  });
}

export function deleteOrder(params) {
  return request({
    url: '/order/deleteOrder',
    method: 'post',
    data: params
  });
}

export function updateOrderStatus(params) {
  return request({
    url: '/order/updateOrderStatus',
    method: 'post',
    data: params
  });
}

export function getOrdersByUserId(params) {
  return request({
    url: '/order/customerOrder',
    method: 'get',
    params
  });
}

// 提交评价的 API
export function submitReview(reviewData) {
  // 构建查询字符串
  const queryParams = new URLSearchParams(reviewData).toString();  // 将对象转换为查询字符串

  // 发送 POST 请求并附加查询参数
  return axios.post(`/order/submitReview?${queryParams}`)
    .then(response => {
      // 成功提交评价后的处理
      return response.data;
    })
    .catch(error => {
      // 错误处理
      throw error;
    });
}

// 确认收货接口
export function confirmReceipt(order_id) {
  return axios.put(`/order/confirm-receipt/${order_id}`)
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      console.error('确认收货失败:', error);
      throw error;
    });
}